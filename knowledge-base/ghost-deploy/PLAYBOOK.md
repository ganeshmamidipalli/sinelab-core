# GHOST DEPLOY — DevOps Engineer Knowledge Base

## How the Best DevOps Engineers Ship to Production

Source: Practices from Google SRE, Netflix, GitHub, Vercel, and the DevOps Handbook.

---

## 1. CI/CD Pipeline (GitHub Actions)

### Standard Pipeline
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm run lint        # or ruff check for Python

  test:
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4
      - run: npm run test        # or pytest for Python

  build:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - run: npm run build

  deploy-staging:
    if: github.ref == 'refs/heads/develop'
    needs: build
    runs-on: ubuntu-latest
    steps:
      - run: # deploy to staging

  deploy-production:
    if: github.ref == 'refs/heads/main'
    needs: build
    runs-on: ubuntu-latest
    steps:
      - run: # deploy to production
```

### Pipeline Rules
```
1. Every push triggers lint + test
2. PRs cannot merge without passing CI
3. Staging auto-deploys from develop branch
4. Production auto-deploys from main branch
5. No manual deployments (everything through pipeline)
6. Secrets stored in GitHub Secrets, never in code
7. Pipeline must complete in < 10 minutes
```

## 2. Docker Configuration

### Backend Dockerfile
```dockerfile
FROM python:3.12-slim AS base

WORKDIR /app

# Install dependencies first (cache layer)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY src/ ./src/

# Non-root user for security
RUN adduser --disabled-password --no-create-home appuser
USER appuser

EXPOSE 8000

CMD ["uvicorn", "src.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Docker Best Practices
```
1. Use multi-stage builds (smaller images)
2. Pin exact versions (python:3.12.3-slim not python:3)
3. Copy dependency files before source code (layer caching)
4. Run as non-root user
5. Use .dockerignore (exclude .git, node_modules, __pycache__)
6. No secrets in Dockerfile or image
7. Health check endpoint: /health
8. Graceful shutdown handling (SIGTERM)
```

## 3. Deployment Strategy

### Vercel (Frontend)
```
Configuration: vercel.json

{
  "framework": "nextjs",
  "buildCommand": "next build",
  "outputDirectory": ".next",
  "env": {
    "NEXT_PUBLIC_API_URL": "@api-url",
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key"
  }
}

Auto-deploy:
  - Push to main → production deploy
  - Push to develop → preview deploy
  - PR → preview deploy with unique URL
```

### Railway (Backend)
```
Configuration: railway.toml

[build]
builder = "DOCKERFILE"
dockerfilePath = "Dockerfile"

[deploy]
startCommand = "uvicorn src.api.main:app --host 0.0.0.0 --port $PORT"
healthcheckPath = "/health"
healthcheckTimeout = 300
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 3

Environment Variables:
  Set via Railway dashboard or CLI (never in code)
```

## 4. Environment Management

```
ENVIRONMENTS:
  local       — developer's machine
  staging     — mirrors production, for testing
  production  — live, client-facing

ENVIRONMENT VARIABLES:
  Never hardcode. Always from environment.

  .env.local      — local development (git-ignored)
  .env.staging    — staging values (in CI secrets)
  .env.production — production values (in CI secrets)

VARIABLE NAMING:
  DATABASE_URL=postgresql://...
  ANTHROPIC_API_KEY=sk-ant-...
  NEXT_PUBLIC_*  — exposed to browser (be careful)

SECRETS HIERARCHY:
  1. GitHub Secrets (CI/CD)
  2. Railway/Vercel env vars (runtime)
  3. Supabase vault (database-level)
  Never: .env files in git, hardcoded in code
```

## 5. Monitoring & Observability

### Health Check Endpoint
```python
@app.get("/health")
async def health():
    checks = {
        "api": "ok",
        "database": await check_db(),
        "llm_router": await check_llm(),
    }
    status = "healthy" if all(v == "ok" for v in checks.values()) else "degraded"
    return {"status": status, "checks": checks, "timestamp": datetime.utcnow()}
```

### What to Monitor
```
APPLICATION:
  - Request count (per endpoint)
  - Response times (p50, p95, p99)
  - Error rate (4xx, 5xx)
  - Active WebSocket connections

INFRASTRUCTURE:
  - CPU usage
  - Memory usage
  - Disk usage
  - Network I/O

BUSINESS:
  - Active projects count
  - Tasks completed per hour
  - LLM API costs per day
  - Agent error rate

ALERTING RULES:
  - Error rate > 5% for 5 minutes → alert
  - Response time p95 > 2s for 5 minutes → alert
  - CPU > 80% for 10 minutes → alert
  - LLM cost > daily budget → alert
```

### Logging Strategy
```
STRUCTURED LOGGING (JSON format):
{
  "timestamp": "2026-03-26T10:30:00Z",
  "level": "INFO",
  "service": "sinelab-api",
  "message": "project.created",
  "project_id": "abc123",
  "client_id": "def456",
  "duration_ms": 234
}

LOG LEVELS:
  Production: INFO and above
  Staging: DEBUG and above

RETENTION:
  Production: 30 days
  Staging: 7 days
```

## 6. Security Hardening

```
CHECKLIST:
[ ] HTTPS only (redirect HTTP → HTTPS)
[ ] CORS whitelist specific origins (not *)
[ ] Rate limiting: 100 req/min per IP for API, 10/min for auth
[ ] Request body size limit: 1MB default, 10MB for uploads
[ ] SQL injection prevention (parameterized queries)
[ ] XSS prevention (sanitize all user input)
[ ] CSRF tokens for state-changing operations
[ ] Secure headers (Helmet.js or manual):
    - X-Content-Type-Options: nosniff
    - X-Frame-Options: DENY
    - Strict-Transport-Security: max-age=31536000
    - Content-Security-Policy: default-src 'self'
[ ] Dependency scanning (npm audit / safety check)
[ ] No secrets in git history (use git-secrets or trufflehog)
[ ] API keys rotated quarterly
[ ] Admin actions logged to audit trail
```

## 7. Backup & Recovery

```
DATABASE:
  - Supabase auto-backups: daily (free tier: 7 days retention)
  - Point-in-time recovery (Pro plan)
  - Export critical data weekly to GitHub as SQL dump

CODE:
  - Everything in Git (GitHub)
  - Branch protection on main (require PR + CI pass)
  - Tag releases with semantic versioning

DISASTER RECOVERY:
  - RTO (Recovery Time Objective): < 1 hour
  - RPO (Recovery Point Objective): < 24 hours
  - Documented runbook for common failures
```

## 8. Infrastructure as Code

```
PRINCIPLE: If it's not in code, it doesn't exist.

Everything versioned:
  - Dockerfile (container definition)
  - docker-compose.yml (local development)
  - railway.toml (backend deployment)
  - vercel.json (frontend deployment)
  - .github/workflows/ (CI/CD pipelines)
  - supabase/migrations/ (database schema)

No manual configuration.
Every environment reproducible from code.
```

## 9. Release Process

```
1. Developer creates feature branch from develop
2. Developer opens PR → CI runs automatically
3. Code review (SENTINEL reviews for quality)
4. PR merged to develop → auto-deploy to staging
5. QA tests on staging (CRASH KINGS)
6. When ready: PR from develop → main
7. Merged to main → auto-deploy to production
8. Tag release: git tag v1.2.3
9. Monitor production for 30 minutes post-deploy
10. If issues → rollback (redeploy previous version)

ROLLBACK:
  Vercel: instant rollback to previous deployment
  Railway: redeploy previous commit
  Database: run down migration
```
