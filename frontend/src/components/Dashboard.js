import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Badge } from 'react-bootstrap';
import axios from 'axios';

const Dashboard = ({ backendStatus }) => {
  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      const [statusResponse, usersResponse] = await Promise.all([
        axios.get('/api/status'),
        axios.get('/api/users').catch(() => ({ data: [] }))
      ]);

      setMetrics({
        status: statusResponse.data,
        users: usersResponse.data || []
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching metrics:', error);
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      healthy: 'success',
      unhealthy: 'danger',
      unknown: 'warning'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-4">System Dashboard</h1>
      
      <Row className="mb-4">
        <Col md={3}>
          <Card className="metric-card">
            <Card.Body>
              <div className="metric-value">{getStatusBadge(backendStatus)}</div>
              <div className="metric-label">Backend Status</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="metric-card">
            <Card.Body>
              <div className="metric-value">{metrics.users?.length || 0}</div>
              <div className="metric-label">Total Users</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="metric-card">
            <Card.Body>
              <div className="metric-value">{metrics.status?.version || 'N/A'}</div>
              <div className="metric-label">API Version</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="metric-card">
            <Card.Body>
              <div className="metric-value">{metrics.status?.environment || 'N/A'}</div>
              <div className="metric-label">Environment</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card>
            <Card.Header>System Information</Card.Header>
            <Card.Body>
              <p><strong>Service:</strong> {metrics.status?.service}</p>
              <p><strong>Version:</strong> {metrics.status?.version}</p>
              <p><strong>Environment:</strong> {metrics.status?.environment}</p>
              <p><strong>Last Updated:</strong> {metrics.status?.timestamp}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>Quick Actions</Card.Header>
            <Card.Body>
              <Button 
                variant="primary" 
                className="btn-simulation"
                onClick={() => window.open('/monitoring', '_blank')}
              >
                View Monitoring
              </Button>
              <Button 
                variant="warning" 
                className="btn-simulation"
                onClick={() => window.open('/incidents', '_blank')}
              >
                Incident Simulation
              </Button>
              <Button 
                variant="info" 
                className="btn-simulation"
                onClick={() => window.open('http://localhost:3001', '_blank')}
              >
                Grafana Dashboard
              </Button>
              <Button 
                variant="secondary" 
                className="btn-simulation"
                onClick={() => window.open('http://localhost:9090', '_blank')}
              >
                Prometheus
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 