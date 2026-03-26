# THUNDER HELM — Product Manager Knowledge Base

## How the Best Product Managers Work

Source: Practices from Marty Cagan (SVPG/Inspired), Spotify, Stripe, Linear, and top PM frameworks.

---

## 1. Product Requirements Document (PRD) — Production Template

```markdown
# PRD: [Feature/Product Name]
Version: 1.0 | Author: [PM] | Date: [Date] | Status: Draft/Review/Approved

## 1. Problem Statement
What problem are we solving? For whom? Why now?
[2-3 sentences. Be specific. Include data if available.]

## 2. Goals & Success Metrics
| Goal | Metric | Target |
|------|--------|--------|
| [Goal 1] | [Measurable metric] | [Specific target] |

## 3. User Personas
| Persona | Role | Pain Point | Goal |
|---------|------|-----------|------|

## 4. User Stories
| ID | As a... | I want to... | So that... | Priority |
|----|---------|-------------|-----------|----------|
| US-01 | [persona] | [action] | [benefit] | P0/P1/P2 |

## 5. Functional Requirements
| ID | Requirement | Acceptance Criteria |
|----|------------|-------------------|
| FR-01 | [What the system must do] | [How we verify it works] |

## 6. Non-Functional Requirements
- Performance: [response times, throughput]
- Scalability: [expected load, growth]
- Security: [auth, encryption, compliance]
- Availability: [uptime target]

## 7. Out of Scope
[Explicitly list what this project will NOT do]

## 8. Dependencies
[External systems, APIs, teams, data]

## 9. Risks
| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|

## 10. Timeline
| Phase | Deliverable | Target Date |
|-------|-----------|-------------|
```

## 2. User Story Writing (INVEST Criteria)

Every user story must be:
- **I**ndependent — Can be built and delivered alone
- **N**egotiable — Details can be discussed
- **V**aluable — Delivers value to the user
- **E**stimable — Team can estimate effort
- **S**mall — Completable in one sprint/cycle
- **T**estable — Clear pass/fail criteria

### Story Format
```
As a [user persona],
I want to [action/capability],
So that [benefit/value].

Acceptance Criteria:
  GIVEN [precondition]
  WHEN [action]
  THEN [expected result]
```

### Example
```
As a maintenance engineer,
I want to receive real-time alerts when sensor readings exceed thresholds,
So that I can investigate potential failures before they cause downtime.

Acceptance Criteria:
  GIVEN a sensor is streaming data
  WHEN a reading exceeds the configured threshold
  THEN an alert appears on my dashboard within 5 seconds
  AND the alert shows sensor ID, current value, threshold, and timestamp
  AND I can acknowledge the alert to stop repeated notifications
```

## 3. Prioritization Frameworks

### RICE Scoring (Intercom)
```
Reach    — How many users affected per quarter? (number)
Impact   — How much does it move the needle? (0.25, 0.5, 1, 2, 3)
Confidence — How sure are we? (50%, 80%, 100%)
Effort   — Person-weeks to build (number)

RICE Score = (Reach × Impact × Confidence) / Effort

Higher score = higher priority.
```

### Value vs Effort Matrix
```
         High Value
            │
  Quick     │    Big Bets
  Wins      │    (plan carefully)
            │
  ──────────┼──────────
            │
  Don't     │    Money Pit
  Bother    │    (avoid)
            │
         Low Value
  Low Effort ──── High Effort
```

### Priority Levels
```
P0 — Launch blocker. System doesn't work without this. Do first.
P1 — Core feature. High user value. Do in first release.
P2 — Important enhancement. Do in second release.
P3 — Nice to have. Backlog for future.
```

## 4. Product Roadmap (from Linear/Notion Best Practices)

```
NOW (This Sprint)          NEXT (Next Sprint)       LATER (Backlog)
┌─────────────────┐       ┌─────────────────┐      ┌─────────────────┐
│ P0: Auth system  │       │ P1: Dashboard   │      │ P2: Analytics   │
│ P0: Core API     │       │ P1: Alerts      │      │ P2: Export      │
│ P0: Data model   │       │ P1: Client view │      │ P3: Mobile app  │
└─────────────────┘       └─────────────────┘      └─────────────────┘
```

## 5. Scope Management (Preventing Scope Creep)

```
SCOPE CONTROL RULES:
1. Every feature must trace back to a user story in the PRD
2. New requests go to backlog, not current sprint
3. Scope changes require CEO approval (via SENTINEL)
4. "Out of Scope" section is as important as "In Scope"
5. If adding a feature, identify what to cut to stay on timeline
```

## 6. Acceptance Criteria Patterns

### Behavioral (Given/When/Then)
```
GIVEN I am logged in as an admin
WHEN I click "Generate Report"
THEN a PDF report downloads within 10 seconds
AND it contains all project data from the selected date range
```

### Rule-Based
```
- Passwords must be at least 12 characters
- Passwords must contain: uppercase, lowercase, number, symbol
- Account locks after 5 failed attempts
- Lock duration: 30 minutes
```

### Data-Based
```
- API response must include: id, name, status, created_at
- Response time must be < 200ms for 95th percentile
- Maximum payload size: 1MB
- Date format: ISO 8601 (YYYY-MM-DDTHH:mm:ssZ)
```

## 7. Feature Specification Format

For complex features, expand beyond user stories:

```
FEATURE: Real-time Alert System

OVERVIEW: Monitors sensor data streams and triggers alerts
when readings exceed configurable thresholds.

USER FLOW:
  1. Admin configures thresholds per sensor type
  2. System ingests sensor data in real-time
  3. System compares readings against thresholds
  4. If exceeded → create alert → push to dashboard
  5. Engineer sees alert → acknowledges → investigates
  6. Engineer resolves → marks alert resolved

EDGE CASES:
  - Sensor sends invalid data → log error, don't alert
  - Multiple thresholds exceeded simultaneously → batch alerts
  - Network disconnection → queue alerts, send when reconnected
  - Threshold changed while alert pending → re-evaluate

DEPENDENCIES:
  - WebSocket connection (PIXEL VENOM)
  - Sensor data API (DARK FORGE)
  - Threshold configuration UI (PIXEL VENOM)

NOT INCLUDED:
  - SMS/email notifications (future release)
  - Custom alert sounds
  - Alert grouping by location
```

## 8. Handoff Checklist (PM → Architect)

```
HANDOFF TO IRON BLUEPRINT:
[ ] PRD approved by client and CEO
[ ] All user stories written with acceptance criteria
[ ] Priority assigned to every feature (P0/P1/P2/P3)
[ ] Non-functional requirements specified
[ ] Out of scope explicitly listed
[ ] Dependencies identified
[ ] Risks documented with mitigations
[ ] User flow diagrams for complex features
[ ] Edge cases documented for each feature
[ ] No ambiguous requirements (architect can build without asking PM)
```
