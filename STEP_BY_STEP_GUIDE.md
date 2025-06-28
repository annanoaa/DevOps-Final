# DevOps Final Project - Complete Step-by-Step Guide

## 🎯 Project Overview
This guide will walk you through implementing a complete DevOps pipeline that meets all your course requirements. The project includes:

- ✅ Multi-service containerized application (Frontend + Backend + Database)
- ✅ Docker & Docker Compose orchestration
- ✅ Prometheus & Grafana monitoring
- ✅ Trivy security scanning
- ✅ DevSecOps practices
- ✅ Incident simulation & post-mortem
- ✅ Ansible automation
- ✅ Git version control

## 📋 Prerequisites Installation

### 1. Install Docker & Docker Compose
```bash
# macOS (using Homebrew)
brew install docker docker-compose

# Linux (Ubuntu/Debian)
sudo apt update
sudo apt install docker.io docker-compose

# Windows
# Download Docker Desktop from https://www.docker.com/products/docker-desktop
```

### 2. Install Trivy (Security Scanner)
```bash
# macOS
brew install trivy

# Linux
curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin

# Windows
choco install trivy
```

### 3. Install Ansible (Optional - for automation)
```bash
# macOS
brew install ansible

# Linux
sudo apt install ansible

# Windows
pip install ansible
```

## 🚀 Quick Start (Recommended)

### Option 1: Automated Setup
```bash
# Make the start script executable
chmod +x start.sh

# Run the automated setup
./start.sh
```

### Option 2: Manual Setup
```bash
# 1. Create environment file
cp env.example .env

# 2. Build and start services
docker-compose up --build -d

# 3. Wait for services to be ready (check with)
docker-compose ps
```

## 📊 Accessing Your Services

Once everything is running, you can access:

| Service | URL | Credentials |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | - |
| **Backend API** | http://localhost:5000 | - |
| **Grafana** | http://localhost:3001 | admin/admin |
| **Prometheus** | http://localhost:9090 | - |
| **cAdvisor** | http://localhost:8080 | - |

## 🔒 Security Scanning

### Run Security Scan
```bash
# Execute the security scanning script
./scripts/security-scan.sh
```

This will:
- Scan all Docker images for vulnerabilities
- Generate detailed reports in `reports/` directory
- Create a summary report
- Identify critical/high vulnerabilities

### View Security Reports
```bash
# View summary report
cat reports/security-summary.md

# View detailed reports
ls reports/trivy-*.json
```

## 📈 Monitoring & Observability

### 1. Grafana Dashboards
- **URL**: http://localhost:3001
- **Login**: admin/admin
- **Features**:
  - HTTP Request Rate
  - Response Time (95th percentile)
  - Active Connections
  - Error Rate
  - Success Rate
  - Total Requests

### 2. Prometheus Metrics
- **URL**: http://localhost:9090
- **Features**:
  - Backend service metrics
  - Node.js application metrics
  - System metrics
  - Container metrics

### 3. Application Monitoring
- **Backend Health**: http://localhost:5000/health
- **Backend Metrics**: http://localhost:5000/metrics
- **Database Health**: http://localhost:5000/health/db

## 🚨 Incident Simulation

### Using the Web Interface
1. Go to http://localhost:3000
2. Navigate to "Incident Simulation"
3. Use the simulation controls to:
   - Simulate Service Failure
   - Simulate High Load
   - Simulate Database Failure

### Manual Incident Simulation
```bash
# Simulate backend error
curl http://localhost:5000/api/error

# Simulate high load
for i in {1..20}; do curl http://localhost:5000/api/load-test & done

# Check system status
curl http://localhost:5000/health
```

## 📝 Post-Mortem Documentation

### Using the Template
1. Navigate to `docs/post-mortem-template.md`
2. Fill in the template with your incident details
3. Document:
   - Timeline of events
   - Root cause analysis
   - Impact assessment
   - Lessons learned
   - Action items

### Example Post-Mortem Process
```bash
# 1. Simulate an incident
curl http://localhost:5000/api/error

# 2. Document the incident
cp docs/post-mortem-template.md docs/incident-$(date +%Y%m%d).md

# 3. Fill in the details
# 4. Review and improve processes
```

## 🤖 Ansible Automation

### Deploy with Ansible
```bash
# Navigate to ansible directory
cd ansible

# Run deployment playbook
ansible-playbook -i inventory.yml deploy.yml

# Run security automation
ansible-playbook -i inventory.yml security.yml
```

### Ansible Playbooks Available
- `deploy.yml` - Full application deployment
- `security.yml` - Security scanning and compliance

## 🔧 Useful Commands

### Docker Management
```bash
# View running services
docker-compose ps

# View logs
docker-compose logs -f [service_name]

# Restart services
docker-compose restart

# Stop all services
docker-compose down

# Rebuild and start
docker-compose up --build -d
```

### Monitoring Commands
```bash
# Check backend health
curl http://localhost:5000/health

# View Prometheus metrics
curl http://localhost:5000/metrics

# Check database connection
curl http://localhost:5000/health/db
```

### Security Commands
```bash
# Run security scan
./scripts/security-scan.sh

# View security reports
ls -la reports/

# Check for vulnerabilities in specific image
trivy image node:18-alpine
```

## 📋 Project Requirements Checklist

### ✅ Containerization
- [x] Dockerfiles for frontend and backend
- [x] Multi-stage builds for security
- [x] Non-root user execution
- [x] Health checks implemented

### ✅ Docker Compose
- [x] Multi-service orchestration
- [x] Inter-service networking
- [x] Environment variable management
- [x] Volume persistence

### ✅ Monitoring & Visualization
- [x] Prometheus metrics collection
- [x] Grafana dashboards
- [x] Real-time monitoring
- [x] Performance metrics

### ✅ Security (DevSecOps)
- [x] Trivy vulnerability scanning
- [x] Security headers implementation
- [x] Rate limiting
- [x] Secrets management
- [x] Non-root containers

### ✅ Incident Simulation
- [x] Service failure simulation
- [x] High load testing
- [x] Database failure simulation
- [x] Post-mortem template

### ✅ Automation
- [x] Ansible deployment playbooks
- [x] Security automation
- [x] Quick start scripts
- [x] Automated health checks

### ✅ Version Control
- [x] Git repository initialized
- [x] Proper .gitignore
- [x] Initial commit completed
- [x] Documentation included

## 🎓 Submission Checklist

Before submitting your project, ensure you have:

### Documentation
- [ ] README.md with setup instructions
- [ ] Screenshots of Grafana dashboards
- [ ] Security scan results
- [ ] Post-mortem documentation
- [ ] Architecture diagram

### Screenshots to Include
1. **Grafana Dashboard** - Show monitoring metrics
2. **Prometheus Targets** - Show all targets are up
3. **Security Scan Results** - Show Trivy scan output
4. **Application Running** - Show frontend/backend working
5. **Incident Simulation** - Show incident response process

### Code Quality
- [ ] All services are containerized
- [ ] Security best practices implemented
- [ ] Monitoring is functional
- [ ] Automation scripts work
- [ ] Git history is clean

## 🚀 Final Steps

### 1. Test Everything
```bash
# Start the application
./start.sh

# Run security scan
./scripts/security-scan.sh

# Test incident simulation
# (Use the web interface at http://localhost:3000/incidents)

# Check monitoring
# (Visit http://localhost:3001 for Grafana)
```

### 2. Document Your Work
- Take screenshots of all dashboards
- Document any issues you encountered
- Record your post-mortem process
- Note any customizations you made

### 3. Prepare for Submission
```bash
# Ensure all changes are committed
git add .
git commit -m "Final project submission"

# Create a summary of your work
echo "DevOps Final Project Summary" > PROJECT_SUMMARY.md
echo "============================" >> PROJECT_SUMMARY.md
echo "" >> PROJECT_SUMMARY.md
echo "Services Implemented:" >> PROJECT_SUMMARY.md
echo "- Frontend: React.js with monitoring dashboard" >> PROJECT_SUMMARY.md
echo "- Backend: Node.js/Express with Prometheus metrics" >> PROJECT_SUMMARY.md
echo "- Database: PostgreSQL with sample data" >> PROJECT_SUMMARY.md
echo "- Monitoring: Prometheus + Grafana" >> PROJECT_SUMMARY.md
echo "- Security: Trivy vulnerability scanning" >> PROJECT_SUMMARY.md
echo "- Automation: Ansible playbooks" >> PROJECT_SUMMARY.md
```

## 🎉 Congratulations!

You now have a complete DevOps pipeline that demonstrates:

- **Containerization** with Docker & Docker Compose
- **Monitoring** with Prometheus & Grafana
- **Security** with Trivy scanning
- **Automation** with Ansible
- **Incident Response** with simulation tools
- **Version Control** with Git

This project showcases all the key DevOps practices and tools you've learned in your course. Good luck with your submission! 🚀 