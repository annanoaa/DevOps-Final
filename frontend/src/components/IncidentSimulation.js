import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Alert, Badge } from 'react-bootstrap';
import axios from 'axios';

const IncidentSimulation = () => {
  const [incidents, setIncidents] = useState([]);
  const [systemStatus, setSystemStatus] = useState('healthy');
  const [loading, setLoading] = useState(false);

  const addIncident = (type, description, severity) => {
    const incident = {
      id: Date.now(),
      type,
      description,
      severity,
      timestamp: new Date().toISOString(),
      status: 'active'
    };
    setIncidents(prev => [incident, ...prev]);
  };

  const resolveIncident = (id) => {
    setIncidents(prev => 
      prev.map(inc => 
        inc.id === id ? { ...inc, status: 'resolved', resolvedAt: new Date().toISOString() } : inc
      )
    );
  };

  const simulateServiceFailure = async () => {
    setLoading(true);
    addIncident('Service Failure', 'Simulating backend service crash', 'high');
    setSystemStatus('degraded');
    
    try {
      // Try to access the error endpoint
      await axios.get('/api/error');
    } catch (error) {
      addIncident('Error Response', 'Backend returned 500 error as expected', 'medium');
    }
    
    setLoading(false);
  };

  const simulateHighLoad = async () => {
    setLoading(true);
    addIncident('High Load', 'Simulating high traffic load', 'medium');
    setSystemStatus('degraded');
    
    try {
      // Send multiple requests to simulate load
      const promises = Array(20).fill().map(() => 
        axios.get('/api/load-test').catch(() => null)
      );
      await Promise.all(promises);
      addIncident('Load Test Complete', 'High load simulation completed', 'low');
    } catch (error) {
      addIncident('Load Test Failed', 'Some requests failed during load test', 'medium');
    }
    
    setLoading(false);
  };

  const simulateDatabaseFailure = async () => {
    setLoading(true);
    addIncident('Database Failure', 'Simulating database connection issues', 'high');
    setSystemStatus('critical');
    
    try {
      await axios.get('/health/db');
    } catch (error) {
      addIncident('Database Error', 'Database health check failed', 'high');
    }
    
    setLoading(false);
  };

  const clearIncidents = () => {
    setIncidents([]);
    setSystemStatus('healthy');
  };

  const getSeverityBadge = (severity) => {
    const variants = {
      low: 'info',
      medium: 'warning',
      high: 'danger',
      critical: 'dark'
    };
    return <Badge bg={variants[severity] || 'secondary'}>{severity}</Badge>;
  };

  const getStatusBadge = (status) => {
    return <Badge bg={status === 'active' ? 'danger' : 'success'}>{status}</Badge>;
  };

  return (
    <div>
      <h1 className="mb-4">Incident Simulation & Response</h1>
      
      <Alert variant="info">
        <strong>Purpose:</strong> This page allows you to simulate various incidents to test system monitoring, 
        alerting, and response capabilities. Use these tools to validate your DevOps practices.
      </Alert>

      <Row className="mb-4">
        <Col md={4}>
          <Card>
            <Card.Header>System Status</Card.Header>
            <Card.Body>
              <h3>
                <Badge bg={systemStatus === 'healthy' ? 'success' : systemStatus === 'degraded' ? 'warning' : 'danger'}>
                  {systemStatus.toUpperCase()}
                </Badge>
              </h3>
              <p className="text-muted">Current system health status</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Card>
            <Card.Header>Incident Simulation Controls</Card.Header>
            <Card.Body>
              <Button 
                variant="danger" 
                className="btn-simulation"
                onClick={simulateServiceFailure}
                disabled={loading}
              >
                Simulate Service Failure
              </Button>
              <Button 
                variant="warning" 
                className="btn-simulation"
                onClick={simulateHighLoad}
                disabled={loading}
              >
                Simulate High Load
              </Button>
              <Button 
                variant="dark" 
                className="btn-simulation"
                onClick={simulateDatabaseFailure}
                disabled={loading}
              >
                Simulate Database Failure
              </Button>
              <Button 
                variant="outline-secondary" 
                className="btn-simulation"
                onClick={clearIncidents}
              >
                Clear All Incidents
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Card>
            <Card.Header>
              Incident Log
              <Badge bg="secondary" className="float-end">{incidents.length} incidents</Badge>
            </Card.Header>
            <Card.Body>
              {incidents.length === 0 ? (
                <p className="text-muted">No incidents recorded. Use the simulation controls above to create incidents.</p>
              ) : (
                <div className="incident-log">
                  {incidents.map(incident => (
                    <div key={incident.id} className={`log-entry ${incident.severity}`}>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <strong>{incident.type}</strong>
                          <p className="mb-1">{incident.description}</p>
                          <small className="timestamp">{new Date(incident.timestamp).toLocaleString()}</small>
                        </div>
                        <div className="d-flex gap-2">
                          {getSeverityBadge(incident.severity)}
                          {getStatusBadge(incident.status)}
                          {incident.status === 'active' && (
                            <Button 
                              size="sm" 
                              variant="outline-success"
                              onClick={() => resolveIncident(incident.id)}
                            >
                              Resolve
                            </Button>
                          )}
                        </div>
                      </div>
                      {incident.resolvedAt && (
                        <small className="text-success">
                          Resolved at: {new Date(incident.resolvedAt).toLocaleString()}
                        </small>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={12}>
          <Card>
            <Card.Header>Post-Mortem Template</Card.Header>
            <Card.Body>
              <h5>Incident Response Process:</h5>
              <ol>
                <li><strong>Detection:</strong> Monitor alerts and system metrics</li>
                <li><strong>Assessment:</strong> Determine incident severity and impact</li>
                <li><strong>Response:</strong> Execute incident response procedures</li>
                <li><strong>Resolution:</strong> Fix the root cause and restore service</li>
                <li><strong>Post-Mortem:</strong> Document lessons learned and improvements</li>
              </ol>
              
              <h5>Key Metrics to Track:</h5>
              <ul>
                <li>Time to Detection (TTD)</li>
                <li>Time to Response (TTR)</li>
                <li>Time to Resolution (TTR)</li>
                <li>Mean Time to Recovery (MTTR)</li>
                <li>Customer Impact Duration</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default IncidentSimulation; 