import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Monitoring = () => {
  const [metrics, setMetrics] = useState([]);
  const [prometheusData, setPrometheusData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await axios.get('/metrics');
      setPrometheusData(response.data);
      
      // Parse Prometheus metrics
      const lines = response.data.split('\n');
      const parsedMetrics = {};
      
      lines.forEach(line => {
        if (line.startsWith('http_requests_total')) {
          const match = line.match(/http_requests_total\{method="([^"]+)",route="([^"]+)",status_code="([^"]+)"\} (\d+)/);
          if (match) {
            const [, method, route, statusCode, value] = match;
            const key = `${method}_${route}_${statusCode}`;
            parsedMetrics[key] = parseInt(value);
          }
        }
      });
      
      setMetrics(parsedMetrics);
      setLoading(false);
      setError(null);
    } catch (error) {
      console.error('Error fetching metrics:', error);
      setError('Failed to fetch metrics from Prometheus');
      setLoading(false);
    }
  };

  const generateChartData = () => {
    const labels = Object.keys(metrics).slice(0, 10); // Show first 10 metrics
    const data = labels.map(key => metrics[key] || 0);
    
    return {
      labels,
      datasets: [
        {
          label: 'HTTP Requests',
          data,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          tension: 0.1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'HTTP Request Metrics',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const performLoadTest = async () => {
    try {
      setLoading(true);
      const promises = Array(10).fill().map(() => 
        axios.get('/api/load-test').catch(() => null)
      );
      await Promise.all(promises);
      fetchMetrics(); // Refresh metrics after load test
    } catch (error) {
      console.error('Load test error:', error);
    }
  };

  if (loading && !prometheusData) {
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
      <h1 className="mb-4">System Monitoring</h1>
      
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Row className="mb-4">
        <Col md={8}>
          <Card>
            <Card.Header>
              Real-time Metrics
              <Button 
                variant="outline-primary" 
                size="sm" 
                className="float-end"
                onClick={performLoadTest}
                disabled={loading}
              >
                Run Load Test
              </Button>
            </Card.Header>
            <Card.Body>
              <div className="chart-container">
                <Line data={generateChartData()} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header>Quick Stats</Card.Header>
            <Card.Body>
              <p><strong>Total Metrics:</strong> {Object.keys(metrics).length}</p>
              <p><strong>Total Requests:</strong> {Object.values(metrics).reduce((a, b) => a + b, 0)}</p>
              <p><strong>Last Updated:</strong> {new Date().toLocaleTimeString()}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Card>
            <Card.Header>Prometheus Raw Metrics</Card.Header>
            <Card.Body>
              <pre style={{ maxHeight: '400px', overflow: 'auto', fontSize: '12px' }}>
                {prometheusData || 'No metrics available'}
              </pre>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={12}>
          <Card>
            <Card.Header>External Monitoring Links</Card.Header>
            <Card.Body>
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
                Prometheus UI
              </Button>
              <Button 
                variant="success" 
                className="btn-simulation"
                onClick={() => window.open('http://localhost:5000/health', '_blank')}
              >
                Backend Health
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Monitoring; 