#!/bin/bash

# DevOps Final Project - Quick Start Script
# This script sets up and starts the entire DevOps pipeline

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 DevOps Final Project - Quick Start${NC}"
echo "=========================================="

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "\n${YELLOW}📋 Checking prerequisites...${NC}"

if ! command_exists docker; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

if ! command_exists docker-compose; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "\n${YELLOW}📝 Creating environment file...${NC}"
    cp env.example .env
    echo -e "${GREEN}✅ Environment file created${NC}"
else
    echo -e "${GREEN}✅ Environment file already exists${NC}"
fi

# Stop any existing containers
echo -e "\n${YELLOW}🛑 Stopping existing containers...${NC}"
docker-compose down --remove-orphans 2>/dev/null || true

# Build and start services
echo -e "\n${YELLOW}🏗️  Building and starting services...${NC}"
docker-compose up --build -d

# Wait for services to be ready
echo -e "\n${YELLOW}⏳ Waiting for services to be ready...${NC}"

# Function to wait for service
wait_for_service() {
    local service=$1
    local port=$2
    local max_attempts=30
    local attempt=1
    
    echo -n "   Waiting for $service on port $port... "
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "http://localhost:$port" >/dev/null 2>&1 || \
           curl -s "http://localhost:$port/health" >/dev/null 2>&1 || \
           curl -s "http://localhost:$port/metrics" >/dev/null 2>&1; then
            echo -e "${GREEN}✅${NC}"
            return 0
        fi
        
        echo -n "."
        sleep 2
        ((attempt++))
    done
    
    echo -e "${RED}❌${NC}"
    return 1
}

# Wait for each service
wait_for_service "Frontend" 3000
wait_for_service "Backend" 5000
wait_for_service "Prometheus" 9090
wait_for_service "Grafana" 3001

echo -e "\n${GREEN}🎉 All services are ready!${NC}"

# Display service information
echo -e "\n${BLUE}📊 Service Information${NC}"
echo "========================"
echo -e "${GREEN}Frontend:${NC}     http://localhost:3000"
echo -e "${GREEN}Backend API:${NC}  http://localhost:5000"
echo -e "${GREEN}Prometheus:${NC}   http://localhost:9090"
echo -e "${GREEN}Grafana:${NC}      http://localhost:3001 (admin/admin)"
echo -e "${GREEN}cAdvisor:${NC}     http://localhost:8080"

echo -e "\n${BLUE}🔍 Health Checks${NC}"
echo "=================="
echo -e "${GREEN}Backend Health:${NC} http://localhost:5000/health"
echo -e "${GREEN}Backend Metrics:${NC} http://localhost:5000/metrics"

echo -e "\n${BLUE}🛠️  Available Commands${NC}"
echo "======================="
echo -e "${YELLOW}Security Scan:${NC}    ./scripts/security-scan.sh"
echo -e "${YELLOW}View Logs:${NC}        docker-compose logs -f"
echo -e "${YELLOW}Stop Services:${NC}    docker-compose down"
echo -e "${YELLOW}Restart Services:${NC} docker-compose restart"

echo -e "\n${BLUE}📋 Next Steps${NC}"
echo "============="
echo "1. Open http://localhost:3000 in your browser"
echo "2. Explore the monitoring dashboard"
echo "3. Run incident simulations"
echo "4. Execute security scans"
echo "5. Check Grafana dashboards"

echo -e "\n${GREEN}✨ DevOps Final Project is ready for use!${NC}"

# Optional: Run security scan
read -p $'\n🔒 Would you like to run a security scan now? (y/N): ' -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "\n${YELLOW}🔍 Running security scan...${NC}"
    if [ -f "./scripts/security-scan.sh" ]; then
        ./scripts/security-scan.sh
    else
        echo -e "${RED}❌ Security scan script not found${NC}"
    fi
fi

echo -e "\n${BLUE}🎯 Happy DevOps-ing!${NC}" 