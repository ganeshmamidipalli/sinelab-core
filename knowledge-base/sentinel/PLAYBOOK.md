# SENTINEL — Chief of Staff Knowledge Base

## How the Best Chiefs of Staff Operate

Source: Practices from McKinsey, BCG, Bain project leads, and Silicon Valley VP-Eng operations.

---

## 1. Project Health Scoring (from McKinsey's Engagement Model)

Every project gets a health score updated daily:

```
HEALTH SCORE = (Progress × 0.3) + (Quality × 0.3) + (Budget × 0.2) + (Team Velocity × 0.2)

Progress:  % of milestones completed vs planned     (0-100)
Quality:   % of deliverables passing first review    (0-100)
Budget:    % of budget remaining vs work remaining   (0-100)
Velocity:  tasks completed per day vs baseline       (0-100)

Score Ranges:
  85-100  = Green  (On Track)
  60-84   = Yellow (At Risk — SENTINEL intervenes)
  0-59    = Red    (Blocked — Escalate to CEO)
```

## 2. The RACI Framework (from Enterprise PMOs)

For every task, define:
- **R** (Responsible): Who does the work (team member)
- **A** (Accountable): Who owns the outcome (team lead)
- **C** (Consulted): Who provides input (other teams)
- **I** (Informed): Who needs to know (SENTINEL, CEO)

SENTINEL auto-generates RACI for every task assignment.

## 3. Escalation Tiers (from Google SRE)

```
Tier 0 — Auto-resolved: Routine tasks, no intervention needed
Tier 1 — SENTINEL resolves: Team conflicts, minor blockers, re-prioritization
Tier 2 — SENTINEL + Team Lead: Technical disagreements, quality rejections
Tier 3 — CEO required: Budget changes, scope changes, architecture decisions, client issues
```

## 4. Daily Standup Protocol (from Agile/Scrum at Scale)

SENTINEL runs async standups for every active project:

```
For each team with active tasks:
  1. What was completed since last standup?
  2. What is being worked on now?
  3. Any blockers?

SENTINEL aggregates into CEO briefing.
No meetings. No wasted time. Pure signal.
```

## 5. Risk Register (from PMI/PRINCE2)

Maintain a live risk register:

```
| Risk | Probability | Impact | Mitigation | Owner |
|------|------------|--------|------------|-------|
| LLM API outage | Medium | High | Fallback chain | SENTINEL |
| Budget overrun | Low | High | Cost alerts at 80% | SENTINEL |
| Scope creep | High | Medium | Strict PRD gate | THUNDER HELM |
```

## 6. Decision Log (from Architecture Decision Records)

Every significant decision logged:

```
DECISION #42
Date: 2026-03-26
Context: Client wants real-time updates
Decision: Use WebSockets via Supabase Realtime
Alternatives considered: SSE, Polling
Rationale: Free tier, already using Supabase
Decided by: IRON BLUEPRINT (Atlas Novak)
Approved by: SENTINEL
```

## 7. Communication Rules (from Amazon's Two-Pizza Teams)

- No ambiguity. Every message has: WHO, WHAT, WHEN, WHY
- No "FYI" messages without action items
- Blockers get immediate response, everything else batched
- Use structured formats, not free-form prose
- Every handoff includes: deliverable + context + acceptance criteria

## 8. Quality Gate Checklist Templates

### Discovery Gate
```
[ ] Domain knowledge base covers all business rules
[ ] All client questions answered
[ ] PRD has acceptance criteria for every feature
[ ] User stories are INVEST compliant (Independent, Negotiable, Valuable, Estimable, Small, Testable)
[ ] Client has signed off on scope
```

### Architecture Gate
```
[ ] ADRs written for every significant decision
[ ] API contracts are complete and unambiguous
[ ] Database schema handles all identified entities
[ ] Non-functional requirements addressed (scale, performance, security)
[ ] Infrastructure cost estimated
[ ] No single points of failure
```

### Build Gate
```
[ ] All PRD features implemented
[ ] Test coverage > 80%
[ ] No critical or high-severity bugs
[ ] API matches contract specification
[ ] Code reviewed by team lead
[ ] Documentation updated
```

### Ship Gate
```
[ ] All tests passing in CI
[ ] Staging deployment successful
[ ] Security scan clean
[ ] Performance benchmarks met
[ ] Rollback plan documented
[ ] Client acceptance criteria verified
```

## 9. Report Writing (from Consulting Best Practices)

**Pyramid Principle (Barbara Minto / McKinsey):**
1. Lead with the answer/recommendation
2. Support with 3-5 key points
3. Each point backed by data
4. No filler, no opinions without evidence

```
BAD:  "The team worked on several things today..."
GOOD: "Project Alpha is on track. 3 of 5 build tasks completed.
       Backend API is 80% done. One blocker: waiting on auth schema
       from IRON BLUEPRINT. Cost today: $2.40."
```

## 10. Cost Optimization Tactics

- **Prompt caching**: Reuse system prompts across calls (Anthropic supports this)
- **Batch similar tasks**: Group multiple small tasks into one LLM call
- **Output length control**: Set max_tokens to prevent verbose responses
- **Model downgrade**: If Haiku can do it, don't use Sonnet
- **Cache frequent queries**: Don't re-ask the same question to an LLM
- **Template reuse**: Generate templates once, fill with variables
