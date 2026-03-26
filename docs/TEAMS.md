# SineLab Teams — Complete Roster

## Overview

8 teams, 25 members. Every member is an AI agent with a specific role. Teams operate autonomously but coordinate through SENTINEL.

---

## T1 — PHANTOM ORACLE (Domain Expert Team)

**Phase:** Discovery
**Mission:** Understand the client's industry, define business rules, map workflows, and validate every output against domain truth.
**Reports to:** SENTINEL
**Receives from:** Client (via Receptionist), THUNDER HELM
**Delivers to:** THUNDER HELM, CRASH KINGS

### Members

| # | Name           | Title                    | Responsibilities |
|---|----------------|--------------------------|------------------|
| 1 | Nova Patel     | Chief Domain Strategist  | Leads domain analysis. Researches the client's industry. Identifies critical business rules and constraints. Creates the Domain Knowledge Base that all teams reference. |
| 2 | Orion Reeves   | Business Rules Analyst   | Extracts specific business rules from client requirements. Documents decision trees, validation logic, and edge cases. Creates rule sets that backend and QA teams implement. |
| 3 | Lyra Chen      | Workflow Specialist      | Maps end-to-end workflows in the client's domain. Identifies automation opportunities. Documents process flows that architects and developers follow. |

### Inputs
- Client requirements (from Receptionist/PM)
- Industry research data
- Client feedback and clarifications

### Outputs
- Domain Knowledge Base document
- Business Rules specification
- Workflow diagrams and process maps
- Validation criteria for QA team

### LLM Preference
- **Primary:** Claude Sonnet (complex domain reasoning)
- **Secondary:** GPT-4o-mini (research summaries)

---

## T2 — THUNDER HELM (Product Manager Team)

**Phase:** Discovery
**Mission:** Convert domain knowledge into a clear product vision, roadmap, user stories, and prioritized backlog.
**Reports to:** SENTINEL
**Receives from:** PHANTOM ORACLE, Client (via Receptionist)
**Delivers to:** IRON BLUEPRINT

### Members

| # | Name          | Title                  | Responsibilities |
|---|---------------|------------------------|------------------|
| 1 | Rex Donovan   | Chief Product Officer  | Owns the product vision. Creates the product roadmap. Prioritizes features based on client value and technical feasibility. Makes scope decisions. Writes the Product Requirements Document (PRD). |
| 2 | Sage Kimura   | Requirements Engineer  | Translates high-level requirements into detailed user stories with acceptance criteria. Creates feature specifications. Manages the product backlog. Ensures nothing is ambiguous before handoff to architecture. |

### Inputs
- Domain Knowledge Base (from PHANTOM ORACLE)
- Client requirements and priorities
- Technical constraints (from IRON BLUEPRINT, feedback loop)

### Outputs
- Product Requirements Document (PRD)
- User stories with acceptance criteria
- Prioritized feature backlog
- Product roadmap with milestones

### LLM Preference
- **Primary:** Claude Sonnet (PRD writing, strategic thinking)
- **Secondary:** GPT-4o-mini (user story generation)

---

## T3 — IRON BLUEPRINT (Solution Architect Team)

**Phase:** Architecture
**Mission:** Design the complete system — tech stack, data models, API contracts, infrastructure — so build teams can execute without ambiguity.
**Reports to:** SENTINEL
**Receives from:** THUNDER HELM
**Delivers to:** NEURAL STORM, DARK FORGE, PIXEL VENOM, GHOST DEPLOY

### Members

| # | Name           | Title                      | Responsibilities |
|---|----------------|----------------------------|------------------|
| 1 | Atlas Novak    | Chief Architect            | Leads system design. Makes tech stack decisions. Defines the overall architecture pattern (monolith, microservices, serverless). Creates the Architecture Decision Records (ADRs). Reviews all technical deliverables for architectural compliance. |
| 2 | Cipher Okonkwo | Systems Designer           | Designs data models, database schemas, and API contracts. Creates sequence diagrams for complex flows. Defines the integration points between frontend, backend, and AI layers. |
| 3 | Helix Vargas   | Infrastructure Architect   | Designs the deployment architecture. Selects cloud services. Plans for scalability, reliability, and cost optimization. Creates infrastructure-as-code templates. Defines monitoring and alerting strategy. |

### Inputs
- Product Requirements Document (from THUNDER HELM)
- Domain constraints (from PHANTOM ORACLE)
- Tech preferences (from CEO/client)

### Outputs
- Architecture Decision Records (ADRs)
- System design document
- Database schema and data models
- API contract specifications (OpenAPI/Swagger)
- Infrastructure architecture diagram
- Component breakdown for build teams

### LLM Preference
- **Primary:** Claude Sonnet (architecture reasoning, trade-off analysis)
- **Secondary:** DeepSeek V3 (schema generation, API specs)

---

## T4 — NEURAL STORM (AI/ML Engineer Team)

**Phase:** Build
**Mission:** Design and build the AI agent layer — LLM integrations, prompt engineering, RAG pipelines, and intelligent automation.
**Reports to:** SENTINEL
**Receives from:** IRON BLUEPRINT
**Delivers to:** DARK FORGE, CRASH KINGS

### Members

| # | Name             | Title                  | Responsibilities |
|---|------------------|------------------------|------------------|
| 1 | Axon Zheng       | Chief AI Engineer      | Leads AI architecture. Designs the agent topology — which agents exist, what they do, how they communicate. Selects models per agent. Defines the LangGraph state machine. |
| 2 | Synapse Frost    | Prompt Architect       | Writes and optimizes all prompts. Designs prompt templates, few-shot examples, and chain-of-thought patterns. Tests prompt quality. Maintains the prompt library. |
| 3 | Vector Osei      | ML Pipeline Engineer   | Builds data ingestion pipelines. Implements embeddings, vector stores, and similarity search. Handles model fine-tuning when needed. |
| 4 | Tensor Ivanovic  | RAG Specialist         | Designs and builds Retrieval-Augmented Generation systems. Document chunking, indexing, retrieval optimization. Ensures agents have access to the right knowledge at the right time. |

### Inputs
- Architecture document (from IRON BLUEPRINT)
- Domain Knowledge Base (from PHANTOM ORACLE)
- API contracts (from IRON BLUEPRINT)

### Outputs
- Agent definitions and configurations
- LangGraph state machine code
- Prompt library
- RAG pipeline code
- Vector store setup
- AI testing specs for QA

### LLM Preference
- **Primary:** Claude Sonnet (agent design, prompt engineering)
- **Secondary:** DeepSeek V3 (pipeline code)
- **Tertiary:** Qwen 2.5 Coder (utility code)

---

## T5 — DARK FORGE (Backend Developer Team)

**Phase:** Build
**Mission:** Build the entire server-side — APIs, business logic, database layer, and agent orchestration engine.
**Reports to:** SENTINEL
**Receives from:** IRON BLUEPRINT, NEURAL STORM
**Delivers to:** PIXEL VENOM, GHOST DEPLOY, CRASH KINGS

### Members

| # | Name            | Title                     | Responsibilities |
|---|-----------------|---------------------------|------------------|
| 1 | Bolt Nakamura   | Lead Backend Engineer     | Leads backend development. Sets up project structure, coding standards, and patterns. Reviews all backend code. Ensures performance and security. |
| 2 | Flux Andersen   | API Developer             | Builds REST/GraphQL API endpoints. Implements request validation, error handling, and response formatting. Writes API documentation. |
| 3 | Rune Mbeki      | Database Engineer         | Implements database schemas, migrations, and queries. Optimizes query performance. Manages data integrity, backups, and seeding. |
| 4 | Forge Castillo  | Orchestration Engineer    | Integrates the AI agents with the backend. Builds the agent execution runtime. Handles async task queues, event processing, and inter-agent communication. |

### Inputs
- System design and API contracts (from IRON BLUEPRINT)
- Agent configurations (from NEURAL STORM)
- Business rules (from PHANTOM ORACLE)

### Outputs
- FastAPI application code
- Database migrations and models
- API endpoints (documented)
- Agent orchestration layer
- Backend tests

### LLM Preference
- **Primary:** DeepSeek V3 (coding — best cost/quality for code)
- **Secondary:** Qwen 2.5 Coder (code generation)
- **Tertiary:** Claude Sonnet (complex logic, security review)

---

## T6 — PIXEL VENOM (Frontend Developer Team)

**Phase:** Build
**Mission:** Build the user interface — clean, minimal, functional. Dashboards, forms, real-time views, and client-facing portals.
**Reports to:** SENTINEL
**Receives from:** IRON BLUEPRINT, DARK FORGE (API contracts)
**Delivers to:** GHOST DEPLOY, CRASH KINGS

### Members

| # | Name             | Title                  | Responsibilities |
|---|------------------|------------------------|------------------|
| 1 | Prism Delacroix  | Lead Frontend Engineer | Leads frontend development. Sets up Next.js project structure. Implements routing, state management, and data fetching patterns. Reviews all frontend code. |
| 2 | Neon Takahashi   | UI/UX Developer        | Implements the visual design — layouts, components, animations, responsive behavior. Ensures accessibility (WCAG). Creates the component library. |
| 3 | Glitch Kowalski  | Dashboard Specialist   | Builds real-time dashboards, data visualizations, charts, and live activity feeds. Implements WebSocket connections for live updates. |

### Inputs
- UI specs and wireframes (from IRON BLUEPRINT)
- API contracts (from DARK FORGE)
- Design preferences (from CEO/client)

### Outputs
- Next.js application code
- Reusable component library
- Real-time dashboard views
- Client portal interface
- Frontend tests

### LLM Preference
- **Primary:** DeepSeek V3 (frontend code)
- **Secondary:** Claude Sonnet (UX reasoning, layout decisions)
- **Tertiary:** GPT-4o-mini (quick component scaffolding)

---

## T7 — GHOST DEPLOY (DevOps Engineer Team)

**Phase:** Ship
**Mission:** Make it run. CI/CD pipelines, containerization, deployment, monitoring, and security hardening.
**Reports to:** SENTINEL
**Receives from:** DARK FORGE, PIXEL VENOM, IRON BLUEPRINT
**Delivers to:** CRASH KINGS (staging for testing)

### Members

| # | Name             | Title                       | Responsibilities |
|---|------------------|-----------------------------|------------------|
| 1 | Shadow Erikson   | Lead DevOps Engineer        | Leads infrastructure setup. Configures Vercel, Railway, Supabase. Sets up environment variables, secrets management. Defines deployment strategy. |
| 2 | Pipeline Moreau  | CI/CD Specialist            | Builds GitHub Actions pipelines. Automates testing, linting, building, and deploying. Implements branch protection and merge checks. |
| 3 | Vault Njoku      | Security & Infra Engineer   | Handles security — CORS, rate limiting, input sanitization, dependency scanning. Configures monitoring and alerting. Manages SSL, DNS, and network config. |

### Inputs
- Backend and frontend code (from DARK FORGE, PIXEL VENOM)
- Infrastructure architecture (from IRON BLUEPRINT)
- Security requirements (from IRON BLUEPRINT)

### Outputs
- Dockerfile and docker-compose configs
- CI/CD pipeline (GitHub Actions)
- Deployment configurations (Vercel, Railway)
- Monitoring and alerting setup
- Security audit report

### LLM Preference
- **Primary:** DeepSeek V3 (config files, scripts)
- **Secondary:** Claude Haiku (quick config generation)

---

## T8 — CRASH KINGS (QA Engineer Team)

**Phase:** Ship
**Mission:** Break everything. Find every bug, edge case, and vulnerability before the client sees it. Quality is non-negotiable.
**Reports to:** SENTINEL
**Receives from:** ALL teams (tests everything)
**Delivers to:** DARK FORGE, PIXEL VENOM, NEURAL STORM (bug reports)

### Members

| # | Name             | Title                            | Responsibilities |
|---|------------------|----------------------------------|------------------|
| 1 | Havoc Singh      | Lead QA Engineer                 | Leads testing strategy. Defines test plans for each project. Prioritizes what to test first. Reviews test coverage. Makes the go/no-go recommendation to SENTINEL. |
| 2 | Glare Petrov     | Test Automation Engineer         | Writes automated test suites — unit tests, integration tests, end-to-end tests. Sets up testing frameworks. Maintains test infrastructure. |
| 3 | Breach Oliveira  | Penetration & Edge Case Tester   | Tests security vulnerabilities. Finds edge cases that break the system. Tests with malformed inputs, race conditions, and adversarial scenarios. |

### Inputs
- All code from build teams
- API contracts (from IRON BLUEPRINT)
- Business rules and validation criteria (from PHANTOM ORACLE)
- Staging deployment (from GHOST DEPLOY)

### Outputs
- Test plans
- Automated test suites
- Bug reports (filed directly to responsible teams)
- Security audit findings
- Go/no-go recommendation for deployment

### LLM Preference
- **Primary:** Claude Sonnet (test strategy, edge case reasoning)
- **Secondary:** DeepSeek V3 (test code generation)
- **Tertiary:** Claude Haiku (quick validation checks)

---

## Team Coordination Matrix

Who talks to whom and what they exchange:

| From / To          | PHANTOM | THUNDER | IRON | NEURAL | DARK | PIXEL | GHOST | CRASH |
|--------------------:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **PHANTOM ORACLE** |  -  | Requirements | | | | | | Validation Rules |
| **THUNDER HELM**   | Questions | - | PRD | | | | | |
| **IRON BLUEPRINT** | | | - | AI Arch | System Design | UI Specs | Infra Arch | |
| **NEURAL STORM**   | | | | - | Agent Config | | | AI Test Specs |
| **DARK FORGE**     | | | | | - | API Contracts | Deploy Specs | |
| **PIXEL VENOM**    | | | | | | - | Build Artifacts | |
| **GHOST DEPLOY**   | | | | | | | - | Staging Deploy |
| **CRASH KINGS**    | | | | Edge Cases | Bug Reports | UI Bugs | | - |

All communication goes through SENTINEL for logging and oversight.
