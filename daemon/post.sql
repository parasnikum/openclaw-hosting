/* =========================================================
   PostgreSQL Full Schema – Single File
   ========================================================= */


/* =======================
   ENUM TYPES
   ======================= */

CREATE TYPE service_status AS ENUM ('Active', 'Pending', 'Suspended', 'Provising');
CREATE TYPE plan_status AS ENUM ('Active', 'Inactive');
CREATE TYPE invoice_status AS ENUM ('Paid', 'Unpaid', 'Expire', 'Cancelled');
CREATE TYPE transaction_status AS ENUM ('Paid', 'Pending', 'Failed');
CREATE TYPE domain_type AS ENUM ('Shared_Subdomain', 'Custom_Domain');
CREATE TYPE ssl_status AS ENUM ('Provisioning', 'Active', 'Failed');


/* =======================
   USERS
   ======================= */
CREATE TABLE users (
    id VARCHAR(500) PRIMARY KEY,
    username VARCHAR(150) UNIQUE NOT NULL,
    email VARCHAR(200) UNIQUE NOT NULL,
    password VARCHAR(500) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP,
);

-- 2. Verification Tracking Table
CREATE TABLE verification (
   id VARCHAR(500) PRIMARY KEY, 
   user_id VARCHAR(500) UNIQUE NOT NULL, 
   verification_token VARCHAR(500),
   last_send_at TIMESTAMP,
   CONSTRAINT fk_verification_user 
      FOREIGN KEY (user_id) 
      REFERENCES users(id) 
      ON DELETE CASCADE
);
/* =======================
   NODES
   ======================= */

CREATE TABLE nodes (
    node_id VARCHAR(150) PRIMARY KEY,
    max_ss INTEGER,
    resource_limits JSONB,
    domain VARCHAR(150),
    ip VARCHAR(150),
    port INTEGER,
    allowed BOOLEAN DEFAULT TRUE
);


/* =======================
   SERVERS
   ======================= */

CREATE TABLE servers (
    id VARCHAR(500) PRIMARY KEY,
    server_name VARCHAR(150),
    on_node VARCHAR(150),
    resource_limits JSONB,
    links VARCHAR(150),
    ip VARCHAR(150),
    port VARCHAR(50),
    hostname VARCHAR(150),
    container_id VARCHAR(150),
    status VARCHAR(150),
    service_types VARCHAR(150),
    service_id VARCHAR(150)
    CONSTRAINT fk_service_id FOREIGN KEY (service_id) REFERENCES services(id)
);


/* =======================
   PLANS
   ======================= */

CREATE TABLE plans (
    id VARCHAR(500) PRIMARY KEY,
    plan_name VARCHAR(150),
    config JSONB,
    duration VARCHAR(150),
    category VARCHAR(150),
    status plan_status DEFAULT 'Active',
    price NUMERIC(10,2),
    features JSONB
);


/* =======================
   SERVICES
   ======================= */

CREATE TABLE services (
    id VARCHAR(500) PRIMARY KEY,
    service_name VARCHAR(150),
    plan_id VARCHAR(500),
    user_id VARCHAR(500),
    renewal_date DATE,
    purchased_on DATE,
    status service_status DEFAULT 'Pending',
    container_id VARCHAR(150),

    CONSTRAINT fk_service_plan FOREIGN KEY (plan_id) REFERENCES plans(id),
    CONSTRAINT fk_service_user FOREIGN KEY (user_id) REFERENCES users(id)
);


/* =======================
   INVOICES
   ======================= */

CREATE TABLE invoices (
    id VARCHAR(500) PRIMARY KEY,
    service_id VARCHAR(500),
    user_id VARCHAR(500),
    expiry_date DATE,
    price NUMERIC(10,2),
    link VARCHAR(150),
    status invoice_status DEFAULT 'Unpaid',

    CONSTRAINT fk_invoice_service FOREIGN KEY (service_id) REFERENCES services(id),
    CONSTRAINT fk_invoice_user FOREIGN KEY (user_id) REFERENCES users(id)
);


/* =======================
   TRANSACTIONS
   ======================= */

CREATE TABLE transactions (
    transaction_id VARCHAR(500) PRIMARY KEY,
    service_id VARCHAR(500),
    user_id VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW(),
    price NUMERIC(10,2),
    payment_mode VARCHAR(150),
    order_id VARCHAR(150),
    gateway VARCHAR(150),
    status transaction_status DEFAULT 'Pending',

    CONSTRAINT fk_transaction_service FOREIGN KEY (service_id) REFERENCES services(id),
    CONSTRAINT fk_transaction_user FOREIGN KEY (user_id) REFERENCES users(id)
);


/* =======================
   BACKUPS
   ======================= */

CREATE TABLE backups (
    backup_id VARCHAR(500) PRIMARY KEY,
    name VARCHAR(150),
    service_id VARCHAR(500),
    user_id VARCHAR(500),
    local_path VARCHAR(255),
    backup_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    size BIGINT,

    CONSTRAINT fk_backup_service FOREIGN KEY (service_id) REFERENCES services(id),
    CONSTRAINT fk_backup_user FOREIGN KEY (user_id) REFERENCES users(id)
);


/* =======================
   ENVIRONMENT VARIABLES
   ======================= */

   
CREATE TABLE envs (
    env_id VARCHAR(500) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,         -- name of the variable
    value TEXT NOT NULL,                -- encrypted value
    service_id VARCHAR(500) NOT NULL,
    CONSTRAINT fk_env_service FOREIGN KEY (service_id) REFERENCES services(id)
);



/* =======================
   PROJECT DOMAINS
   ======================= */

CREATE TABLE project_domains (
    id VARCHAR(36) PRIMARY KEY,
    project_id VARCHAR(36) NOT NULL,
    service_id VARCHAR(36),
    domain_type domain_type NOT NULL,
    hostname VARCHAR(255) UNIQUE NOT NULL,

    ssl_enabled BOOLEAN DEFAULT TRUE,
    ssl_status ssl_status DEFAULT 'Provisioning',
    base_path VARCHAR(50) DEFAULT '/'
);


/* =======================
   INDEXES (Performance)
   ======================= */

CREATE INDEX idx_services_user_id ON services(user_id);
CREATE INDEX idx_services_plan_id ON services(plan_id);

CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoices_service_id ON invoices(service_id);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_service_id ON transactions(service_id);

CREATE INDEX idx_backups_service_id ON backups(service_id);
CREATE INDEX idx_envs_service_id ON envs(service_id);


/* =========================================================
   END OF SCHEMA
   ========================================================= */
