# Technical Design Document

## 1. System Architecture

```
┌──────────────────────────────────────────────────┐
│                   Browser (Client)                │
│  ┌────────────┐  ┌────────────┐  ┌─────────────┐ │
│  │ Main Page  │  │ Admin Page │  │ html2pdf.js │ │
│  └─────┬──────┘  └─────┬──────┘  └─────────────┘ │
└────────┼───────────────┼─────────────────────────┘
         │               │
         ▼               ▼
┌──────────────────────────────────────────────────┐
│               Next.js App Router                  │
│  ┌──────────────────┐  ┌───────────────────────┐ │
│  │ GET /api/generate │  │ GET/POST /api/painpts │ │
│  └────────┬─────────┘  └──────────┬────────────┘ │
└───────────┼────────────────────────┼─────────────┘
            │                        │
            ▼                        ▼
┌──────────────────────────────────────────────────┐
│              Prisma ORM (Client)                  │
│  ┌────────────┐ ┌──────────────┐ ┌─────────────┐ │
│  │  Industry  │ │ Architecture │ │  PainPoint  │ │
│  └────────────┘ └──────────────┘ └─────────────┘ │
└──────────────────────┬───────────────────────────┘
                       │
                       ▼
              ┌─────────────────┐
              │   SQLite (file) │
              │   prisma/dev.db │
              └─────────────────┘
```

## 2. Database Schema

### Industry
| Column | Type    | Description |
|--------|---------|-------------|
| id     | Int (PK)| Auto-increment |
| name   | String  | e.g. Healthcare, FinTech, E-Commerce |

### Architecture
| Column      | Type    | Description |
|-------------|---------|-------------|
| id          | Int (PK)| Auto-increment |
| name        | String  | e.g. Monolithic Java, Legacy Mainframe |
| description | String  | Detailed description of the architecture |

### PainPoint
| Column          | Type    | Description |
|-----------------|---------|-------------|
| id              | Int (PK)| Auto-increment |
| description     | String  | Description of the DevOps pain point |
| difficultyLevel | String  | Easy, Medium, or Hard |

## 3. API Design

### `GET /api/generate?difficulty={level}`
Returns a randomly generated case study combining one Industry, one Architecture, and one PainPoint.

**Response:**
```json
{
  "companyProfile": {
    "industry": "Healthcare",
    "companyName": "MedFlow Systems",
    "description": "..."
  },
  "currentArchitecture": {
    "name": "Monolithic Java",
    "description": "..."
  },
  "problem": {
    "description": "...",
    "difficultyLevel": "Medium"
  },
  "challenge": "..."
}
```

### `GET /api/painpoints`
Returns all pain points from the database.

### `POST /api/painpoints`
Creates a new pain point. Body: `{ "description": "...", "difficultyLevel": "Easy|Medium|Hard" }`

## 4. Frontend Pages

| Route   | Purpose |
|---------|---------|
| `/`     | Main generator — select difficulty, generate case study, export PDF |
| `/admin`| Admin dashboard — view and add pain points |

## 5. Deployment

- **Docker**: Multi-stage build (deps → build → standalone runner) exposed on port 8080
- **Kubernetes**: Deployment + Service + ConfigMap manifests
- **CI/CD**: GitHub Actions, Jenkins, and GitLab CI pipelines
