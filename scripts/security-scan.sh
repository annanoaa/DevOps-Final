#!/bin/bash

# DevOps Final Project - Security Scanning Script
# This script uses Trivy to scan Docker images for vulnerabilities

set -e

echo "🔒 Starting Security Scan with Trivy..."
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Trivy is installed
if ! command -v trivy &> /dev/null; then
    echo -e "${RED}❌ Trivy is not installed. Please install it first:${NC}"
    echo "   macOS: brew install trivy"
    echo "   Linux: curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin"
    echo "   Windows: choco install trivy"
    exit 1
fi

# Create reports directory
mkdir -p reports

# Function to scan image
scan_image() {
    local image_name=$1
    local report_file="reports/trivy-${image_name//\//-}.json"
    
    echo -e "\n${YELLOW}🔍 Scanning image: ${image_name}${NC}"
    
    # Run Trivy scan
    if trivy image --format json --output "$report_file" "$image_name"; then
        echo -e "${GREEN}✅ Scan completed for ${image_name}${NC}"
        
        # Parse and display summary
        if [ -f "$report_file" ]; then
            local vuln_count=$(jq '.Results[].Vulnerabilities | length' "$report_file" 2>/dev/null | awk '{sum += $1} END {print sum+0}')
            local critical_count=$(jq '.Results[].Vulnerabilities[] | select(.Severity == "CRITICAL") | .VulnerabilityID' "$report_file" 2>/dev/null | wc -l)
            local high_count=$(jq '.Results[].Vulnerabilities[] | select(.Severity == "HIGH") | .VulnerabilityID' "$report_file" 2>/dev/null | wc -l)
            
            echo "   📊 Summary:"
            echo "   - Total vulnerabilities: $vuln_count"
            echo "   - Critical: $critical_count"
            echo "   - High: $high_count"
            
            if [ "$critical_count" -gt 0 ] || [ "$high_count" -gt 0 ]; then
                echo -e "   ${RED}⚠️  Critical/High vulnerabilities found!${NC}"
                return 1
            else
                echo -e "   ${GREEN}✅ No critical or high vulnerabilities found${NC}"
            fi
        fi
    else
        echo -e "${RED}❌ Scan failed for ${image_name}${NC}"
        return 1
    fi
}

# Function to scan local images
scan_local_images() {
    echo -e "\n${YELLOW}🏗️  Scanning local Docker images...${NC}"
    
    # Get list of images from docker-compose
    local images=(
        "devops_final-backend:latest"
        "devops_final-frontend:latest"
        "postgres:15-alpine"
        "prom/prometheus:latest"
        "grafana/grafana:latest"
        "gcr.io/cadvisor/cadvisor:latest"
        "prom/node-exporter:latest"
    )
    
    local failed_scans=0
    
    for image in "${images[@]}"; do
        if docker image inspect "$image" &>/dev/null; then
            if ! scan_image "$image"; then
                ((failed_scans++))
            fi
        else
            echo -e "${YELLOW}⚠️  Image not found: $image${NC}"
        fi
    done
    
    return $failed_scans
}

# Function to scan base images
scan_base_images() {
    echo -e "\n${YELLOW}🔍 Scanning base images for known vulnerabilities...${NC}"
    
    local base_images=(
        "node:18-alpine"
        "nginx:alpine"
        "postgres:15-alpine"
    )
    
    local failed_scans=0
    
    for image in "${base_images[@]}"; do
        if ! scan_image "$image"; then
            ((failed_scans++))
        fi
    done
    
    return $failed_scans
}

# Function to generate summary report
generate_summary() {
    echo -e "\n${YELLOW}📋 Generating Security Summary Report...${NC}"
    
    local summary_file="reports/security-summary.md"
    
    cat > "$summary_file" << EOF
# Security Scan Summary Report
Generated: $(date)

## Scan Overview
- Scanner: Trivy
- Scan Date: $(date)
- Total Images Scanned: $(find reports -name "trivy-*.json" | wc -l)

## Vulnerabilities Summary
EOF
    
    # Count vulnerabilities by severity
    local total_critical=0
    local total_high=0
    local total_medium=0
    local total_low=0
    
    for report in reports/trivy-*.json; do
        if [ -f "$report" ]; then
            local image_name=$(basename "$report" .json | sed 's/trivy-//')
            local critical=$(jq '.Results[].Vulnerabilities[] | select(.Severity == "CRITICAL") | .VulnerabilityID' "$report" 2>/dev/null | wc -l)
            local high=$(jq '.Results[].Vulnerabilities[] | select(.Severity == "HIGH") | .VulnerabilityID' "$report" 2>/dev/null | wc -l)
            local medium=$(jq '.Results[].Vulnerabilities[] | select(.Severity == "MEDIUM") | .VulnerabilityID' "$report" 2>/dev/null | wc -l)
            local low=$(jq '.Results[].Vulnerabilities[] | select(.Severity == "LOW") | .VulnerabilityID' "$report" 2>/dev/null | wc -l)
            
            echo "### $image_name" >> "$summary_file"
            echo "- Critical: $critical" >> "$summary_file"
            echo "- High: $high" >> "$summary_file"
            echo "- Medium: $medium" >> "$summary_file"
            echo "- Low: $low" >> "$summary_file"
            echo "" >> "$summary_file"
            
            total_critical=$((total_critical + critical))
            total_high=$((total_high + high))
            total_medium=$((total_medium + medium))
            total_low=$((total_low + low))
        fi
    done
    
    cat >> "$summary_file" << EOF
## Overall Summary
- Total Critical: $total_critical
- Total High: $total_high
- Total Medium: $total_medium
- Total Low: $total_low

## Recommendations
EOF
    
    if [ "$total_critical" -gt 0 ] || [ "$total_high" -gt 0 ]; then
        echo "- ⚠️  Critical and High vulnerabilities detected. Review and patch immediately." >> "$summary_file"
    else
        echo "- ✅ No critical or high vulnerabilities detected." >> "$summary_file"
    fi
    
    echo "- 📊 Detailed reports available in the reports/ directory" >> "$summary_file"
    echo "- 🔄 Run this scan regularly to maintain security" >> "$summary_file"
    
    echo -e "${GREEN}✅ Summary report generated: $summary_file${NC}"
}

# Main execution
main() {
    echo "🚀 DevOps Final Project Security Scan"
    echo "====================================="
    
    local exit_code=0
    
    # Scan base images
    if ! scan_base_images; then
        exit_code=1
    fi
    
    # Scan local images if they exist
    if ! scan_local_images; then
        exit_code=1
    fi
    
    # Generate summary
    generate_summary
    
    echo -e "\n${YELLOW}📁 Reports saved in: reports/${NC}"
    echo -e "${YELLOW}📋 Summary: reports/security-summary.md${NC}"
    
    if [ $exit_code -eq 0 ]; then
        echo -e "\n${GREEN}🎉 Security scan completed successfully!${NC}"
    else
        echo -e "\n${RED}⚠️  Security scan completed with issues. Please review the reports.${NC}"
    fi
    
    exit $exit_code
}

# Run main function
main "$@" 