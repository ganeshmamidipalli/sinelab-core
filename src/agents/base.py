"""
Base state and shared data structures for all agents.
"""

from typing import TypedDict, Optional
from datetime import datetime, timezone


class AgentState(TypedDict, total=False):
    task: str
    context: dict
    project_id: str
    team: str
    member: str
    outputs: list
    errors: list
    status: str  # 'working' | 'blocked' | 'complete'


# In-memory stores (will be replaced with Supabase)
projects_db: dict[str, dict] = {}
activity_log: list[dict] = []
conversations_db: dict[str, list[dict]] = {}  # project_id -> messages
tasks_db: list[dict] = []
alerts_db: list[dict] = []


def log_activity(
    activity_type: str,
    from_team: str,
    message: str,
    to_team: Optional[str] = None,
    project_id: Optional[str] = None,
    metadata: Optional[dict] = None,
):
    """Log an activity entry."""
    entry = {
        "id": f"act_{len(activity_log)+1}",
        "type": activity_type,
        "from": from_team,
        "to": to_team,
        "message": message,
        "project_id": project_id,
        "metadata": metadata or {},
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    activity_log.append(entry)
    return entry


def create_project(
    name: str,
    description: str,
    client_name: str,
    domain: str = "",
    features: str = "",
    tech_prefs: str = "",
) -> dict:
    """Create a new project."""
    import uuid
    project_id = str(uuid.uuid4())[:8]
    slug = name.lower().replace(" ", "-").replace("_", "-")

    project = {
        "id": project_id,
        "name": name,
        "slug": slug,
        "client_name": client_name,
        "description": description,
        "domain": domain,
        "features": features,
        "tech_prefs": tech_prefs,
        "status": "intake",
        "phase": "discovery",
        "health_score": 100,
        "cost_total": 0.0,
        "github_repo": f"ganeshmamidipalli/{slug}",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }

    projects_db[project_id] = project
    conversations_db[project_id] = []

    log_activity(
        "project_created",
        "SYSTEM",
        f"Project '{name}' created for client '{client_name}'",
        project_id=project_id,
    )

    return project


def store_conversation_message(
    project_id: str,
    sender_type: str,  # 'client' | 'agent' | 'ceo'
    sender_name: str,
    content: str,
    sender_role: Optional[str] = None,
) -> dict:
    """Store a chat message under a project — all conversations recorded."""
    message = {
        "id": f"msg_{len(conversations_db.get(project_id, []))+1}",
        "project_id": project_id,
        "sender_type": sender_type,
        "sender_name": sender_name,
        "sender_role": sender_role,
        "content": content,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }

    if project_id not in conversations_db:
        conversations_db[project_id] = []
    conversations_db[project_id].append(message)

    return message
