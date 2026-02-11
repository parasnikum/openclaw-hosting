
-- User Schema
CREATE TABLE User {
    id VARCHAR(500) PRIMARY NOT NULL UNIQUE,
    username VARCHAR(150) PRIMARY NOT NULL,
    email VARCHAR(200) UNIQUE NOT NULL;
    created_at VARCHAR(200) UNIQUE NOT NULL;
    password VARCHAR(500) UNIQUE NOT NULL;
    isVerified VARCHAR(200) BOOLEAN DEFAULT(FALSE);
}

-- Server Schema
CREATE TABLE Server {
    id VARCHAR(500) PRIMARY NOT NULL UNIQUE,
    server_name VARCHAR(150),
    on_node VARCHAR(150),
    resource_limits JSON,
    links VARCHAR(150),
    ip VARCHAR(150),
    hostname VARCHAR(150),
    container_id VARCHAR(150),
}

-- Service
CREATE TABLE Service {
    id VARCHAR(500) PRIMARY NOT NULL UNIQUE,
    service_name VARCHAR(150),
    plan_id VARCHAR(150) ,
    renewal_date VARCHAR(150) ,
    purchased_on VARCHAR(150) ,
    user_ID VARCHAR(150) ,
    STATUS ENUM("Active","Pending","Suspended")
    container_id VARCHAR(150),
}


-- Plan
CREATE TABLE Plan {
    id VARCHAR(500) PRIMARY NOT NULL UNIQUE,
    plan_name VARCHAR(150),
    config JSON ,
    duration VARCHAR(150) ,
    STATUS ENUM("Active","Inactive")
    price VARCHAR(150) ,
    features VARCHAR(150) ,
}


-- Invoice
CREATE TABLE Invoice {
    id VARCHAR(500) PRIMARY NOT NULL UNIQUE,
    service_id VARCHAR(150),
    EXIPRY_DATE DATE ,
    price VARCHAR(150) ,
    user_id VARCHAR(150) ,
    link VARCHAR(150) ,
    STATUS ENUM("Paid","Unpaid","Expire","Cancelled")
}



-- Transaction
CREATE TABLE Transaction {
    transaction_id VARCHAR(500) PRIMARY NOT NULL UNIQUE,
    service_id VARCHAR(150),
    user_id VARCHAR(150) ,
    created_at VARCHAR(150),
    price VARCHAR(150) ,
    payment_mode VARCHAR(150) ,
    order_id VARCHAR(150) ,
    gateway VARCHAR(150) ,
    STATUS ENUM("Paid","Pending","Failed")
}




-- BACKUP
CREATE TABLE Backups {
    backup_id VARCHAR(500) PRIMARY NOT NULL UNIQUE,
    name VARCHAR(150),
    service_id VARCHAR(150),
    user_id VARCHAR(150) ,
    local_path VARCHAR(150) ,
    backup_url VARCHAR(150) ,
    created_at VARCHAR(150),
    size VARCHAR(150) ,
}

-- ENV
CREATE TABLE ENV {
    env_id VARCHAR(500) PRIMARY NOT NULL UNIQUE,
    env_vars JSON,
    config JSON,
    data_volumes JSON,
    service_id VARCHAR(150),
}


-- NODE
CREATE TABLE Node {
    node_id VARCHAR(150) NOT NULL UNIQUE PRIMARY,
    MAX_SERVERS VARCHAR(150) ,
    resource_limits VARCHAR(150),
    domain VARCHAR(150),
    ip VARCHAR(150),
    port VARCHAR(150),
    allowed VARCHAR(150),
}

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