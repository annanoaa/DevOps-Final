import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Container, Nav, Navbar, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import Dashboard from './components/Dashboard';
import Monitoring from './components/Monitoring';
import IncidentSimulation from './components/IncidentSimulation';
import './App.css';

function App() {
  const [backendStatus, setBackendStatus] = useState('unknown');
  const [error, setError] = useState(null);

  useEffect(() => {
    checkBackendHealth();
    const interval = setInterval(checkBackendHealth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const checkBackendHealth = async () => {
    try {
      const response = await axios.get('/health');
      setBackendStatus(response.data.status);
      setError(null);
    } catch (err) {
      setBackendStatus('unhealthy');
      setError('Backend service is not responding');
    }
  };

  return (
    <Router>
      <div className="App">
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand as={Link} to="/">
              🚀 DevOps Final Project
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/monitoring">Monitoring</Nav.Link>
                <Nav.Link as={Link} to="/incidents">Incident Simulation</Nav.Link>
              </Nav>
              <Nav>
                <Nav.Link className="d-flex align-items-center">
                  <span className={`status-indicator ${backendStatus}`}></span>
                  Backend: {backendStatus}
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Container className="mt-4">
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Routes>
            <Route path="/" element={<Dashboard backendStatus={backendStatus} />} />
            <Route path="/monitoring" element={<Monitoring />} />
            <Route path="/incidents" element={<IncidentSimulation />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App; 