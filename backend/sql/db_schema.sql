-- 1. Identity & Access Management
CREATE TABLE IF NOT EXISTS Organizations (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    owner_id VARCHAR(36) NOT NULL,
    plan_tier ENUM('Free', 'Pro', 'Enterprise') DEFAULT 'Free',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Users (
    id VARCHAR(36) PRIMARY KEY,
    org_id VARCHAR(36) NOT NULL,
    username VARCHAR(150) NOT NULL,
    email VARCHAR(200) UNIQUE NOT NULL,
    password_hash VARCHAR(500) NOT NULL,
    role ENUM('Owner', 'Admin', 'Developer', 'Viewer') DEFAULT 'Developer',
    FOREIGN KEY (org_id) REFERENCES Organizations(id)
);

-- 2. Project Hierarchy
CREATE TABLE IF NOT EXISTS Projects (
    id VARCHAR(36) PRIMARY KEY,
    org_id VARCHAR(36) NOT NULL,
    project_name VARCHAR(100) NOT NULL,
    default_region ENUM('us-east', 'eu-west', 'asia-south') DEFAULT 'asia-south',
    FOREIGN KEY (org_id) REFERENCES Organizations(id) ON DELETE CASCADE
);

-- 3. Infrastructure Fleet
CREATE TABLE IF NOT EXISTS Nodes (
    id VARCHAR(36) PRIMARY KEY,
    node_label VARCHAR(100),
    public_ip VARCHAR(45),
    private_ip VARCHAR(45),
    total_cpu_cores INT,
    total_ram_mb INT,
    available_ram_mb INT,
    status ENUM('Active', 'Maintenance', 'Full', 'Offline') DEFAULT 'Active'
);

-- 4. Services (The Runtime)
CREATE TABLE IF NOT EXISTS Services (
    id VARCHAR(36) PRIMARY KEY,
    project_id VARCHAR(36) NOT NULL,
    node_id VARCHAR(36) NOT NULL,
    name VARCHAR(150) NOT NULL,
    service_type ENUM('Web_Service', 'Private_Worker', 'Database') DEFAULT 'Web_Service',
    runtime_env ENUM('n8n', 'openclaw', 'python', 'java', 'nodeks', 'docker') NOT NULL,
    
    -- Resource Specs
    cpu_limit FLOAT NOT NULL DEFAULT 0.1,
    ram_limit_mb INT NOT NULL DEFAULT 256,
    replica_count INT DEFAULT 1,
    
    -- Status
    container_id VARCHAR(150),
    current_status ENUM('Building', 'Starting', 'Healthy', 'Unhealthy', 'Sleeping') DEFAULT 'Building',
    
    FOREIGN KEY (project_id) REFERENCES Projects(id),
    FOREIGN KEY (node_id) REFERENCES Nodes(id)
);

-- 5. Unified Deployment Sources (Decoupled from Service)
CREATE TABLE IF NOT EXISTS Service_Sources (
    id VARCHAR(36) PRIMARY KEY,
    service_id VARCHAR(36) NOT NULL,
    source_type ENUM('Docker_Image', 'Git_Repository') NOT NULL,
    
    -- Image Data (For n8n, OpenClaw)
    image_name VARCHAR(255), 
    image_tag VARCHAR(50) DEFAULT 'latest',
    
    -- Git Data (For Python, Java, Nodeks)
    repo_url VARCHAR(255),
    branch VARCHAR(100),
    build_command TEXT,
    start_command TEXT,
    
    FOREIGN KEY (service_id) REFERENCES Services(id) ON DELETE CASCADE
);

-- 6. Networking & Domain Management
CREATE TABLE IF NOT EXISTS Project_Domains (
    id VARCHAR(36) PRIMARY KEY,
    project_id VARCHAR(36) NOT NULL,
    service_id VARCHAR(36), 
    domain_type ENUM('Shared_Subdomain', 'Custom_Domain') NOT NULL,
    hostname VARCHAR(255) UNIQUE NOT NULL,
    
    ssl_enabled BOOLEAN DEFAULT TRUE,
    ssl_status ENUM('Provisioning', 'Active', 'Failed') DEFAULT 'Provisioning',
    base_path VARCHAR(50) DEFAULT '/',
    
    FOREIGN KEY (project_id) REFERENCES Projects(id),
    FOREIGN KEY (service_id) REFERENCES Services(id)
);

-- 7. Config & Environment Secrets
CREATE TABLE IF NOT EXISTS Environment_Variables (
    id VARCHAR(36) PRIMARY KEY,
    service_id VARCHAR(36) NOT NULL,
    env_key VARCHAR(255) NOT NULL,
    env_value TEXT NOT NULL, 
    is_secret BOOLEAN DEFAULT FALSE, 
    FOREIGN KEY (service_id) REFERENCES Services(id) ON DELETE CASCADE
);

-- 8. Usage Tracking & Analytics
CREATE TABLE IF NOT EXISTS Usage_Metrics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    service_id VARCHAR(36) NOT NULL,
    cpu_usage_percent FLOAT,
    ram_usage_mb INT,
    bandwidth_out_kb BIGINT,
    captured_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES Services(id) ON DELETE CASCADE
);