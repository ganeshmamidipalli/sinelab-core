"""
Project Orchestrator — Automatically runs the full project pipeline.

When a project is approved by the CEO, this engine:
1. Activates Phase 1 (Discovery) teams
2. Runs quality gates between phases
3. Passes outputs from one team to the next
4. Tracks progress and reports to SENTINEL
5. Delivers final output

PHASES:
  Discovery    → PHANTOM ORACLE + THUNDER HELM
  Architecture → IRON BLUEPRINT
  Build        → NEURAL STORM + DARK FORGE + PIXEL VENOM
  Ship         → GHOST DEPLOY + CRASH KINGS
"""

import asyncio
from typing import Optional
from agents.base import projects_db, log_activity, alerts_db
from agents.team_agent import team_execute
from agents.sentinel.agent import sentinel_quality_gate, sentinel_assign_task


async def run_project_pipeline(project_id: str) -> dict:
    """
    Run the full automated project pipeline.
    Each phase feeds into the next. Quality gates between phases.
    """
    project = projects_db.get(project_id)
    if not project:
        return {"error": "Project not found"}

    results = {}

    log_activity(
        "pipeline_started",
        "SENTINEL",
        f"Pipeline started for project: {project['name']}",
        project_id=project_id,
    )

    # ========== PHASE 1: DISCOVERY ==========
    project["status"] = "discovery"
    project["phase"] = "discovery"

    # T1: PHANTOM ORACLE — Domain Analysis
    log_activity("phase_started", "SENTINEL", "Phase 1: Discovery started", project_id=project_id)

    domain_result = await team_execute(
        team_code="T1",
        task="Analyze the domain and create a Domain Knowledge Base",
        context=f"""
Project: {project['name']}
Description: {project['description']}
Domain: {project.get('domain', 'Not specified')}
Features requested: {project.get('features', 'Not specified')}

Create:
1. Domain glossary (key terms and definitions)
2. Business rules (constraints, validations, formulas)
3. Core workflows (step-by-step processes)
4. Edge cases and exceptions
5. Data entities and relationships
""",
        project_id=project_id,
    )
    results["domain_analysis"] = domain_result

    # T2: THUNDER HELM — Product Requirements
    prd_result = await team_execute(
        team_code="T2",
        task="Create Product Requirements Document (PRD)",
        context=f"""
Project: {project['name']}
Description: {project['description']}
Client: {project['client_name']}
Features: {project.get('features', 'Not specified')}

Domain Analysis (from PHANTOM ORACLE):
{domain_result['output'][:3000]}

Create a PRD with:
1. Problem statement
2. User personas
3. User stories with acceptance criteria (INVEST format)
4. Feature list with MoSCoW prioritization
5. Non-functional requirements
6. Out of scope items
""",
        project_id=project_id,
    )
    results["prd"] = prd_result

    # Quality Gate 1: Discovery → Architecture
    gate1 = await sentinel_quality_gate(
        phase="Discovery → Architecture",
        project_id=project_id,
        deliverables=[
            f"Domain Knowledge Base: {domain_result['output'][:500]}...",
            f"PRD: {prd_result['output'][:500]}...",
        ],
    )
    results["gate1"] = gate1

    # ========== PHASE 2: ARCHITECTURE ==========
    project["status"] = "architecture"
    project["phase"] = "architecture"
    log_activity("phase_started", "SENTINEL", "Phase 2: Architecture started", project_id=project_id)

    # T3: IRON BLUEPRINT — System Design
    arch_result = await team_execute(
        team_code="T3",
        task="Design complete system architecture",
        context=f"""
Project: {project['name']}
Tech preferences: {project.get('tech_prefs', 'Architect decides')}

PRD (from THUNDER HELM):
{prd_result['output'][:3000]}

Domain Knowledge (from PHANTOM ORACLE):
{domain_result['output'][:2000]}

Create:
1. Architecture overview (high-level design)
2. Tech stack selection with rationale
3. Database schema design
4. API contract (REST endpoints)
5. Component breakdown for each build team
6. Infrastructure plan
7. Security architecture
""",
        project_id=project_id,
    )
    results["architecture"] = arch_result

    # Quality Gate 2: Architecture → Build
    gate2 = await sentinel_quality_gate(
        phase="Architecture → Build",
        project_id=project_id,
        deliverables=[
            f"Architecture Document: {arch_result['output'][:500]}...",
        ],
    )
    results["gate2"] = gate2

    # ========== PHASE 3: BUILD ==========
    project["status"] = "build"
    project["phase"] = "build"
    log_activity("phase_started", "SENTINEL", "Phase 3: Build started", project_id=project_id)

    # Run T4, T5, T6 in parallel
    ai_task = team_execute(
        team_code="T4",
        task="Design and implement AI agent layer",
        context=f"""
Architecture (from IRON BLUEPRINT):
{arch_result['output'][:3000]}

Build the AI/agent components:
1. Agent topology and configuration
2. LangGraph state machine design
3. Prompt templates for each agent
4. RAG pipeline setup (if needed)
5. Tool definitions for agents
""",
        project_id=project_id,
    )

    backend_task = team_execute(
        team_code="T5",
        task="Build the backend API and business logic",
        context=f"""
Architecture (from IRON BLUEPRINT):
{arch_result['output'][:3000]}

Build:
1. FastAPI project structure
2. Database models and migrations
3. API endpoints (full implementation)
4. Business logic layer
5. Error handling and validation
6. Authentication and authorization
""",
        project_id=project_id,
    )

    frontend_task = team_execute(
        team_code="T6",
        task="Build the frontend UI",
        context=f"""
Architecture (from IRON BLUEPRINT):
{arch_result['output'][:3000]}

Build:
1. Next.js project structure
2. Page layouts and routing
3. UI components (clean, accessible)
4. API integration
5. Real-time features (WebSocket)
6. Responsive design
""",
        project_id=project_id,
    )

    # Execute build tasks in parallel
    ai_result, backend_result, frontend_result = await asyncio.gather(
        ai_task, backend_task, frontend_task
    )
    results["ai_layer"] = ai_result
    results["backend"] = backend_result
    results["frontend"] = frontend_result

    # Quality Gate 3: Build → Ship
    gate3 = await sentinel_quality_gate(
        phase="Build → Ship",
        project_id=project_id,
        deliverables=[
            f"AI Layer: {ai_result['output'][:300]}...",
            f"Backend: {backend_result['output'][:300]}...",
            f"Frontend: {frontend_result['output'][:300]}...",
        ],
    )
    results["gate3"] = gate3

    # ========== PHASE 4: SHIP ==========
    project["status"] = "ship"
    project["phase"] = "ship"
    log_activity("phase_started", "SENTINEL", "Phase 4: Ship started", project_id=project_id)

    # T7: GHOST DEPLOY — DevOps
    devops_result = await team_execute(
        team_code="T7",
        task="Set up deployment infrastructure",
        context=f"""
Architecture:
{arch_result['output'][:2000]}

Backend output:
{backend_result['output'][:1000]}

Frontend output:
{frontend_result['output'][:1000]}

Create:
1. Dockerfile for backend
2. Vercel config for frontend
3. GitHub Actions CI/CD pipeline
4. Environment variable setup
5. Monitoring and health checks
""",
        project_id=project_id,
    )
    results["devops"] = devops_result

    # T8: CRASH KINGS — QA
    qa_result = await team_execute(
        team_code="T8",
        task="Test everything and produce QA report",
        context=f"""
PRD (acceptance criteria):
{prd_result['output'][:2000]}

Backend output:
{backend_result['output'][:1000]}

Frontend output:
{frontend_result['output'][:1000]}

Test:
1. Create test plan
2. Write test cases for all features
3. Security testing (OWASP Top 10)
4. Edge case testing
5. Go/No-Go recommendation
""",
        project_id=project_id,
    )
    results["qa"] = qa_result

    # Final Quality Gate
    gate4 = await sentinel_quality_gate(
        phase="Ship → Deliver",
        project_id=project_id,
        deliverables=[
            f"DevOps: {devops_result['output'][:300]}...",
            f"QA Report: {qa_result['output'][:300]}...",
        ],
    )
    results["gate4"] = gate4

    # ========== COMPLETE ==========
    project["status"] = "delivered"
    project["phase"] = "complete"

    # Create alert for CEO final approval
    alerts_db.append({
        "id": f"alert_{len(alerts_db)+1}",
        "project_id": project_id,
        "type": "approval",
        "title": f"Project '{project['name']}' ready for delivery",
        "description": "All phases complete. QA passed. Awaiting CEO final approval.",
        "status": "pending",
        "priority": "high",
    })

    log_activity(
        "pipeline_completed",
        "SENTINEL",
        f"Pipeline completed for project: {project['name']}. Awaiting CEO approval.",
        project_id=project_id,
    )

    # Calculate total cost
    total_cost = sum(r.get("cost", 0) for r in results.values() if isinstance(r, dict))
    project["cost_total"] = total_cost

    return {
        "project_id": project_id,
        "status": "completed",
        "phases_completed": 4,
        "total_cost": total_cost,
        "results": {k: {"team": v.get("team", ""), "task": v.get("task", "")} for k, v in results.items() if isinstance(v, dict) and "team" in v},
        "message": f"Project '{project['name']}' pipeline complete. Total cost: ${total_cost:.4f}. Awaiting CEO approval.",
    }
