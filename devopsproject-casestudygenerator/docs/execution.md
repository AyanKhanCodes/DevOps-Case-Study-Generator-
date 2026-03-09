# Execution Guide

This document contains the exact, copy-pasteable terminal commands required to execute, test, and deploy the DevOps Transformation Case Study Generator on macOS.

## Phase 1-3: Running Locally & Database Management

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup & Seeding
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```
*(Alternatively, you may have set up an `npm run db:setup` script)*

### 3. Start Development Server
```bash
npm run dev
```
*(The application will be available at http://localhost:3000)*

## Phase 4: Docker Deployment

### 1. Build the Docker Image
```bash
docker build -t devopsproject-casestudygenerator:latest -f infrastructure/docker/Dockerfile .
```

### 2. Run with Docker Compose
```bash
docker-compose -f infrastructure/docker/docker-compose.yml up -d
```
*(The application will be available at http://localhost:8080)*

### 3. View Logs
```bash
docker-compose -f infrastructure/docker/docker-compose.yml logs -f
```

### 4. Stop Docker Containers
```bash
docker-compose -f infrastructure/docker/docker-compose.yml down
```

## Phase 5: Kubernetes Deployment (Minikube / Docker Desktop)

### 1. Apply Kubernetes Manifests
```bash
kubectl apply -f infrastructure/kubernetes/configmap.yaml
kubectl apply -f infrastructure/kubernetes/deployment.yaml
kubectl apply -f infrastructure/kubernetes/service.yaml
```

### 2. Verify Deployment
```bash
kubectl get pods
kubectl get services
```

### 3. Access the Application
If using Minikube:
```bash
minikube service casestudy-generator-service
```
If using Docker Desktop, open http://localhost:80 in your browser (based on LoadBalancer service on port 80).

### 4. Delete Kubernetes Resources
```bash
kubectl delete -f infrastructure/kubernetes/service.yaml
kubectl delete -f infrastructure/kubernetes/deployment.yaml
kubectl delete -f infrastructure/kubernetes/configmap.yaml
```

## Phase 5: Terraform Provisioning

### 1. Initialize, Format, and Validate
```bash
cd infrastructure/terraform
terraform init
terraform fmt
terraform validate
```

## Phase 6: CI/CD Pipeline Definitions

### 1. Validate GitHub Actions Directory
```bash
mkdir -p pipelines/.github/workflows
```
*(Note: CI/CD pipelines trigger automatically. GitHub Actions will trigger on push/pull requests to main. Jenkins is typically configured via polling or webhooks connected to the repository. GitLab CI triggers automatically parsing the `gitlab-ci.yml` pipeline file on commit.)*

## Phase 7: Testing & Quality Assurance

### 1. Install JavaScript Testing Dependencies
```bash
npm install -D jest @testing-library/react @testing-library/jest-dom node-mocks-http
```

### 2. Run Jest Tests
```bash
npm run test
npm run test:integration
```

### 3. Set Up Python Testing Environment
```bash
python3 -m venv venv
source venv/bin/activate
pip install pytest selenium
```

### 4. Run Selenium Tests
```bash
python3 -m pytest tests/selenium/
```

## Phase 8: Monitoring Setup

* **Nagios Configuration (`monitoring/nagios/casestudy_app.cfg`)**: This file defines host and service checks. In a real environment, it would be copied or mounted into a Nagios Core server's `/usr/local/nagios/etc/objects/` directory to proactively check if port 8080 and the Docker daemon are responding.
* **Prometheus Alerts (`monitoring/alerts/alert_rules.yml`)**: This file defines metric thresholds (CPU, Downtime, Errors). It would be mounted into a Prometheus container to trigger alerts to an Alertmanager when the conditions are met.
* **Grafana Dashboard (`monitoring/dashboards/grafana_dashboard.json`)**: This JSON model represents our visual dashboard for health and uptime. It can be imported directly into the Grafana UI's "Import Dashboard" feature.

### 1. Validate Monitoring Stack locally with Docker (Theoretical)
```bash
# Example command to run a theoretical monitoring docker-compose stack
# (Assuming a docker-compose.monitoring.yml file exists that mounts these configs)
docker-compose -f monitoring/docker-compose.monitoring.yml up -d
```

## Phase 9: Demo Execution

This phase defines the execution strategy for presenting your project.

### 1. Prep the Application
Before performing the demo outlined in `presentations/demoscript.md`, ensure the application is initialized and running with fresh seed data.
```bash
npm run build
npx prisma db seed
npm run start
```

### 2. Automated Run
A WebP video recording of the entire demo script flow has been automatically generated and saved in the AI's artifact directory as validation that the UI components correctly process input.
To manually perform a scripted UI test validation via Python's Selenium suite (which automates parts of this UI flow):
```bash
python3 -m pytest tests/selenium/test_ui.py
```
