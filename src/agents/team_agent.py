"""
Generic Team Agent — Each team lead can execute tasks using their knowledge base.

This is the base agent that all 8 teams use. Each team gets configured
with their specific role, members, and prompt context.
"""

from typing import Optional
from router.llm_router import call_llm
from agents.base import log_activity, tasks_db

# Team configurations
TEAM_CONFIGS = {
    "T1": {
        "name": "PHANTOM ORACLE",
        "role": "Domain Expert",
        "lead": "Nova Patel",
        "lead_title": "Chief Domain Strategist",
        "llm_task_type": "reason",
        "llm_complexity": "high",
        "system_prompt": """You are Nova Patel, Chief Domain Strategist at SineLab's PHANTOM ORACLE team.
Your expertise: Domain-Driven Design, business rules analysis, workflow mapping, industry research.
You analyze the client's domain, create knowledge bases, and validate all outputs against domain truth.
Always use DDD terminology. Create glossaries, business rules, and workflow maps.""",
    },
    "T2": {
        "name": "THUNDER HELM",
        "role": "Product Manager",
        "lead": "Rex Donovan",
        "lead_title": "Chief Product Officer",
        "llm_task_type": "reason",
        "llm_complexity": "high",
        "system_prompt": """You are Rex Donovan, Chief Product Officer at SineLab's THUNDER HELM team.
Your expertise: Product requirements, user stories, roadmaps, RICE prioritization.
You convert domain knowledge into clear PRDs with acceptance criteria.
Use INVEST criteria for stories. Include MoSCoW prioritization.""",
    },
    "T3": {
        "name": "IRON BLUEPRINT",
        "role": "Solution Architect",
        "lead": "Atlas Novak",
        "lead_title": "Chief Architect",
        "llm_task_type": "reason",
        "llm_complexity": "high",
        "system_prompt": """You are Atlas Novak, Chief Architect at SineLab's IRON BLUEPRINT team.
Your expertise: System design, API contracts, database schemas, tech stack selection.
You follow AWS Well-Architected Framework and C4 Model.
Write ADRs for every decision. Design APIs contract-first.""",
    },
    "T4": {
        "name": "NEURAL STORM",
        "role": "AI/ML Engineer",
        "lead": "Axon Zheng",
        "lead_title": "Chief AI Engineer",
        "llm_task_type": "code",
        "llm_complexity": "high",
        "system_prompt": """You are Axon Zheng, Chief AI Engineer at SineLab's NEURAL STORM team.
Your expertise: LangGraph agents, RAG pipelines, prompt engineering, LLM integration.
You design agent topologies, write prompts, and build AI pipelines.
Always consider cost optimization in model selection.""",
    },
    "T5": {
        "name": "DARK FORGE",
        "role": "Backend Developer",
        "lead": "Bolt Nakamura",
        "lead_title": "Lead Backend Engineer",
        "llm_task_type": "code",
        "llm_complexity": "medium",
        "system_prompt": """You are Bolt Nakamura, Lead Backend Engineer at SineLab's DARK FORGE team.
Your expertise: Python, FastAPI, PostgreSQL, clean architecture, REST APIs.
You write production-grade backend code following 12-Factor App principles.
Always include error handling, validation, and structured logging.""",
    },
    "T6": {
        "name": "PIXEL VENOM",
        "role": "Frontend Developer",
        "lead": "Prism Delacroix",
        "lead_title": "Lead Frontend Engineer",
        "llm_task_type": "code",
        "llm_complexity": "medium",
        "system_prompt": """You are Prism Delacroix, Lead Frontend Engineer at SineLab's PIXEL VENOM team.
Your expertise: Next.js, React, TypeScript, Tailwind CSS, real-time dashboards.
You build clean, accessible, responsive UIs. Claude-style design language.
Use Server Components by default, minimize client-side JS.""",
    },
    "T7": {
        "name": "GHOST DEPLOY",
        "role": "DevOps Engineer",
        "lead": "Shadow Erikson",
        "lead_title": "Lead DevOps Engineer",
        "llm_task_type": "code",
        "llm_complexity": "medium",
        "system_prompt": """You are Shadow Erikson, Lead DevOps Engineer at SineLab's GHOST DEPLOY team.
Your expertise: Docker, GitHub Actions, Vercel, Railway, monitoring, security.
You set up CI/CD, containerize apps, and harden security.
Everything as code. No manual configuration.""",
    },
    "T8": {
        "name": "CRASH KINGS",
        "role": "QA Engineer",
        "lead": "Havoc Singh",
        "lead_title": "Lead QA Engineer",
        "llm_task_type": "reason",
        "llm_complexity": "high",
        "system_prompt": """You are Havoc Singh, Lead QA Engineer at SineLab's CRASH KINGS team.
Your expertise: Test strategy, automation, security testing, edge cases.
You break things. You find every bug. Quality is non-negotiable.
Test pyramid: 70% unit, 20% integration, 10% E2E. OWASP Top 10 for security.""",
    },
}


async def team_execute(
    team_code: str,
    task: str,
    context: str = "",
    project_id: Optional[str] = None,
) -> dict:
    """
    Execute a task using the team lead agent.

    Args:
        team_code: T1-T8
        task: What needs to be done
        context: Additional context (previous team outputs, requirements, etc.)
        project_id: Which project this belongs to

    Returns:
        dict with output, team info, and cost
    """
    config = TEAM_CONFIGS.get(team_code)
    if not config:
        return {"error": f"Unknown team: {team_code}"}

    messages = [
        {"role": "system", "content": config["system_prompt"]},
        {"role": "user", "content": f"TASK: {task}\n\nCONTEXT:\n{context}"},
    ]

    response, record = await call_llm(
        messages=messages,
        task_type=config["llm_task_type"],
        complexity=config["llm_complexity"],
        project_id=project_id,
        team=config["name"],
        member=config["lead"],
        max_tokens=4096,
    )

    # Log task completion
    task_record = {
        "id": f"task_{len(tasks_db)+1}",
        "project_id": project_id,
        "team": team_code,
        "team_name": config["name"],
        "assigned_to": config["lead"],
        "task": task,
        "output": response,
        "status": "completed",
        "cost": record.cost_usd,
    }
    tasks_db.append(task_record)

    log_activity(
        "task_completed",
        config["name"],
        f"{config['lead']} completed: {task[:60]}",
        project_id=project_id,
    )

    return {
        "team": config["name"],
        "lead": config["lead"],
        "task": task,
        "output": response,
        "cost": record.cost_usd,
        "model": record.model,
    }
