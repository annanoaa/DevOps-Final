-- Initialize the database with sample data
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample users
INSERT INTO users (name, email) VALUES
    ('John Doe', 'john.doe@example.com'),
    ('Jane Smith', 'jane.smith@example.com'),
    ('Bob Johnson', 'bob.johnson@example.com'),
    ('Alice Brown', 'alice.brown@example.com'),
    ('Charlie Wilson', 'charlie.wilson@example.com'),
    ('Diana Davis', 'diana.davis@example.com'),
    ('Edward Miller', 'edward.miller@example.com'),
    ('Fiona Garcia', 'fiona.garcia@example.com'),
    ('George Martinez', 'george.martinez@example.com'),
    ('Helen Anderson', 'helen.anderson@example.com')
ON CONFLICT (email) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Create a table for system events (for monitoring)
CREATE TABLE IF NOT EXISTS system_events (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    event_message TEXT,
    severity VARCHAR(20) DEFAULT 'info',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some initial system events
INSERT INTO system_events (event_type, event_message, severity) VALUES
    ('system_startup', 'Database initialized successfully', 'info'),
    ('user_created', 'Sample users loaded', 'info'),
    ('index_created', 'Performance indexes created', 'info'); 