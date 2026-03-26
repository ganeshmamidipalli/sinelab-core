"""
SineLab Core API — The agentic backend.

All endpoints for CEO dashboard, client portal, agent orchestration,
cost tracking, and project management.
"""

import asyncio
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

from config.settings import settings
from agents.base import (
    projects_db, activity_log, conversations_db, tasks_db, alerts_db,
    create_project, log_activity, store_conversation_message,
)
from agents.sentinel.agent import sentinel_chat, sentinel_generate_report
from agents.receptionist.agent import receptionist_chat
from agents.team_agent import team_execute
from agents.orchestrator import run_project_pipeline
from router.llm_router import get_cost_summary, call_log


app = FastAPI(
    title="SineLab Core API",
    description="Agentic framework for building enterprise applications",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============ HEALTH ============

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "service": "sinelab-core",
        "teams": 9,
        "members": 26,
        "active_projects": len([p for p in projects_db.values() if p["status"] not in ("delivered", "paused")]),
    }


# ============ PROJECTS ============

class ProjectCreate(BaseModel):
    name: str
    description: str
    client_name: str
    domain: str = ""
    features: str = ""
    tech_prefs: str = ""


@app.post("/api/projects")
async def api_create_project(body: ProjectCreate):
    project = create_project(
        name=body.name,
        description=body.description,
        client_name=body.client_name,
        domain=body.domain,
        features=body.features,
        tech_prefs=body.tech_prefs,
    )
    return {"data": project}


@app.get("/api/projects")
async def api_list_projects():
    return {"data": list(projects_db.values()), "total": len(projects_db)}


@app.get("/api/projects/{project_id}")
async def api_get_project(project_id: str):
    project = projects_db.get(project_id)
    if not project:
        raise HTTPException(404, "Project not found")
    return {"data": project}


@app.post("/api/projects/{project_id}/approve")
async def api_approve_project(project_id: str, background_tasks: BackgroundTasks):
    """CEO approves a project — triggers the full automated pipeline."""
    project = projects_db.get(project_id)
    if not project:
        raise HTTPException(404, "Project not found")

    project["status"] = "discovery"
    log_activity("project_approved", "CEO", f"CEO approved project: {project['name']}", project_id=project_id)

    # Run the full pipeline in the background
    background_tasks.add_task(run_project_pipeline, project_id)

    return {
        "status": "approved",
        "message": f"Project '{project['name']}' approved. Pipeline starting automatically.",
        "project": project,
    }


@app.post("/api/projects/{project_id}/pause")
async def api_pause_project(project_id: str):
    project = projects_db.get(project_id)
    if not project:
        raise HTTPException(404, "Project not found")
    project["status"] = "paused"
    log_activity("project_paused", "CEO", f"CEO paused project: {project['name']}", project_id=project_id)
    return {"status": "paused", "project": project}


# ============ SENTINEL ============

class ChatMessage(BaseModel):
    message: str
    project_id: Optional[str] = None


@app.post("/api/sentinel/chat")
async def api_sentinel_chat(body: ChatMessage):
    """CEO chats with SENTINEL."""
    response = await sentinel_chat(body.message, body.project_id)
    return {"response": response, "sender": "SENTINEL"}


@app.get("/api/sentinel/report")
async def api_sentinel_report():
    """Generate on-demand report."""
    report = await sentinel_generate_report()
    return {"report": report}


@app.get("/api/sentinel/alerts")
async def api_sentinel_alerts():
    pending = [a for a in alerts_db if a["status"] == "pending"]
    return {"data": pending, "total": len(pending)}


@app.post("/api/sentinel/alerts/{alert_id}/resolve")
async def api_resolve_alert(alert_id: str):
    for alert in alerts_db:
        if alert["id"] == alert_id:
            alert["status"] = "resolved"
            return {"status": "resolved"}
    raise HTTPException(404, "Alert not found")


# ============ CLIENT CHAT ============

class ClientChatMessage(BaseModel):
    message: str
    project_id: Optional[str] = None
    client_name: str = "Client"


@app.post("/api/chat")
async def api_client_chat(body: ClientChatMessage):
    """Client chats with the AI team (receptionist + domain expert)."""
    result = await receptionist_chat(
        client_message=body.message,
        project_id=body.project_id,
        client_name=body.client_name,
    )
    return result


@app.get("/api/chat/{project_id}/history")
async def api_chat_history(project_id: str):
    """Get full conversation history for a project."""
    messages = conversations_db.get(project_id, [])
    return {"data": messages, "total": len(messages)}


# ============ TEAMS ============

@app.post("/api/teams/{team_code}/execute")
async def api_team_execute(team_code: str, body: ChatMessage):
    """Execute a task using a team agent."""
    result = await team_execute(
        team_code=team_code,
        task=body.message,
        project_id=body.project_id,
    )
    return result


# ============ ACTIVITY ============

@app.get("/api/activity")
async def api_activity(project_id: Optional[str] = None, limit: int = 50):
    entries = activity_log
    if project_id:
        entries = [a for a in entries if a.get("project_id") == project_id]
    return {"data": entries[-limit:][::-1], "total": len(entries)}


# ============ COSTS ============

@app.get("/api/costs")
async def api_costs():
    return get_cost_summary()


@app.get("/api/costs/calls")
async def api_cost_calls(limit: int = 50):
    recent = call_log[-limit:][::-1]
    return {
        "data": [
            {
                "id": c.id,
                "model": c.model,
                "team": c.team,
                "member": c.member,
                "task_type": c.task_type,
                "input_tokens": c.input_tokens,
                "output_tokens": c.output_tokens,
                "cost_usd": c.cost_usd,
                "latency_ms": c.latency_ms,
                "timestamp": c.timestamp,
            }
            for c in recent
        ],
        "total": len(call_log),
    }


# ============ TASKS ============

@app.get("/api/tasks")
async def api_tasks(project_id: Optional[str] = None):
    tasks = tasks_db
    if project_id:
        tasks = [t for t in tasks if t.get("project_id") == project_id]
    return {"data": tasks, "total": len(tasks)}
