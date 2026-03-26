"""
SineLab LLM Router — Dynamic model selection for cost optimization.

Routes tasks to the cheapest LLM that meets quality requirements.
Tracks cost per call for reporting.
"""

import time
import uuid
from typing import Optional
from dataclasses import dataclass, field
from datetime import datetime, timezone

import litellm
from config.settings import settings

# Suppress litellm debug logs
litellm.set_verbose = False

# Configure API keys
litellm.api_key = settings.ANTHROPIC_API_KEY
if settings.OPENAI_API_KEY:
    litellm.openai_key = settings.OPENAI_API_KEY


# ============ ROUTING TABLE ============

ROUTING_TABLE = {
    # (task_type, complexity) -> model
    ("code", "low"): "openai/gpt-4o-mini",
    ("code", "medium"): "deepseek/deepseek-chat",
    ("code", "high"): "deepseek/deepseek-chat",
    ("code", "critical"): "anthropic/claude-sonnet-4-20250514",

    ("reason", "low"): "openai/gpt-4o-mini",
    ("reason", "medium"): "openai/gpt-4o-mini",
    ("reason", "high"): "anthropic/claude-sonnet-4-20250514",
    ("reason", "critical"): "anthropic/claude-sonnet-4-20250514",

    ("chat", "low"): "openai/gpt-4o-mini",
    ("chat", "medium"): "openai/gpt-4o-mini",
    ("chat", "high"): "anthropic/claude-sonnet-4-20250514",
    ("chat", "critical"): "anthropic/claude-sonnet-4-20250514",

    ("validate", "low"): "openai/gpt-4o-mini",
    ("validate", "medium"): "openai/gpt-4o-mini",
    ("validate", "high"): "anthropic/claude-sonnet-4-20250514",
    ("validate", "critical"): "anthropic/claude-sonnet-4-20250514",

    ("route", "low"): "openai/gpt-4o-mini",
    ("route", "medium"): "openai/gpt-4o-mini",
    ("route", "high"): "openai/gpt-4o-mini",
    ("route", "critical"): "anthropic/claude-sonnet-4-20250514",
}

# Fallback chain
FALLBACK_CHAIN = [
    "anthropic/claude-sonnet-4-20250514",
    "openai/gpt-4o-mini",
    "deepseek/deepseek-chat",
]

# Cost per 1M tokens (approximate)
MODEL_COSTS = {
    "anthropic/claude-sonnet-4-20250514": {"input": 3.0, "output": 15.0},
    "openai/gpt-4o-mini": {"input": 0.15, "output": 0.60},
    "deepseek/deepseek-chat": {"input": 0.27, "output": 1.10},
}


@dataclass
class LLMCall:
    """Record of a single LLM call for tracking."""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    project_id: Optional[str] = None
    team: Optional[str] = None
    member: Optional[str] = None
    task_type: str = "reason"
    complexity: str = "medium"
    model: str = ""
    input_tokens: int = 0
    output_tokens: int = 0
    cost_usd: float = 0.0
    latency_ms: int = 0
    timestamp: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    success: bool = True
    error: Optional[str] = None


# In-memory cost tracker (will be persisted to Supabase later)
call_log: list[LLMCall] = []


def get_model(task_type: str = "reason", complexity: str = "medium") -> str:
    """Select the best model for the given task type and complexity."""
    return ROUTING_TABLE.get((task_type, complexity), settings.DEFAULT_LLM)


def calculate_cost(model: str, input_tokens: int, output_tokens: int) -> float:
    """Calculate cost in USD for a given call."""
    costs = MODEL_COSTS.get(model, {"input": 3.0, "output": 15.0})
    return (input_tokens * costs["input"] + output_tokens * costs["output"]) / 1_000_000


async def call_llm(
    messages: list[dict],
    task_type: str = "reason",
    complexity: str = "medium",
    model_override: Optional[str] = None,
    max_tokens: int = 2048,
    temperature: float = 0.7,
    project_id: Optional[str] = None,
    team: Optional[str] = None,
    member: Optional[str] = None,
) -> tuple[str, LLMCall]:
    """
    Call an LLM with automatic model routing and cost tracking.

    Returns:
        tuple of (response_text, call_record)
    """
    model = model_override or get_model(task_type, complexity)
    record = LLMCall(
        project_id=project_id,
        team=team,
        member=member,
        task_type=task_type,
        complexity=complexity,
        model=model,
    )

    start = time.time()

    # Try primary model, then fallback chain
    models_to_try = [model] + [m for m in FALLBACK_CHAIN if m != model]

    for attempt_model in models_to_try:
        try:
            response = await litellm.acompletion(
                model=attempt_model,
                messages=messages,
                max_tokens=max_tokens,
                temperature=temperature,
            )

            record.model = attempt_model
            record.input_tokens = response.usage.prompt_tokens
            record.output_tokens = response.usage.completion_tokens
            record.cost_usd = calculate_cost(
                attempt_model, record.input_tokens, record.output_tokens
            )
            record.latency_ms = int((time.time() - start) * 1000)
            record.success = True

            call_log.append(record)

            return response.choices[0].message.content, record

        except Exception as e:
            record.error = str(e)
            continue

    # All models failed
    record.success = False
    record.latency_ms = int((time.time() - start) * 1000)
    call_log.append(record)
    raise Exception(f"All LLM models failed. Last error: {record.error}")


def get_cost_summary() -> dict:
    """Get cost summary from call log."""
    today = datetime.now(timezone.utc).date().isoformat()

    total = sum(c.cost_usd for c in call_log)
    today_cost = sum(c.cost_usd for c in call_log if c.timestamp.startswith(today))

    by_model = {}
    by_team = {}
    by_project = {}

    for c in call_log:
        by_model[c.model] = by_model.get(c.model, 0) + c.cost_usd
        if c.team:
            by_team[c.team] = by_team.get(c.team, 0) + c.cost_usd
        if c.project_id:
            by_project[c.project_id] = by_project.get(c.project_id, 0) + c.cost_usd

    return {
        "total": round(total, 4),
        "today": round(today_cost, 4),
        "calls": len(call_log),
        "by_model": {k: round(v, 4) for k, v in by_model.items()},
        "by_team": {k: round(v, 4) for k, v in by_team.items()},
        "by_project": {k: round(v, 4) for k, v in by_project.items()},
    }
