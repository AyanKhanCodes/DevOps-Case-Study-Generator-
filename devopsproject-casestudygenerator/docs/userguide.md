# User Guide

## Getting Started

### Prerequisites
- Node.js 20+ and npm
- Docker (optional, for containerized deployment)

### Installation

```bash
git clone <repository-url>
cd devopsproject-casestudygenerator
npm install
```

### Database Setup

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### Running the Application

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

---

## Using the Case Study Generator

### Step 1 — Select a Difficulty
Use the dropdown on the main page to choose **Easy**, **Medium**, or **Hard**. This controls the complexity of the generated pain point.

### Step 2 — Generate a Case Study
Click the **"Generate Case Study"** button. The application will randomly combine:
- An **Industry** (e.g., Healthcare, FinTech)
- A **Current IT Architecture** (e.g., Monolithic Java, Legacy Mainframe)
- A **Pain Point** matching your selected difficulty

The result is a cohesive business scenario displayed on screen.

### Step 3 — Export to PDF
Click the **"Export to PDF"** button to download the case study as a formatted PDF document. This uses client-side generation — no data is sent to an external server.

---

## Admin Dashboard

Navigate to [http://localhost:3000/admin](http://localhost:3000/admin) to:

- **View** all existing Pain Points in the database
- **Add** new Pain Points by specifying a description and difficulty level

---

## Docker Deployment

```bash
cd infrastructure/docker
docker compose up --build
```

The application will be available at [http://localhost:8080](http://localhost:8080).
