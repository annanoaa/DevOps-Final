# Post-Mortem Report Template
**Incident ID:** INC-001  
**Date:** 2025-06-28
**Severity:** HIGH

## Executive Summary
 simulated backend service failure was triggered to test monitoring and incident response. The frontend displayed errors, and monitoring dashboards showed increased error rates. The issue was detected quickly, resolved by restarting the backend, and all services returned to normal.

### Incident Details
- **Start Time:** 2025-06-28 14:00
- **End Time:** 2025-06-28 14:10
- **Duration:** 10 minutes
- **Affected Services:** Backend API, Frontend
- **Impact:** Users could not access API endpoints; frontend displayed error messages.

## Timeline

### Detection
- **Time:** 2025-06-28 14:01
- **Method:** Monitoring dashboard alert, frontend error
- **Detected By:** DevOps team

### Response
- **Time:** 2025-06-28 14:02
- **Actions Taken:** Checked logs, confirmed backend was down, restarted backend container
- **Escalation:** Not required

### Resolution
- **Time:** 2025-06-28 14:10
- **Resolution Method:** Restarted backend container
- **Verification:** Service health checks and frontend returned to normal

## Root Cause Analysis

### Primary Cause
Intentional shutdown of backend container for simulation.

### Contributing Factors
- No redundancy for backend
- Manual restart required

### Why It Happened
Incident was simulated for testing purposes.

## Impact Assessment

### Customer Impact
- **Users Affected:** All users
- **Geographic Impact:** All regions
- **Service Impact:**  API unavailable

### Business Impact
- **Revenue Impact:** None (simulation)
- **Reputation Impact:** None (simulation)
- **Compliance Impact:** None

### Technical Impact
- **System Downtime:** 10 minutes
- **Data Loss:** None
- **Performance Degradation:** Complete outage for backend

## Lessons Learned

### What Went Well
- Monitoring detected the issue quickly
- Team responded promptly
### What Went Wrong
- No automatic failover
- Manual intervention required

### What Could Be Improved
- Implement automated recovery
- Add redundancy for backend

## Action Items

### Immediate Actions (Next 24 hours)
- [x] Document incident
- [ ] Review monitoring alerts

### Short-term Actions (Next week)
- [ ] Test automated recovery scripts

### Long-term Actions (Next month)
- [ ] Plan for backend redundancy

## Prevention Measures

### Process Improvements
- Review and update incident response documentation
- Conduct regular incident simulations
- Improve team training on monitoring tools


### Technical Improvements
- Implement automated container restart policies
- Add health checks for all services
- Explore load balancing and redundancy options


### Monitoring Improvements
- Set up alerting for backend downtime
- Add more granular metrics for API health
- Regularly review and update monitoring dashboards

## Metrics and KPIs

### Response Metrics
- **Time to Detection (TTD):** 1 minute
- **Time to Response (TTR):** 1 minute
- **Time to Resolution (TTR):** 8 minute
- **Mean Time to Recovery (MTTR):** 10 minute

### Quality Metrics
- **Customer Satisfaction:** N/A (simulation)
- **System Availability:** 99.9% (excluding simulation)
- **Error Rate:** Spiked to 100% during incident


## Appendices

### A. Technical Details
Docker logs, monitoring screenshots, and health check outputs available upon request.

### B. Communication Logs
Internal Slack messages and email threads (simulation).

### C. Supporting Documentation
Screenshots of monitoring dashboards and frontend errors during the incident.

---

**Report Prepared By:** Anna Arnania
**Date:** 2025-06-28  
