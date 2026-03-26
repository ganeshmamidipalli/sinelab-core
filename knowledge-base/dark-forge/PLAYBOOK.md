# DARK FORGE — Backend Developer Knowledge Base

## How the Best Backend Engineers Build Production Systems

Source: Practices from Stripe, Shopify, Netflix, FastAPI docs, 12-Factor App, and Clean Architecture.

---

## 1. Project Structure (Clean Architecture)

```
src/
├── api/
│   ├── main.py              # FastAPI app, CORS, middleware
│   ├── routes/
│   │   ├── auth.py           # Auth endpoints
│   │   ├── projects.py       # Project CRUD
│   │   ├── teams.py          # Team endpoints
│   │   └── chat.py           # Chat endpoints
│   ├── middleware/
│   │   ├── auth.py           # JWT verification
│   │   ├── rate_limit.py     # Rate limiting
│   │   └── logging.py        # Request logging
│   └── dependencies.py       # Shared dependencies
├── services/                  # Business logic (no framework dependency)
│   ├── project_service.py
│   ├── team_service.py
│   └── sentinel_service.py
├── models/                    # Data models
│   ├── project.py
│   ├── user.py
│   └── task.py
├── db/
│   ├── client.py              # Supabase client
│   ├── queries/               # SQL queries or ORM queries
│   └── migrations/            # Schema migrations
├── config/
│   ├── settings.py            # Pydantic settings from env
│   └── constants.py           # App constants
└── utils/
    ├── errors.py              # Custom exceptions
    ├── validators.py          # Input validation
    └── helpers.py             # Shared utilities
```

## 2. FastAPI Best Practices

```python
# ENDPOINT STRUCTURE (every endpoint follows this pattern):

@router.post("/projects", response_model=ProjectResponse, status_code=201)
async def create_project(
    body: ProjectCreate,                    # Pydantic validation
    current_user: User = Depends(get_user), # Auth dependency
    db: Database = Depends(get_db),         # DB dependency
):
    """Create a new project."""
    # 1. Validate business rules
    if not current_user.can_create_project:
        raise HTTPException(403, "Not authorized")

    # 2. Call service layer (business logic)
    project = await project_service.create(db, body, current_user)

    # 3. Return structured response
    return ProjectResponse.from_orm(project)
```

### Error Handling Pattern
```python
# Custom exception hierarchy
class AppError(Exception):
    def __init__(self, code: str, message: str, status: int = 400):
        self.code = code
        self.message = message
        self.status = status

class NotFoundError(AppError):
    def __init__(self, resource: str, id: str):
        super().__init__("NOT_FOUND", f"{resource} {id} not found", 404)

class ForbiddenError(AppError):
    def __init__(self, action: str):
        super().__init__("FORBIDDEN", f"Not allowed to {action}", 403)

# Global exception handler
@app.exception_handler(AppError)
async def app_error_handler(request, exc):
    return JSONResponse(
        status_code=exc.status,
        content={"error": {"code": exc.code, "message": exc.message}}
    )
```

## 3. Database Patterns (Supabase/PostgreSQL)

### Query Patterns
```python
# ALWAYS use parameterized queries (prevent SQL injection)

# BAD  — SQL injection risk
query = f"SELECT * FROM users WHERE email = '{email}'"

# GOOD — parameterized
result = await db.from_("users").select("*").eq("email", email).execute()

# For complex queries, use RPC (stored functions)
result = await db.rpc("get_project_summary", {"project_id": pid}).execute()
```

### Repository Pattern
```python
class ProjectRepository:
    def __init__(self, db):
        self.db = db
        self.table = "projects"

    async def find_by_id(self, id: str) -> dict | None:
        result = await self.db.from_(self.table).select("*").eq("id", id).single().execute()
        return result.data

    async def find_all(self, filters: dict = None, page: int = 1, limit: int = 20) -> list:
        query = self.db.from_(self.table).select("*", count="exact")
        if filters:
            for key, value in filters.items():
                query = query.eq(key, value)
        query = query.range((page-1)*limit, page*limit-1).order("created_at", desc=True)
        result = await query.execute()
        return {"data": result.data, "total": result.count}

    async def create(self, data: dict) -> dict:
        result = await self.db.from_(self.table).insert(data).execute()
        return result.data[0]

    async def update(self, id: str, data: dict) -> dict:
        result = await self.db.from_(self.table).update(data).eq("id", id).execute()
        return result.data[0]
```

## 4. API Design Standards

```
RESPONSE FORMATS:

# Single resource
{
  "data": { "id": "...", "name": "...", ... }
}

# List with pagination
{
  "data": [{ ... }, { ... }],
  "total": 42,
  "page": 1,
  "limit": 20
}

# Error
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "details": [{ "field": "email", "issue": "required" }]
  }
}

# Success (no body needed)
HTTP 204 No Content

HTTP STATUS CODES:
  200 — Success (GET, PATCH)
  201 — Created (POST)
  204 — No Content (DELETE)
  400 — Bad Request (validation error)
  401 — Unauthorized (no/invalid token)
  403 — Forbidden (valid token, no permission)
  404 — Not Found
  409 — Conflict (duplicate)
  422 — Unprocessable Entity
  429 — Rate Limited
  500 — Server Error (never expose internals)
```

## 5. The 12-Factor App Principles

```
1. CODEBASE     — One repo, many deploys
2. DEPENDENCIES — Explicitly declare (requirements.txt / pyproject.toml)
3. CONFIG       — Store in environment variables
4. BACKING SERVICES — Treat DB, cache, queue as attached resources
5. BUILD/RELEASE/RUN — Strict separation
6. PROCESSES    — Stateless processes (no local storage)
7. PORT BINDING — Export service via port
8. CONCURRENCY  — Scale via process model
9. DISPOSABILITY — Fast startup, graceful shutdown
10. DEV/PROD PARITY — Keep environments similar
11. LOGS        — Treat as event streams (stdout)
12. ADMIN       — Run admin tasks as one-off processes
```

## 6. Logging Standards

```python
import structlog

logger = structlog.get_logger()

# STRUCTURED LOGGING (not print statements)
logger.info("project.created",
    project_id=project.id,
    client_id=client.id,
    name=project.name
)

logger.error("llm.call.failed",
    model="deepseek-v3",
    error=str(e),
    task_id=task.id,
    retry_count=2
)

# LOG LEVELS:
# DEBUG   — Development only, verbose
# INFO    — Normal operations (request served, task completed)
# WARNING — Unexpected but handled (retry, fallback)
# ERROR   — Something broke (API failure, invalid state)
# CRITICAL — System is down (database unreachable)

# NEVER LOG: passwords, API keys, tokens, PII
```

## 7. Testing Strategy

```python
# TEST PYRAMID:
#   Unit tests (70%)     — Test individual functions, fast
#   Integration tests (20%) — Test API endpoints, DB queries
#   E2E tests (10%)      — Test full workflows

# UNIT TEST PATTERN:
def test_create_project_validates_name():
    """Project name must be 3-50 characters."""
    with pytest.raises(ValidationError):
        ProjectCreate(name="ab", description="test")

# INTEGRATION TEST PATTERN:
async def test_create_project_endpoint(client, auth_headers):
    response = await client.post("/api/projects", json={
        "name": "Test Project",
        "description": "A test"
    }, headers=auth_headers)

    assert response.status_code == 201
    assert response.json()["data"]["name"] == "Test Project"

# TEST NAMING: test_{what}_{condition}_{expected}
# test_create_project_with_empty_name_returns_400
```

## 8. Performance Checklist

```
[ ] Database queries use indexes (check with EXPLAIN ANALYZE)
[ ] N+1 queries eliminated (use JOINs or batch fetching)
[ ] Frequently accessed data cached (Redis or in-memory)
[ ] Large responses paginated
[ ] File uploads streamed (not loaded to memory)
[ ] Background tasks for long operations (not blocking requests)
[ ] Connection pooling for database
[ ] Gzip compression on responses
[ ] Static assets served from CDN
```

## 9. Code Quality Rules

```
NAMING:
  Functions — verb_noun: create_project, validate_email
  Variables — descriptive: project_count not pc
  Constants — UPPER_SNAKE: MAX_RETRIES, DEFAULT_TIMEOUT
  Classes — PascalCase: ProjectService, UserRepository
  Files — snake_case: project_service.py

FUNCTION RULES:
  - Max 30 lines per function
  - Max 3 parameters (use objects for more)
  - Single responsibility
  - Return early (guard clauses, not deep nesting)
  - No side effects in getters

ERROR RULES:
  - Never swallow exceptions silently
  - Use custom exceptions with error codes
  - Log errors with context
  - Return user-friendly messages
  - Never expose stack traces to users
```
