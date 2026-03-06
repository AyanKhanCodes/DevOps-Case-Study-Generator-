# DevOps Transformation Case Study Generator

Student Name: Ayan Khan  
Registration No: 23FE10CSE00504  
Course: CSE3253 DevOps [PE6]  
Semester: VI (2025-2026)  
Project Type: Fundamentals  
Difficulty: Intermediate  

## Project Overview

### Problem Statement
DevOps students often lack exposure to realistic, industry-specific transformation scenarios, making it difficult to practice diagnosing legacy infrastructure problems and recommending modern solutions. This application bridges that gap by algorithmically generating unique case studies that combine random industries, IT architectures, and pain points into cohesive business scenarios students can analyze and solve.

### Objectives
- [x] Build a full-stack web application using Next.js (App Router) with a SQLite database to dynamically generate randomized DevOps transformation case studies across multiple industries and difficulty levels
- [x] Implement a client-side PDF export feature so students can download and submit generated case studies for offline review and academic assessment
- [x] Containerize the entire application with Docker and provide comprehensive Infrastructure-as-Code (Kubernetes, Terraform, Puppet) to demonstrate real-world DevOps deployment practices

### Key Features
- **Randomized Case Study Engine** — Combines a random Industry, IT Architecture, and Pain Point from a seeded SQLite database (via Prisma ORM) to produce a unique, realistic DevOps transformation scenario on every request
- **Difficulty-Based Filtering** — Students can select Easy, Medium, or Hard difficulty levels to control the complexity of the generated pain points and tailor the challenge to their skill level
- **One-Click PDF Export** — Uses html2pdf.js for instant client-side PDF generation, allowing students to download any case study as a professionally formatted document without server-side processing
- **Admin Dashboard** — A dedicated interface to view, add, and manage Pain Points in the database, enabling instructors to customize the case study pool
- **Fully Containerized Deployment** — Ships with a multi-stage Dockerfile and Docker Compose configuration for one-command deployment on port 8080

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Database | SQLite + Prisma ORM |
| Styling | Tailwind CSS |
| PDF Export | html2pdf.js |
| Containerization | Docker & Docker Compose |
| IaC | Kubernetes, Terraform, Puppet |
| CI/CD | GitHub Actions, Jenkins, GitLab CI |

## Project Structure

```
devopsproject-casestudygenerator/
├── src/                    Next.js app (pages, components, API routes)
├── docs/                   Project documentation
├── infrastructure/         Docker, Kubernetes, Terraform, Puppet
├── pipelines/              CI/CD pipeline definitions
├── tests/                  Unit, integration, and Selenium tests
├── monitoring/             Nagios, alerts, dashboards
├── presentations/          Presentation materials
└── deliverables/           Final deliverables
```

## Quick Start

```bash
# Install dependencies
npm install

# Set up the database
npx prisma migrate dev --name init
npx prisma db seed

# Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Docker

```bash
cd infrastructure/docker
docker compose up --build
```

The app will be available at [http://localhost:8080](http://localhost:8080).

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
