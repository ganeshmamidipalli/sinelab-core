# IRON BLUEPRINT — Solution Architect Knowledge Base

## How the Best Architects Work

Source: Practices from Martin Fowler, AWS Well-Architected Framework, Google SRE, ThoughtWorks Technology Radar, and TOGAF.

---

## 1. Architecture Decision Records (ADR)

Every significant decision documented using Michael Nygard's format:

```markdown
# ADR-001: [Decision Title]

## Status
Accepted | Superseded | Deprecated

## Context
What is the situation? What forces are at play?

## Decision
What did we decide?

## Consequences
What are the trade-offs? What becomes easier? Harder?

## Alternatives Considered
| Option | Pros | Cons | Why Not |
|--------|------|------|---------|
```

## 2. AWS Well-Architected Framework (6 Pillars)

Apply to every architecture:

```
1. OPERATIONAL EXCELLENCE
   - Automate everything possible
   - Monitor and respond to events
   - Make small, reversible changes
   - Learn from failures

2. SECURITY
   - Least privilege access
   - Encrypt data at rest and in transit
   - Enable traceability (audit logs)
   - Protect data at all layers

3. RELIABILITY
   - Auto-recover from failure
   - Scale horizontally
   - No single points of failure
   - Test recovery procedures

4. PERFORMANCE EFFICIENCY
   - Use the right resource type for workload
   - Monitor performance metrics
   - Use caching where appropriate
   - Minimize latency

5. COST OPTIMIZATION
   - Pay only for what you use
   - Measure efficiency
   - Stop spending on undifferentiated heavy lifting
   - Analyze and attribute expenditure

6. SUSTAINABILITY
   - Understand impact
   - Maximize utilization
   - Use managed services
   - Reduce downstream impact
```

## 3. System Design Patterns

### For API Architecture
```
REST API Design (Best Practices):
  - Use nouns, not verbs: /users not /getUsers
  - Use plural: /users not /user
  - Nest for relationships: /users/123/orders
  - Use HTTP methods correctly: GET/POST/PUT/PATCH/DELETE
  - Always version: /api/v1/users
  - Use consistent error format:
    { "error": { "code": "NOT_FOUND", "message": "..." } }
  - Paginate list endpoints: ?page=1&limit=20
  - Filter with query params: ?status=active&sort=-created_at
```

### For Data Architecture
```
Database Selection Matrix:
  Structured data + complex queries → PostgreSQL
  Document/flexible schema → MongoDB
  Key-value + caching → Redis
  Full-text search → Elasticsearch / Meilisearch
  Time-series data → TimescaleDB / InfluxDB
  Vector embeddings → Pinecone / pgvector
  File storage → S3 / Supabase Storage
```

### For Scalability
```
Horizontal Scaling Patterns:
  - Stateless services (no local state)
  - Database read replicas for read-heavy loads
  - Message queues for async processing
  - CDN for static assets
  - Connection pooling for databases
  - Rate limiting at API gateway
```

## 4. C4 Model for Documentation (Simon Brown)

Four levels of architecture diagrams:

```
Level 1 — SYSTEM CONTEXT
  Shows: Your system as a box, surrounded by users and external systems
  Audience: Everyone (business + technical)

Level 2 — CONTAINER
  Shows: Major containers (web app, API, database, message queue)
  Audience: Technical team

Level 3 — COMPONENT
  Shows: Components inside each container (controllers, services, repos)
  Audience: Developers

Level 4 — CODE
  Shows: Class/function level detail
  Audience: Developers working on that component
```

## 5. API Contract First Design

Design APIs before writing code:

```yaml
# OpenAPI 3.0 Specification Template
openapi: 3.0.0
info:
  title: Project API
  version: 1.0.0

paths:
  /api/v1/resource:
    get:
      summary: List resources
      parameters:
        - name: page
          in: query
          schema: { type: integer, default: 1 }
        - name: limit
          in: query
          schema: { type: integer, default: 20 }
      responses:
        200:
          description: Success
          content:
            application/json:
              schema:
                type: object
                properties:
                  data: { type: array, items: { $ref: '#/components/schemas/Resource' } }
                  total: { type: integer }
                  page: { type: integer }
        401: { description: Unauthorized }
        500: { description: Server error }
```

## 6. Database Schema Design Rules

```
NORMALIZATION RULES:
  1NF — No repeating groups, atomic values
  2NF — No partial dependencies
  3NF — No transitive dependencies
  When to denormalize: read-heavy, reporting, known query patterns

NAMING CONVENTIONS:
  Tables: plural, snake_case (users, order_items)
  Columns: singular, snake_case (first_name, created_at)
  Primary keys: id (UUID preferred)
  Foreign keys: {table_singular}_id (user_id, order_id)
  Timestamps: created_at, updated_at (always UTC)
  Booleans: is_active, has_verified, can_edit

INDEXING STRATEGY:
  Always index: foreign keys, fields used in WHERE/ORDER BY
  Consider index: fields used in JOIN, frequently filtered columns
  Avoid indexing: rarely queried fields, very large text columns

MIGRATION RULES:
  - Every schema change is a versioned migration file
  - Migrations must be reversible (up + down)
  - Never modify existing migration files
  - Test migrations on staging before production
  - Back up before running migrations in production
```

## 7. Security Architecture Checklist

```
AUTHENTICATION:
  [ ] JWT tokens with short expiry (15min access, 7day refresh)
  [ ] Passwords hashed with bcrypt/argon2 (never MD5/SHA)
  [ ] Rate limit login attempts (5 per minute)
  [ ] Support MFA for admin accounts

AUTHORIZATION:
  [ ] Role-Based Access Control (RBAC)
  [ ] Row Level Security (RLS) on database
  [ ] Principle of least privilege
  [ ] API keys scoped to specific endpoints

DATA PROTECTION:
  [ ] HTTPS everywhere (TLS 1.3)
  [ ] Encrypt sensitive data at rest
  [ ] Never log sensitive data (passwords, tokens, PII)
  [ ] Sanitize all user input (prevent SQLi, XSS)

API SECURITY:
  [ ] CORS configured (specific origins, not *)
  [ ] Rate limiting on all endpoints
  [ ] Input validation on all endpoints
  [ ] Request size limits
  [ ] No sensitive data in URLs (use headers/body)
```

## 8. Tech Stack Selection Criteria

```
For each technology choice, evaluate:

1. MATURITY     — Is it production-proven? Who uses it?
2. COMMUNITY    — Active maintainers? Good docs? Stack Overflow answers?
3. PERFORMANCE  — Meets our non-functional requirements?
4. COST         — License cost? Hosting cost? Developer time cost?
5. TEAM FIT     — Does our team know it? Learning curve?
6. SCALABILITY  — Will it handle 10x growth?
7. LOCK-IN      — Can we switch if needed? Open standards?
8. INTEGRATION  — Works with our other tools? Good APIs?

Score each 1-5. Total > 30 = strong choice. < 20 = risky.
```

## 9. Architecture Review Checklist

Before handing off to build teams:

```
COMPLETENESS:
[ ] All PRD features have a technical solution
[ ] API contracts cover all user stories
[ ] Database schema handles all data entities
[ ] Integration points with external systems defined

QUALITY:
[ ] No single points of failure
[ ] Caching strategy defined where needed
[ ] Error handling strategy defined
[ ] Logging and monitoring strategy defined

FEASIBILITY:
[ ] Tech stack matches team capabilities
[ ] Infrastructure cost within budget
[ ] Timeline realistic for proposed architecture
[ ] No unknown unknowns (or they're flagged as risks)

CLARITY:
[ ] Build teams can start without asking questions
[ ] Each team knows exactly what to build
[ ] Interfaces between components are unambiguous
[ ] Component boundaries are clear
```

## 10. Handoff Package to Build Teams

```
DELIVERABLES:
  1. Architecture Overview Document (C4 Level 1 + 2)
  2. ADRs for all significant decisions
  3. API Contract (OpenAPI spec)
  4. Database Schema (ERD + migration plan)
  5. Infrastructure Diagram
  6. Component Breakdown (what each team builds)
  7. Integration Guide (how components connect)
  8. Security Architecture Document
  9. Non-Functional Requirements with targets
  10. Risk Register
```
