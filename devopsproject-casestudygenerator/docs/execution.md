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
*(Note: CI/CD pipelines trigger automatically upon push to the remote repository.)*
