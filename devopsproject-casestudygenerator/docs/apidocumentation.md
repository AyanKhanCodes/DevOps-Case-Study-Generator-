# API Documentation

## Base URL

```
http://localhost:3000/api
```

---

## Endpoints

### 1. Generate Case Study

**`GET /api/generate`**

Generates a randomized DevOps transformation case study.

#### Query Parameters

| Parameter    | Type   | Required | Description |
|-------------|--------|----------|-------------|
| `difficulty` | String | No       | Filter pain points by difficulty: `Easy`, `Medium`, or `Hard`. Defaults to random. |

#### Response `200 OK`

```json
{
  "companyProfile": {
    "industry": "Healthcare",
    "companyName": "MedFlow Systems",
    "description": "A mid-sized healthcare technology company..."
  },
  "currentArchitecture": {
    "name": "Monolithic Java Application",
    "description": "A single large Java application deployed on on-premise servers..."
  },
  "problem": {
    "description": "Deployments require 4-hour maintenance windows...",
    "difficultyLevel": "Medium"
  },
  "challenge": "As a DevOps consultant, design a transformation roadmap..."
}
```

#### Error Response `500`

```json
{
  "error": "Failed to generate case study. Ensure the database is seeded."
}
```

---

### 2. List Pain Points

**`GET /api/painpoints`**

Returns all pain points from the database.

#### Response `200 OK`

```json
{
  "painPoints": [
    {
      "id": 1,
      "description": "Deployments require 4-hour maintenance windows...",
      "difficultyLevel": "Easy"
    }
  ]
}
```

---

### 3. Create Pain Point

**`POST /api/painpoints`**

Adds a new pain point to the database.

#### Request Body

```json
{
  "description": "No automated rollback mechanism exists...",
  "difficultyLevel": "Hard"
}
```

#### Response `201 Created`

```json
{
  "painPoint": {
    "id": 4,
    "description": "No automated rollback mechanism exists...",
    "difficultyLevel": "Hard"
  }
}
```

#### Error Response `400`

```json
{
  "error": "description and difficultyLevel are required"
}
```
