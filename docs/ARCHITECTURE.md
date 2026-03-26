# SineLab — System Architecture

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    VERCEL (Free)                         │
│                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │  CEO        │  │  Client     │  │  Landing    │     │
│  │  Dashboard  │  │  Portal     │  │  Page       │     │
│  └──────┬──────┘  └──────┬──────┘  └─────────────┘     │
│         │                │                               │
└─────────┼────────────────┼───────────────────────────────┘
          │  HTTPS/WSS     │
          ▼                ▼
┌─────────────────────────────────────────────────────────┐
│                   RAILWAY (~$5/mo)                        │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │              FastAPI Backend                       │   │
│  │                                                    │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │   │
│  │  │  API     │  │  Auth    │  │  WebSocket   │   │   │
│  │  │  Routes  │  │  Layer   │  │  Manager     │   │   │
│  │  └────┬─────┘  └──────────┘  └──────────────┘   │   │
│  │       │                                           │   │
│  │  ┌────▼─────────────────────────────────────┐    │   │
│  │  │         SENTINEL (Chief of Staff)         │    │   │
│  │  │                                           │    │   │
│  │  │  ┌─────────────┐  ┌─────────────────┐   │    │   │
│  │  │  │  Task       │  │  Quality Gate   │   │    │   │
│  │  │  │  Manager    │  │  Controller     │   │    │   │
│  │  │  └─────────────┘  └─────────────────┘   │    │   │
│  │  │  ┌─────────────┐  ┌─────────────────┐   │    │   │
│  │  │  │  Report     │  │  Cost           │   │    │   │
│  │  │  │  Generator  │  │  Tracker        │   │    │   │
│  │  │  └─────────────┘  └─────────────────┘   │    │   │
│  │  └──────────────┬────────────────────────────┘    │   │
│  │                 │                                  │   │
│  │  ┌──────────────▼────────────────────────────┐   │   │
│  │  │         LANGGRAPH ENGINE                    │   │   │
│  │  │                                             │   │   │
│  │  │  ┌────────┐ ┌────────┐ ┌────────┐         │   │   │
│  │  │  │ Team 1 │ │ Team 2 │ │ Team N │  ...    │   │   │
│  │  │  │ Agent  │ │ Agent  │ │ Agent  │         │   │   │
│  │  │  └───┬────┘ └───┬────┘ └───┬────┘         │   │   │
│  │  │      │          │          │                │   │   │
│  │  │  ┌───▼──────────▼──────────▼────┐          │   │   │
│  │  │  │       LLM ROUTER             │          │   │   │
│  │  │  │       (LiteLLM)              │          │   │   │
│  │  │  └───┬──────┬──────┬──────┬─────┘          │   │   │
│  │  └──────┼──────┼──────┼──────┼────────────────┘   │   │
│  └─────────┼──────┼──────┼──────┼────────────────────┘   │
└────────────┼──────┼──────┼──────┼────────────────────────┘
             │      │      │      │
     ┌───────▼──┐ ┌─▼────┐ ┌▼─────┐ ┌▼────────┐
     │ Claude   │ │Deep  │ │GPT-  │ │ Qwen    │
     │ Sonnet   │ │Seek  │ │4o-   │ │ 2.5     │
     │ /Haiku   │ │V3    │ │mini  │ │ Coder   │
     └──────────┘ └──────┘ └──────┘ └─────────┘

┌─────────────────────────────────────────────────────────┐
│                   SUPABASE (Free)                        │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐ │
│  │PostgreSQL│  │  Auth    │  │ Realtime │  │Storage │ │
│  │          │  │          │  │ (WSS)    │  │        │ │
│  └──────────┘  └──────────┘  └──────────┘  └────────┘ │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                   GITHUB (Free)                          │
│                                                          │
│  ganeshmamidipalli/                                      │
│  ├── sinelab-core          (this repo — the framework)  │
│  ├── project-alpha         (auto-created per client)    │
│  ├── project-beta          (auto-created per client)    │
│  └── ...                                                 │
└─────────────────────────────────────────────────────────┘
```

---

## Database Schema (Supabase PostgreSQL)

### Core Tables

```sql
-- Users (CEO + Clients)
users
  id              UUID PRIMARY KEY
  email           TEXT UNIQUE
  name            TEXT
  role            TEXT  -- 'ceo' | 'client'
  created_at      TIMESTAMP

-- Projects
projects
  id              UUID PRIMARY KEY
  name            TEXT
  slug            TEXT UNIQUE
  client_id       UUID REFERENCES users
  status          TEXT  -- 'intake' | 'discovery' | 'architecture' | 'build' | 'ship' | 'delivered' | 'paused'
  github_repo     TEXT
  description     TEXT
  domain          TEXT
  features        JSONB
  tech_stack      JSONB
  budget_limit    DECIMAL
  created_at      TIMESTAMP
  updated_at      TIMESTAMP

-- Teams
teams
  id              UUID PRIMARY KEY
  code            TEXT  -- 'T1', 'T2', etc.
  name            TEXT  -- 'PHANTOM ORACLE', etc.
  role            TEXT  -- 'Domain Expert', etc.

-- Team Members (agents)
team_members
  id              UUID PRIMARY KEY
  team_id         UUID REFERENCES teams
  name            TEXT
  title           TEXT
  status          TEXT  -- 'idle' | 'active' | 'blocked'
  current_task    TEXT

-- Tasks
tasks
  id              UUID PRIMARY KEY
  project_id      UUID REFERENCES projects
  team_id         UUID REFERENCES teams
  assigned_to     UUID REFERENCES team_members
  title           TEXT
  description     TEXT
  status          TEXT  -- 'pending' | 'in_progress' | 'review' | 'completed' | 'rejected'
  priority        TEXT  -- 'low' | 'medium' | 'high' | 'critical'
  phase           TEXT  -- 'discovery' | 'architecture' | 'build' | 'ship'
  depends_on      UUID[]
  output          JSONB
  created_at      TIMESTAMP
  completed_at    TIMESTAMP

-- Activity Log
activity_log
  id              UUID PRIMARY KEY
  project_id      UUID REFERENCES projects
  from_team       UUID REFERENCES teams
  to_team         UUID REFERENCES teams
  type            TEXT  -- 'task_assignment' | 'task_update' | 'handoff' | 'alert' | 'ceo_directive'
  message         TEXT
  metadata        JSONB
  created_at      TIMESTAMP

-- LLM Usage (cost tracking)
llm_usage
  id              UUID PRIMARY KEY
  project_id      UUID REFERENCES projects
  team_id         UUID REFERENCES teams
  member_id       UUID REFERENCES team_members
  model           TEXT
  task_type       TEXT  -- 'code' | 'reason' | 'chat' | 'validate'
  complexity      TEXT  -- 'low' | 'medium' | 'high' | 'critical'
  input_tokens    INTEGER
  output_tokens   INTEGER
  cost_usd        DECIMAL
  latency_ms      INTEGER
  created_at      TIMESTAMP

-- Deliverables
deliverables
  id              UUID PRIMARY KEY
  project_id      UUID REFERENCES projects
  team_id         UUID REFERENCES teams
  title           TEXT
  type            TEXT  -- 'document' | 'code' | 'config' | 'test_report'
  content         TEXT
  file_path       TEXT  -- path in GitHub repo
  status          TEXT  -- 'draft' | 'review' | 'approved' | 'rejected'
  reviewed_by     TEXT  -- 'sentinel' | 'ceo' | 'client'
  created_at      TIMESTAMP

-- CEO Alerts
alerts
  id              UUID PRIMARY KEY
  project_id      UUID REFERENCES projects
  type            TEXT  -- 'approval' | 'budget' | 'blocked' | 'security' | 'quality'
  title           TEXT
  description     TEXT
  status          TEXT  -- 'pending' | 'acknowledged' | 'resolved'
  priority        TEXT  -- 'normal' | 'high' | 'urgent'
  created_at      TIMESTAMP
  resolved_at     TIMESTAMP

-- Chat Messages (client + CEO conversations)
messages
  id              UUID PRIMARY KEY
  project_id      UUID REFERENCES projects
  sender_type     TEXT  -- 'client' | 'ceo' | 'agent'
  sender_name     TEXT
  content         TEXT
  metadata        JSONB
  created_at      TIMESTAMP
```

---

## API Endpoints (FastAPI)

### Auth
```
POST   /api/auth/login          — Login (Supabase Auth)
POST   /api/auth/register       — Register client
GET    /api/auth/me              — Current user info
```

### Projects
```
GET    /api/projects             — List all projects (CEO) or own projects (client)
POST   /api/projects             — Create new project (from intake)
GET    /api/projects/:id         — Project detail
PATCH  /api/projects/:id         — Update project (status, settings)
POST   /api/projects/:id/approve — CEO approves project
POST   /api/projects/:id/pause   — Pause project
POST   /api/projects/:id/resume  — Resume project
```

### Teams
```
GET    /api/teams                — List all teams with members
GET    /api/teams/:id            — Team detail with current tasks
GET    /api/teams/:id/activity   — Team activity log
```

### SENTINEL
```
POST   /api/sentinel/chat        — CEO chat with SENTINEL
GET    /api/sentinel/report       — Generate on-demand report
GET    /api/sentinel/alerts       — Pending CEO alerts
POST   /api/sentinel/alerts/:id   — Acknowledge/resolve alert
POST   /api/sentinel/directive    — CEO sends directive to team
```

### Activity
```
GET    /api/activity              — Activity feed (filtered by project)
GET    /api/activity/live         — WebSocket for real-time updates
```

### Chat (Client)
```
GET    /api/chat/:project_id     — Chat history
POST   /api/chat/:project_id     — Send message (client to AI)
```

### Costs
```
GET    /api/costs                 — Cost overview
GET    /api/costs/:project_id     — Cost breakdown per project
GET    /api/costs/by-model        — Cost by LLM model
GET    /api/costs/by-team         — Cost by team
```

### GitHub
```
POST   /api/github/create-repo    — Create repo for new project
POST   /api/github/commit          — Commit files to project repo
GET    /api/github/status          — Repo status
```

---

## Agent Architecture (LangGraph)

Each team is a LangGraph **StateGraph** with nodes for each team member.

```python
# Simplified team agent structure

from langgraph.graph import StateGraph, END

class TeamState(TypedDict):
    task: str
    context: dict
    outputs: list
    status: str
    current_member: str

def create_team_graph(team_config):
    graph = StateGraph(TeamState)

    # Add a node for each team member
    for member in team_config.members:
        graph.add_node(member.name, member.execute)

    # Team lead routes work to members
    graph.add_node("lead_router", route_to_member)

    # Set entry point
    graph.set_entry_point("lead_router")

    # Add edges based on team workflow
    # ... team-specific routing logic

    return graph.compile()
```

### SENTINEL as Orchestrator

```python
# SENTINEL manages the overall project flow

sentinel_graph = StateGraph(ProjectState)

sentinel_graph.add_node("receive_task", sentinel_receive)
sentinel_graph.add_node("classify", sentinel_classify)
sentinel_graph.add_node("assign_team", sentinel_assign)
sentinel_graph.add_node("quality_gate", sentinel_review)
sentinel_graph.add_node("report", sentinel_report)
sentinel_graph.add_node("escalate_ceo", sentinel_escalate)

# Flow: receive → classify → assign → (team works) → quality_gate → next phase or reject
```

---

## Deployment

### Development (Local)
```bash
# Backend
cd src/
pip install -r requirements.txt
uvicorn api.main:app --reload --port 8000

# Frontend
cd dashboard/
npm install
npm run dev  # localhost:3000
```

### Production
```
Frontend → Vercel (auto-deploy from GitHub)
Backend  → Railway (auto-deploy from GitHub)
Database → Supabase (managed)
```

### Environment Variables
```
# LLM Keys
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
DEEPSEEK_API_KEY=sk-...
DASHSCOPE_API_KEY=sk-...

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...

# GitHub
GITHUB_TOKEN=ghp_...
GITHUB_OWNER=ganeshmamidipalli

# App
APP_ENV=production
APP_SECRET=...
CORS_ORIGINS=https://sinelab.vercel.app
```

---

## Security

- All API keys in environment variables, never committed
- Supabase Row Level Security (RLS) on all tables
- Clients can only see their own projects
- CEO sees everything
- HTTPS everywhere
- Rate limiting on all endpoints
- Input sanitization on all user inputs
- Dependency scanning via GitHub Dependabot
