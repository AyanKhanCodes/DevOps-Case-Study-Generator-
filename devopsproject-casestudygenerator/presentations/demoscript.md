# Demo Script — DevOps Transformation Case Study Generator

## Introduction (1 minute)
- Introduce the project: "DevOps Transformation Case Study Generator"
- Explain the problem: students need realistic DevOps scenarios to practice
- Brief overview of the tech stack (Next.js, SQLite, Prisma, Tailwind, Docker)

## Live Demo (3-4 minutes)

### 1. Main Page
- Show the clean UI with the difficulty dropdown
- Select **"Easy"** and click **Generate Case Study**
- Walk through the generated output: Company Profile, Architecture, Problem
- Click **Export to PDF** and show the downloaded file

### 2. Different Difficulty
- Switch to **"Hard"** and generate another case study
- Highlight how the pain point complexity changes

### 3. Admin Dashboard
- Navigate to `/admin`
- Show the list of existing Pain Points
- Add a new Pain Point via the form
- Return to the main page and generate to show the new data appears

### 4. API Endpoint
- Open the browser to `/api/generate?difficulty=Medium`
- Show the raw JSON response

## Architecture & DevOps (2-3 minutes)
- Show the Prisma schema and SQLite database
- Walk through the Dockerfile (multi-stage build)
- Show `docker compose up` running the app on port 8080
- Briefly show the CI/CD pipeline (GitHub Actions YAML)
- Show Kubernetes manifests and Terraform config

## Q&A (1 minute)
- Open for questions
