"""
SENTINEL — Chief of Staff Agent

The CEO's direct agent. Manages all teams, generates reports,
runs quality gates, tracks costs, and relays commands.
"""

from typing import Optional
from router.llm_router import call_llm, get_cost_summary
from agents.base import AgentState, activity_log, projects_db

SENTINEL_SYSTEM_PROMPT = """You are SENTINEL, the Chief of Staff at SineLab — an AI-powered software consulting firm.

You report DIRECTLY to the CEO (Ganesh Mamidipalli). You are his eyes, ears, and voice across all operations.

YOUR RESPONSIBILITIES:
1. Monitor all 8 teams and their work
2. Generate clear, concise reports
3. Run quality gates at every phase transition
4. Track costs and budgets
5. Relay CEO directives to team leads
6. Escalate only critical decisions to CEO
7. Maintain audit trail of all actions

YOUR TEAMS:
- T1 PHANTOM ORACLE (Domain Expert) — Nova Patel, Orion Reeves, Lyra Chen
- T2 THUNDER HELM (Product Manager) — Rex Donovan, Sage Kimura
- T3 IRON BLUEPRINT (Solution Architect) — Atlas Novak, Cipher Okonkwo, Helix Vargas
- T4 NEURAL STORM (AI/ML Engineer) — Axon Zheng, Synapse Frost, Vector Osei, Tensor Ivanovic
- T5 DARK FORGE (Backend Developer) — Bolt Nakamura, Flux Andersen, Rune Mbeki, Forge Castillo
- T6 PIXEL VENOM (Frontend Developer) — Prism Delacroix, Neon Takahashi, Glitch Kowalski
- T7 GHOST DEPLOY (DevOps Engineer) — Shadow Erikson, Pipeline Moreau, Vault Njoku
- T8 CRASH KINGS (QA Engineer) — Havoc Singh, Glare Petrov, Breach Oliveira

COMMUNICATION STYLE:
- Be direct, concise, professional
- Lead with the answer, then details
- Use bullet points for status updates
- Never use filler words
- Format reports cleanly
- Always include actionable next steps

CURRENT STATE:
{state_context}
"""


async def sentinel_chat(
    user_message: str,
    project_id: Optional[str] = None,
) -> str:
    """Process a CEO message and return SENTINEL's response."""

    # Build state context
    costs = get_cost_summary()
    active_projects = [p for p in projects_db.values() if p["status"] not in ("delivered", "paused")]

    state_context = f"""
Active Projects: {len(active_projects)}
Total LLM Spend: ${costs['total']:.2f}
Today's Spend: ${costs['today']:.2f}
Total LLM Calls: {costs['calls']}
Recent Activity: {len(activity_log)} entries
"""

    if active_projects:
        state_context += "\nProjects:\n"
        for p in active_projects:
            state_context += f"  - {p['name']} (Status: {p['status']}, Client: {p.get('client_name', 'Unknown')})\n"

    system_prompt = SENTINEL_SYSTEM_PROMPT.format(state_context=state_context)

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_message},
    ]

    response, record = await call_llm(
        messages=messages,
        task_type="reason",
        complexity="high",
        project_id=project_id,
        team="SENTINEL",
        member="SENTINEL",
    )

    # Log activity
    activity_log.append({
        "type": "sentinel_response",
        "from": "SENTINEL",
        "to": "CEO",
        "message": f"Responded to CEO: {user_message[:80]}...",
        "cost": record.cost_usd,
    })

    return response


async def sentinel_generate_report(project_id: Optional[str] = None) -> str:
    """Generate a status report for the CEO."""
    costs = get_cost_summary()

    prompt = f"""Generate a concise status report for the CEO.

Current data:
- Active projects: {len(projects_db)}
- Total LLM spend: ${costs['total']:.2f}
- Today's spend: ${costs['today']:.2f}
- Total API calls: {costs['calls']}
- Cost by model: {costs['by_model']}
- Cost by team: {costs['by_team']}
- Recent activity entries: {len(activity_log)}

Format as a clean daily report with sections:
STATUS, PROGRESS, COSTS, NEEDS ATTENTION
Keep it under 200 words."""

    response, _ = await call_llm(
        messages=[
            {"role": "system", "content": "You are SENTINEL, generating a CEO report. Be concise and data-driven."},
            {"role": "user", "content": prompt},
        ],
        task_type="chat",
        complexity="medium",
        team="SENTINEL",
    )

    return response


async def sentinel_assign_task(
    team_code: str,
    task: str,
    priority: str = "medium",
    project_id: Optional[str] = None,
) -> dict:
    """Assign a task to a team via SENTINEL."""
    activity_log.append({
        "type": "task_assignment",
        "from": "SENTINEL",
        "to": team_code,
        "message": f"Task assigned ({priority}): {task}",
        "project_id": project_id,
    })

    return {
        "status": "assigned",
        "team": team_code,
        "task": task,
        "priority": priority,
        "project_id": project_id,
    }


async def sentinel_quality_gate(
    phase: str,
    project_id: str,
    deliverables: list[str],
) -> dict:
    """Run a quality gate check for a phase transition."""
    prompt = f"""Review these deliverables for Phase Gate: {phase}

Deliverables submitted:
{chr(10).join(f'- {d}' for d in deliverables)}

Check against the gate criteria and return:
1. PASS or FAIL
2. List of items that passed
3. List of items that failed (with reason)
4. Recommendation"""

    response, record = await call_llm(
        messages=[
            {"role": "system", "content": "You are SENTINEL running a quality gate review. Be strict and thorough."},
            {"role": "user", "content": prompt},
        ],
        task_type="validate",
        complexity="high",
        project_id=project_id,
        team="SENTINEL",
    )

    activity_log.append({
        "type": "quality_gate",
        "from": "SENTINEL",
        "message": f"Quality gate for {phase}: completed",
        "project_id": project_id,
    })

    return {
        "phase": phase,
        "review": response,
        "cost": record.cost_usd,
    }
