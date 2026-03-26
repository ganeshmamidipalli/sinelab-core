# SineLab

## What Is SineLab

SineLab is an autonomous agentic framework that operates like a full-scale enterprise consulting firm — powered entirely by AI agents. It does the work that companies like Capgemini, Accenture, and TCS do with thousands of people, but with coordinated AI teams.

A client walks in, describes what they need. SineLab's agents take over — discover requirements, design architecture, write code, test, deploy, and deliver. The CEO (Ganesh Mamidipalli) oversees everything through a command dashboard, approving critical decisions while agents handle the rest.

---

## Vision

Replace the traditional software consulting model with an AI-native agentic framework that delivers enterprise-grade applications at a fraction of the cost, time, and headcount.

---

## How It Works

```
CLIENT arrives at SineLab dashboard
        |
        v
AI RECEPTIONIST greets, starts discovery chat
        |
        v
Collects: project name, domain, users, features, constraints
        |
        v
CLIENT-FACING PM agent presents proposal + estimate
        |
        v
SENTINEL (Chief of Staff) reviews, escalates to CEO if needed
        |
        v
CEO approves --> GitHub repo auto-created
        |
        v
SENTINEL activates teams, assigns phases
        |
        v
PHASE 1: Discovery    (PHANTOM ORACLE + THUNDER HELM)
PHASE 2: Architecture (IRON BLUEPRINT)
PHASE 3: Build        (NEURAL STORM + DARK FORGE + PIXEL VENOM)
PHASE 4: Ship         (GHOST DEPLOY + CRASH KINGS)
        |
        v
SENTINEL checks quality at every gate
        |
        v
CEO reviews final report --> Client receives deliverable
```

---

## Org Structure

```
CEO — Ganesh Mamidipalli
 |
 +-- SENTINEL (Chief of Staff Agent)
      |
      +-- T1  PHANTOM ORACLE   (Domain Expert)         — 3 members
      +-- T2  THUNDER HELM     (Product Manager)       — 2 members
      +-- T3  IRON BLUEPRINT   (Solution Architect)    — 3 members
      +-- T4  NEURAL STORM     (AI/ML Engineer)        — 4 members
      +-- T5  DARK FORGE       (Backend Developer)     — 4 members
      +-- T6  PIXEL VENOM      (Frontend Developer)    — 3 members
      +-- T7  GHOST DEPLOY     (DevOps Engineer)       — 3 members
      +-- T8  CRASH KINGS      (QA Engineer)           — 3 members
                                                  TOTAL: 25 members
```

---

## Tech Stack

| Layer            | Technology              | Purpose                                  | Cost         |
|------------------|-------------------------|------------------------------------------|--------------|
| Frontend         | Next.js + Tailwind CSS  | CEO dashboard + Client portal            | Free (Vercel)|
| Backend          | Python + FastAPI        | Agent orchestration, API layer           | ~$5/mo (Railway) |
| Agent Framework  | LangGraph               | Multi-agent state machines, coordination | Free (library) |
| LLM Gateway      | LiteLLM                 | Unified API to all LLMs, cost tracking   | Free (library) |
| Database         | Supabase (PostgreSQL)   | Projects, users, activity, audit logs    | Free tier    |
| Realtime         | Supabase Realtime       | Live dashboard updates via WebSockets    | Free tier    |
| Auth             | Supabase Auth           | CEO login, Client login, role-based      | Free tier    |
| Code Storage     | GitHub API              | Auto-create repos per project            | Free         |
| File Storage     | GitHub + Supabase Storage | Docs, uploads, deliverables            | Free tier    |

**Estimated monthly cost: ~$5 + LLM API usage per project**

---

## LLM Strategy

5 models, used dynamically based on task complexity and cost:

| Priority | Model              | Provider   | Best For                          | Cost (per 1M tokens) |
|----------|--------------------|------------|-----------------------------------|----------------------|
| 1        | Claude Sonnet 4    | Anthropic  | Architecture, reasoning, client   | ~$3 input / $15 out |
| 2        | DeepSeek V3        | DeepSeek   | Coding, feature building          | ~$0.27 / $1.10      |
| 3        | GPT-4o-mini        | OpenAI     | Quick tasks, routing, summaries   | ~$0.15 / $0.60      |
| 4        | Qwen 2.5 Coder    | Alibaba    | Code generation, reviews          | ~$0.30 / $0.60      |
| 5        | Claude Haiku 4.5   | Anthropic  | Fast validation, simple tasks     | ~$0.80 / $4.00      |

**Router Logic:** Every task is classified by complexity (low/medium/high) and type (code/reason/chat). The router picks the cheapest model that meets the quality threshold.

---

## Hosting Strategy

| Component     | Platform  | Plan      | Why                                    |
|---------------|-----------|-----------|----------------------------------------|
| Dashboard UI  | Vercel    | Free      | Perfect for Next.js, global CDN        |
| Agent Backend | Railway   | Starter   | Long-running processes, Python support |
| Database      | Supabase  | Free      | PostgreSQL + Auth + Realtime           |
| Repos         | GitHub    | Free      | One repo per client project            |

---

## Project Management

- Every client project gets its own GitHub repo under `ganeshmamidipalli/`
- All project data stored in Supabase with project_id foreign keys
- CEO dashboard shows all projects in one view
- Client dashboard shows only their project
- SENTINEL generates daily reports per project
- Cost tracking per project via LiteLLM usage logs

---

## Repository Structure

```
sinelab-core/
├── docs/                          # All documentation
│   ├── PROJECT.md                 # This file
│   ├── SENTINEL.md                # Chief of Staff agent spec
│   ├── TEAMS.md                   # All 8 teams spec
│   ├── LLM-ROUTER.md             # LLM routing strategy
│   ├── FLOWS.md                   # Client + CEO flow specs
│   └── ARCHITECTURE.md           # Technical architecture
├── src/
│   ├── agents/
│   │   ├── sentinel/              # CEO's Chief of Staff
│   │   └── receptionist/          # Client-facing greeter
│   ├── router/                    # LLM dynamic router
│   ├── teams/
│   │   ├── phantom-oracle/        # T1 Domain Expert
│   │   ├── thunder-helm/          # T2 Product Manager
│   │   ├── iron-blueprint/        # T3 Solution Architect
│   │   ├── neural-storm/          # T4 AI/ML Engineer
│   │   ├── dark-forge/            # T5 Backend Developer
│   │   ├── pixel-venom/           # T6 Frontend Developer
│   │   ├── ghost-deploy/          # T7 DevOps Engineer
│   │   └── crash-kings/           # T8 QA Engineer
│   ├── api/                       # FastAPI endpoints
│   ├── db/                        # Supabase models + queries
│   ├── config/                    # Environment, constants
│   └── utils/                     # Shared utilities
└── dashboard/                     # Next.js frontend
    ├── app/                       # Pages (CEO + Client views)
    ├── components/                # UI components
    ├── lib/                       # API client, helpers
    └── styles/                    # Tailwind config
```
