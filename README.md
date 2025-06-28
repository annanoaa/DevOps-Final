# DevOps Final Project: Multi-Service Application

## Project Overview

This project demonstrates a complete DevOps pipeline for a multi-service application with the following components:

### Services
- **Frontend**: React.js web application
- **Backend**: Node.js/Express API server
- **Database**: PostgreSQL database
- **Monitoring**: Prometheus + Grafana
- **Security**: Trivy vulnerability scanning

### Features
- Containerized microservices using Docker & Docker Compose
- Service monitoring and visualization with Prometheus and Grafana
- Security scanning with Trivy
- DevSecOps practices with secrets management
- Incident simulation and post-mortem analysis
- Automated deployment and provisioning
- Git-based version control

## Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │    │   Backend   │    │  Database   │
│  (React)    │◄──►│  (Node.js)  │◄──►│ (PostgreSQL)│
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │
                    ┌─────────────┐
                    │  Prometheus │
                    │   Grafana   │
                    └─────────────┘
```

## Prerequisites

- Docker & Docker Compose
- Git
- Trivy (for security scanning)
- Ansible (optional, for automation)

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd devops_final
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Build and run the application**
   ```bash
   docker-compose up --build
   ```

4. **Access the services**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Grafana: http://localhost:3001 (admin/admin)
   - Prometheus: http://localhost:9090

5. **Run security scan**
   ```bash
   ./scripts/security-scan.sh
   ```

## Monitoring

### Grafana Dashboards
- **System Overview**: CPU, memory, and network metrics
- **Application Metrics**: Request rates, response times, error rates
- **Container Metrics**: Resource usage per container

### Prometheus Targets
- Backend service metrics
- Node.js application metrics
- System metrics

## Security

### Vulnerability Scanning
- Automated Trivy scans on all Docker images
- Critical vulnerability reporting
- Security best practices implementation

### Secrets Management
- Environment variables for sensitive data
- Docker secrets for production deployments
- Secure configuration management

## Incident Response

### Simulated Incidents
1. **Service Failure**: Container crash simulation
2. **High Load**: Stress testing with monitoring
3. **Security Breach**: Vulnerability exploitation simulation

### Post-Mortem Process
- Incident detection and alerting
- Response time measurement
- Root cause analysis
- Resolution documentation
- Prevention measures

## Automation

### Ansible Playbooks
- Infrastructure provisioning
- Application deployment
- Configuration management
- Monitoring setup

### CI/CD Pipeline
- Automated testing
- Security scanning
- Deployment automation
- Rollback procedures

## Project Structure

```
devops_final/
├── frontend/                 # React frontend application
├── backend/                  # Node.js backend API
├── monitoring/              # Prometheus & Grafana configs
├── ansible/                 # Automation playbooks
├── scripts/                 # Utility scripts
├── docs/                    # Documentation
├── docker-compose.yml       # Main orchestration
├── .env.example            # Environment template
└── README.md               # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and security scans
5. Submit a pull request

## License

MIT License - see LICENSE file for details 