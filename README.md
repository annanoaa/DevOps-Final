# DevOps Final Project: Multi-Service Application

## Overview
This project demonstrates a complete DevOps pipeline for a multi-service application, integrating modern best practices in automation, monitoring, security, and incident response.

---

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

---

## Project Structure

```
devops_final/
├── frontend/                 # React frontend (served by Nginx)
│   ├── Dockerfile
│   ├── nginx.conf
│   └── src/
│       └── components/
│           ├── Dashboard.js
│           ├── IncidentSimulation.js
│           └── Monitoring.js
├── backend/                  # Node.js/Express API
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
├── database/
│   └── init.sql              # PostgreSQL initialization
├── monitoring/               # Monitoring configs
│   ├── prometheus.yml
│   └── grafana/
│       ├── dashboards/
│       │   └── dashboard.json
│       └── provisioning/
│           └── datasources/
│               └── prometheus.yml
├── ansible/                  # Automation playbooks
│   ├── deploy.yml
│   ├── inventory.yml
│   ├── security.yml
│   └── templates/
│       └── security-report.md.j2
├── scripts/
│   └── security-scan.sh      # Trivy scan automation
├── docs/
│   ├── incident-20250628.md
│   └── post-mortem-template.md
├── screenshots/              # Project screenshots
├── docker-compose.yml        # Main orchestration
├── .env.example              # Environment template
└── README.md                 # This file
```

---

## Services

### Frontend
- React.js SPA, served by Nginx
- Main components: `Dashboard`, `IncidentSimulation`, `Monitoring`
- Location: `frontend/`

### Backend
- Node.js/Express API
- Handles business logic and API endpoints
- Location: `backend/`

### Database
- PostgreSQL
- Initialization script: `database/init.sql`

### Monitoring
- **Prometheus**: Scrapes metrics from backend and system
- **Grafana**: Pre-built dashboard (`dashboard.json`) for visualization
- Configs: `monitoring/`

### Security
- **Trivy**: Automated vulnerability scanning via `scripts/security-scan.sh`
- **Ansible**: Playbooks for deployment, security hardening, and reporting

---

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Git
- Trivy (for security scanning)
- Ansible (for automation)

### Setup & Run

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd devops_final
   ```
2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env as needed
   ```
3. **Build and start all services**
   ```bash
   docker-compose up --build
   ```
4. **Access the services**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Grafana: http://localhost:3001 (admin/admin)
   - Prometheus: http://localhost:9090

---

## Security Scanning

Run a full Trivy scan on all Docker images:
```bash
./scripts/security-scan.sh
```
- Generates a Markdown report using Ansible templates
- Example output: `reports/security-summary.md`

---

## Monitoring & Dashboards

- **Prometheus** scrapes metrics from the backend and system
- **Grafana** visualizes metrics using a pre-built dashboard (`monitoring/grafana/dashboards/dashboard.json`)
- Access Grafana at [http://localhost:3001](http://localhost:3001) (default: admin/admin)

---

## Incident Simulation & Post-Mortem

- Simulate incidents (service failure, high load, security breach) via the frontend (`IncidentSimulation.js`)
- Document incidents and post-mortems using templates in `docs/`
- Example: `docs/incident-20250628.md`, `docs/post-mortem-template.md`

---

## Automation with Ansible

- **deploy.yml**: Deploys and configures the application stack
- **security.yml**: Runs security hardening and reporting
- **inventory.yml**: Defines target hosts
- **Templates**: Jinja2 templates for automated reporting

Run a playbook:
```bash
ansible-playbook -i ansible/inventory.yml ansible/deploy.yml
```

---

## Screenshots

Screenshots of the application, monitoring dashboards, and incident simulations are available in the `screenshots/` directory. 
---

## Documentation

- **Incident Template**: `docs/incident-20250628.md`
- **Post-Mortem Template**: `docs/post-mortem-template.md`

---

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and security scans
5. Submit a pull request

---

## License
MIT License - see LICENSE file for details 