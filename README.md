# Todo API - DevOps CI/CD Pipeline

A production-grade Todo API demonstrating CI/CD best practices with GitHub Actions, Docker, and Kubernetes.

**Student:** Pradyut Fogla  
**Scaler ID:** 10193

## 🚀 Project Overview

Simple RESTful API for managing todos, built to demonstrate:
- Automated CI/CD pipelines
- DevSecOps practices (SAST, SCA, container scanning)
- Docker containerization
- Kubernetes deployment

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| Language | TypeScript |
| Runtime | Node.js 18 |
| Framework | Express.js |
| Testing | Jest + Supertest |
| Linting | ESLint |
| Container | Docker |
| Orchestration | Kubernetes |
| CI/CD | GitHub Actions |

## 📁 Project Structure

```
├── src/
│   ├── controllers/     # Request handlers
│   ├── models/          # Data layer
│   ├── routes/          # API routes
│   ├── types/           # TypeScript interfaces
│   ├── __tests__/       # Test files
│   ├── app.ts           # Express app
│   └── index.ts         # Entry point
├── k8s/
│   ├── namespace.yaml   # K8s namespace
│   ├── deployment.yaml  # K8s deployment
│   └── service.yaml     # K8s service
├── .github/workflows/
│   ├── ci.yml           # CI pipeline
│   └── cd.yml           # CD pipeline
├── Dockerfile           # Multi-stage build
└── package.json
```

## 🏃 Running Locally

### Prerequisites
- Node.js 18+
- Docker (optional)

### Development
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Run linting
npm run lint
```

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/todos` | List all todos |
| GET | `/api/todos/:id` | Get single todo |
| POST | `/api/todos` | Create todo |
| PUT | `/api/todos/:id` | Update todo |
| DELETE | `/api/todos/:id` | Delete todo |

### Docker
```bash
# Build image
docker build -t todo-api .

# Run container
docker run -p 3001:3001 todo-api

# Test
curl http://localhost:3001/health
```

## 🔄 CI/CD Pipeline

### CI Pipeline (ci.yml)
Triggered on push to main/master.

| Stage | Purpose |
|-------|---------|
| Lint | Code quality (ESLint) |
| Test | Unit tests (Jest) |
| Build | Compile TypeScript |
| CodeQL | SAST - code vulnerabilities |
| npm audit | SCA - dependency vulnerabilities |
| Docker Build | Create container image |
| Trivy Scan | Container vulnerability scan |
| Smoke Test | Verify container runs |
| Push | Publish to DockerHub |

### CD Pipeline (cd.yml)
Triggered after CI succeeds.

| Stage | Purpose |
|-------|---------|
| Setup kubectl | K8s CLI |
| Deploy | Apply K8s manifests |
| Verify | Check pods healthy |
| DAST | Runtime security scan |

## 🔐 GitHub Secrets Required

| Secret | Description |
|--------|-------------|
| `DOCKERHUB_USERNAME` | DockerHub username |
| `DOCKERHUB_TOKEN` | DockerHub access token (Read & Write) |
| `KUBECONFIG` | Base64 encoded kubeconfig (for CD) |

## 🔒 Security Features

| Type | Tool | What it Does |
|------|------|--------------|
| SAST | CodeQL | Scans source code for vulnerabilities |
| SCA | npm audit | Checks dependencies for CVEs |
| Container | Trivy | Scans Docker image for vulnerabilities |
| DAST | OWASP ZAP | Tests running app for security issues |

## 📊 Pipeline Flow

```
Push to main
     │
     ▼
┌─────────────────┐
│   CI Pipeline   │
├─────────────────┤
│ • Lint          │
│ • Test          │
│ • Security Scan │
│ • Docker Build  │
│ • Push Image    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   CD Pipeline   │
├─────────────────┤
│ • Deploy to K8s │
│ • Verify Pods   │
│ • DAST Scan     │
└─────────────────┘
```

## 📝 License

MIT
