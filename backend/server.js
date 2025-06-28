const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { Pool } = require('pg');
require('dotenv').config();

// Prometheus monitoring
const promClient = require('prom-client');
const register = promClient.register;

// Metrics
const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

const httpRequestsTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const activeConnections = new promClient.Gauge({
  name: 'active_connections',
  help: 'Number of active connections'
});

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'postgres',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'devops_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// --- MIDDLEWARE SETUP ---

// Security middleware
app.use(helmet());
app.use(cors());
app.use(compression());

// Logging
app.use(morgan('combined'));


// --- INTERNAL MONITORING ENDPOINTS (No Rate Limit) ---

// Prometheus metrics endpoint
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Database health check
app.get('/health/db', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    res.json({
      status: 'healthy',
      database: 'connected',
      timestamp: result.rows[0].now
    });
  } catch (err) {
    res.status(500).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: err.message
    });
  }
});


// --- APPLY RATE LIMITER MIDDLEWARE ---
// This will apply to all routes defined AFTER this point.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter); // Best practice: only apply to API routes


// --- PUBLIC API ROUTES (Rate Limited) ---

app.get('/api/status', (req, res) => {
  res.json({
    service: 'devops-backend',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/users', async (req, res) => {
  const start = Date.now();
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT id, name, email, created_at FROM users LIMIT 10');
    client.release();

    const duration = Date.now() - start;
    httpRequestDurationMicroseconds
      .labels('GET', '/api/users', '200')
      .observe(duration / 1000);
    httpRequestsTotal.labels('GET', '/api/users', '200').inc();

    res.json(result.rows);
  } catch (err) {
    const duration = Date.now() - start;
    httpRequestDurationMicroseconds
      .labels('GET', '/api/users', '500')
      .observe(duration / 1000);
    httpRequestsTotal.labels('GET', '/api/users', '500').inc();

    res.status(500).json({ error: err.message });
  }
});

// Simulate high load endpoint for testing
app.get('/api/load-test', (req, res) => {
  const start = Date.now();
  // Simulate some work
  setTimeout(() => {
    const duration = Date.now() - start;
    httpRequestDurationMicroseconds
      .labels('GET', '/api/load-test', '200')
      .observe(duration / 1000);
    httpRequestsTotal.labels('GET', '/api/load-test', '200').inc();

    res.json({
      message: 'Load test completed',
      duration: duration
    });
  }, Math.random() * 2000); // Random delay up to 2 seconds
});

// Error endpoint for incident simulation
app.get('/api/error', (req, res) => {
  httpRequestsTotal.labels('GET', '/api/error', '500').inc();
  res.status(500).json({ error: 'Simulated error for incident testing' });
});


// --- FINAL MIDDLEWARE ---

// Connection tracking
app.use((req, res, next) => {
  activeConnections.inc();
  res.on('finish', () => {
    activeConnections.dec();
  });
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  pool.end();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`Metrics available at http://localhost:${PORT}/metrics`);
  console.log(`Health check at http://localhost:${PORT}/health`);
});