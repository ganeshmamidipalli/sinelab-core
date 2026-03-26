# SineLab Flows — Client Journey + CEO Operations

---

## PART 1: CLIENT FLOW

### Step 1 — Client Arrives

Client receives a dashboard URL from Ganesh (or finds SineLab online).

```
Client opens: https://sinelab.vercel.app/client/login
  → Signs up or logs in via Supabase Auth
  → Lands on their Client Dashboard
```

### Step 2 — First Contact (AI Receptionist)

The **AI Receptionist** is the first agent the client talks to. This is a chat interface — conversational, warm, professional. Like walking into a top consulting firm.

**Receptionist behavior:**
- Greets the client by name
- Asks what they need built
- Guides the conversation naturally (not a form)
- Extracts key information through dialogue:

```
Receptionist: "Welcome to SineLab. I'm your project coordinator.
               Tell me — what are you looking to build?"

Client:       "We need a system that monitors our factory sensors
               and predicts equipment failures."

Receptionist: "Interesting — predictive maintenance for manufacturing.
               Who would use this system day-to-day?"

Client:       "Our plant engineers and maintenance managers."

Receptionist: "Got it. And what's the scale — how many sensors,
               how many factories?"

... continues until all key info is gathered ...
```

**Information the Receptionist collects:**
1. Project name / working title
2. What the system does (one paragraph)
3. Target users and their pain points
4. Industry/domain
5. Scale (users, data volume)
6. Key features (must-haves)
7. Nice-to-haves
8. Any tech preferences or constraints
9. Timeline expectations
10. Budget range (if willing to share)

### Step 3 — Handoff to Product Manager

Receptionist creates a **Project Brief** and hands it to THUNDER HELM (PM team).

```
RECEPTIONIST → THUNDER HELM
  Sends: Project Brief document

THUNDER HELM (Rex Donovan) reviews, creates:
  → Project Proposal (scope, timeline, approach)
  → Feature list with priorities
  → Rough estimate
```

### Step 4 — Proposal Presentation

The PM agent presents the proposal back to the client via the dashboard:

```
Client sees:
  - Project summary (confirms understanding)
  - Proposed feature list (P0, P1, P2)
  - Approach overview
  - Estimated timeline
  - Estimated cost range

Client can:
  - Approve as-is → Project starts
  - Request changes → PM adjusts
  - Ask questions → Chat with PM agent
  - Decline → Project archived
```

### Step 5 — CEO Approval Gate

Before any project starts:

```
THUNDER HELM → SENTINEL → CEO

SENTINEL presents to CEO:
  - Client name and project summary
  - Proposed scope and timeline
  - Estimated LLM cost
  - Risk assessment
  - Recommendation: approve / needs review

CEO: Approves or requests changes
```

### Step 6 — Project Kickoff

On CEO approval:

```
SENTINEL automatically:
  1. Creates GitHub repo: ganeshmamidipalli/{project-name}
  2. Creates project record in Supabase
  3. Activates Phase 1 teams (PHANTOM ORACLE + THUNDER HELM)
  4. Notifies client: "Your project has started"
  5. Sets up cost tracking
  6. Initializes activity log
```

### Step 7 — Client Watches Progress

Client dashboard shows:
- Current phase and progress
- Activity feed (what teams are doing)
- Deliverables as they're completed
- Chat with PM agent for questions
- Cost tracking (if enabled)

Client can:
- Give feedback on deliverables
- Answer domain questions from PHANTOM ORACLE
- Approve milestones
- Request scope changes (goes through SENTINEL → CEO)

### Step 8 — Delivery

When all phases complete:

```
CRASH KINGS → SENTINEL: "All tests pass. Recommending go."
SENTINEL → CEO: "Project ready for final review."
CEO → Reviews → Approves delivery
SENTINEL → Client: "Your project is complete."

Client receives:
  - GitHub repo with all code
  - Deployment URL (if applicable)
  - Documentation
  - Test reports
  - Handover guide
```

---

## PART 2: CEO FLOW

### CEO Dashboard — What You See When You Open It

```
+----------------------------------------------------------+
|  SineLab Command Center                    [Ganesh M.]    |
+----------------------------------------------------------+
|                                                           |
|  SENTINEL BRIEFING                                        |
|  "Good morning. 2 active projects. 1 needs your          |
|   attention. Total spend today: $3.40"                    |
|                                                           |
|  [View Full Report]  [Open Alerts]                        |
|                                                           |
+----------------------------------------------------------+
|                                                           |
|  ACTIVE PROJECTS                                          |
|  +---------------------------------------------------+   |
|  | Project Alpha    Phase: Build    Health: Good      |   |
|  | Client: XYZ Corp  Teams: 5/8 active  Cost: $42    |   |
|  +---------------------------------------------------+   |
|  | Project Beta     Phase: Discovery  Health: Good    |   |
|  | Client: ABC Ltd   Teams: 2/8 active  Cost: $8     |   |
|  +---------------------------------------------------+   |
|                                                           |
|  PENDING APPROVALS                                        |
|  - [Approve] New project request from Client DEF          |
|  - [Review]  Architecture decision: monolith vs micro     |
|                                                           |
|  COST OVERVIEW                                            |
|  This week: $28.50 | This month: $94.20                  |
|  By model: Claude $52 | DeepSeek $31 | GPT $11          |
|                                                           |
+----------------------------------------------------------+
```

### CEO Actions

| Action | How |
|--------|-----|
| **Chat with SENTINEL** | Type in plain English. "What's the status of Project Alpha?" |
| **Approve/Reject projects** | One-click approve or reject with optional note |
| **Review deliverables** | Click into any project, see outputs from each team |
| **Override decisions** | Override any SENTINEL decision with CEO authority |
| **View costs** | Drill down by project, team, model, time period |
| **Upload resources** | Upload APIs, docs, credentials for a project |
| **Pause/Resume projects** | SENTINEL halts/resumes all teams on that project |
| **View audit trail** | Every action, every decision, timestamped |

### CEO → SENTINEL Communication

```
CEO types: "Tell DARK FORGE to prioritize the auth API on Project Alpha"

SENTINEL:
  1. Acknowledges: "Understood. Relaying to DARK FORGE."
  2. Sends task to Bolt Nakamura (Lead Backend):
     "CEO directive: Prioritize auth API. Drop current task, switch now."
  3. Bolt acknowledges, starts work
  4. SENTINEL confirms to CEO: "DARK FORGE has acknowledged.
     Bolt Nakamura is now working on auth API. ETA: 2 hours."
```

### CEO Reports

**On-demand:** CEO clicks "Generate Report" or asks SENTINEL
**Auto-generated:** Daily at end of day, weekly on Fridays

Report contents:
- Project status summary (all projects)
- What was completed today
- What's blocked and why
- Cost breakdown
- Quality metrics (deliverables reviewed, pass/fail rate)
- Items needing CEO decision
- Risk alerts

---

## PART 3: PHASE GATES

Work flows through 4 phases. Each phase has a quality gate — SENTINEL must approve before the next phase starts.

### Gate 1: Discovery → Architecture

```
SENTINEL checks:
  ✓ Domain Knowledge Base complete (PHANTOM ORACLE)
  ✓ PRD complete with user stories (THUNDER HELM)
  ✓ Client has reviewed and approved scope
  ✓ No unresolved questions

If all pass → Activate IRON BLUEPRINT
If any fail → Send back to responsible team with feedback
```

### Gate 2: Architecture → Build

```
SENTINEL checks:
  ✓ Architecture document complete (IRON BLUEPRINT)
  ✓ API contracts defined
  ✓ Database schema designed
  ✓ Infrastructure plan ready
  ✓ No architectural risks unaddressed

If all pass → Activate NEURAL STORM + DARK FORGE + PIXEL VENOM
If any fail → Send back to IRON BLUEPRINT
```

### Gate 3: Build → Ship

```
SENTINEL checks:
  ✓ All features implemented per PRD
  ✓ Backend code complete with tests (DARK FORGE)
  ✓ Frontend code complete (PIXEL VENOM)
  ✓ AI agents working (NEURAL STORM)
  ✓ Code review passed
  ✓ No critical bugs

If all pass → Activate GHOST DEPLOY + CRASH KINGS
If any fail → Send back to responsible build team
```

### Gate 4: Ship → Deliver

```
SENTINEL checks:
  ✓ CI/CD pipeline passing (GHOST DEPLOY)
  ✓ All tests passing (CRASH KINGS)
  ✓ Security audit clean (CRASH KINGS)
  ✓ Performance acceptable
  ✓ Documentation complete

If all pass → Present to CEO for final approval
If any fail → Send back to responsible team
CEO approves → Deliver to client
```

---

## PART 4: COMMUNICATION PROTOCOLS

### Message Types

| Type | Priority | Example |
|------|----------|---------|
| `task_assignment` | Normal | SENTINEL assigns work to a team |
| `task_update` | Normal | Team reports progress |
| `task_complete` | Normal | Team delivers output |
| `question` | Normal | Team needs clarification |
| `blocked` | High | Team is stuck |
| `bug_report` | High | QA found an issue |
| `alert` | Urgent | Budget overrun, security issue |
| `ceo_directive` | Immediate | CEO gives a direct order |

### Escalation Path

```
Team Member → Team Lead → SENTINEL → CEO

Most issues resolve at SENTINEL level.
Only critical items reach CEO.
```

### Response SLAs

| Priority | Expected Response |
|----------|-------------------|
| Normal | Within current work cycle |
| High | Within 15 minutes |
| Urgent | Immediate |
| CEO Directive | Immediate |
