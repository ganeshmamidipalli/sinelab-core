# LLM Router — Dynamic Model Selection

## Purpose

The LLM Router is the brain that decides which LLM handles each task. Goal: **best quality at lowest cost**. Every token spent must earn its place.

---

## Available Models

### Tier 1 — Premium (Use for high-stakes tasks)

| Model | Provider | Input Cost | Output Cost | Strengths |
|-------|----------|-----------|-------------|-----------|
| Claude Sonnet 4 | Anthropic | $3.00/M | $15.00/M | Best reasoning, architecture, nuanced analysis |
| Claude Opus 4.6 | Anthropic | $15.00/M | $75.00/M | Most capable, reserved for the most critical tasks only |

### Tier 2 — Workhorse (Default for most tasks)

| Model | Provider | Input Cost | Output Cost | Strengths |
|-------|----------|-----------|-------------|-----------|
| DeepSeek V3 | DeepSeek | $0.27/M | $1.10/M | Excellent coding, near-Sonnet quality at 10x cheaper |
| Qwen 2.5 Coder 32B | Alibaba | $0.30/M | $0.60/M | Strong code generation and review |

### Tier 3 — Fast & Cheap (Use for simple/routine tasks)

| Model | Provider | Input Cost | Output Cost | Strengths |
|-------|----------|-----------|-------------|-----------|
| GPT-4o-mini | OpenAI | $0.15/M | $0.60/M | Fast, cheap, good for summaries and routing |
| Claude Haiku 4.5 | Anthropic | $0.80/M | $4.00/M | Fast validation, simple generation |

---

## Routing Logic

Every task is classified on two dimensions:

### Task Complexity
| Level | Definition | Example |
|-------|-----------|---------|
| **Low** | Template, summary, format conversion | "Summarize this meeting" |
| **Medium** | Standard coding, writing, analysis | "Build a REST endpoint" |
| **High** | Architecture, complex reasoning, critical decisions | "Design the auth system" |
| **Critical** | Client-facing, security-sensitive, irreversible | "Final delivery review" |

### Task Type
| Type | Definition |
|------|-----------|
| **code** | Writing, reviewing, or debugging code |
| **reason** | Analysis, architecture, decision-making |
| **chat** | Client communication, summaries, reports |
| **validate** | Checking work, running quality gates |
| **route** | Classifying tasks, making routing decisions |

### Routing Matrix

| Complexity \ Type | code | reason | chat | validate | route |
|------------------:|:----:|:------:|:----:|:--------:|:-----:|
| **Low**           | Qwen 2.5 | GPT-4o-mini | GPT-4o-mini | Claude Haiku | GPT-4o-mini |
| **Medium**        | DeepSeek V3 | DeepSeek V3 | GPT-4o-mini | Claude Haiku | GPT-4o-mini |
| **High**          | DeepSeek V3 | Claude Sonnet | Claude Sonnet | Claude Sonnet | Claude Sonnet |
| **Critical**      | Claude Sonnet | Claude Sonnet | Claude Sonnet | Claude Sonnet | Claude Sonnet |

---

## Fallback Chain

If a model is unavailable (rate limited, down, error):

```
Claude Sonnet → DeepSeek V3 → GPT-4o-mini → Qwen 2.5 → Claude Haiku
```

For coding tasks:
```
DeepSeek V3 → Qwen 2.5 → Claude Sonnet → GPT-4o-mini
```

---

## Cost Tracking

Every LLM call is logged:

```json
{
  "id": "call_abc123",
  "project_id": "proj_xyz",
  "team": "DARK FORGE",
  "member": "Bolt Nakamura",
  "task_type": "code",
  "complexity": "medium",
  "model_used": "deepseek-v3",
  "input_tokens": 2450,
  "output_tokens": 1830,
  "cost_usd": 0.00268,
  "latency_ms": 3200,
  "timestamp": "2026-03-26T10:30:00Z"
}
```

### Cost Aggregation
- Per call
- Per task
- Per team member
- Per team
- Per project
- Per day/week/month
- Per LLM model

SENTINEL uses these to generate cost reports for CEO.

---

## Budget Controls

| Control | Behavior |
|---------|----------|
| **Per-task limit** | If estimated cost exceeds $0.50, use a cheaper model |
| **Per-project daily limit** | Default $10/day. SENTINEL alerts CEO at 80% |
| **Per-project total limit** | Set by CEO at project creation. Hard stop at limit |
| **Model upgrade approval** | Using Opus requires SENTINEL approval |

---

## Quality Feedback Loop

If a task output is rejected by SENTINEL or QA:

1. Log which model produced the rejected output
2. If the model consistently fails at this task type, upgrade the routing rule
3. If a cheaper model consistently passes, downgrade the routing rule
4. Router learns over time which model works best for which team/task combination

---

## Implementation

Built using **LiteLLM** Python library:

```python
# Simplified router pseudocode
import litellm

ROUTING_TABLE = {
    ("code", "low"): "qwen/qwen2.5-coder-32b",
    ("code", "medium"): "deepseek/deepseek-chat",
    ("code", "high"): "deepseek/deepseek-chat",
    ("code", "critical"): "anthropic/claude-sonnet-4-20250514",
    ("reason", "low"): "openai/gpt-4o-mini",
    ("reason", "medium"): "deepseek/deepseek-chat",
    ("reason", "high"): "anthropic/claude-sonnet-4-20250514",
    ("reason", "critical"): "anthropic/claude-sonnet-4-20250514",
    # ... etc
}

def route(task_type: str, complexity: str, prompt: str) -> str:
    model = ROUTING_TABLE.get((task_type, complexity))
    response = litellm.completion(model=model, messages=[{"role":"user","content":prompt}])
    log_usage(response)  # track cost
    return response.choices[0].message.content
```

---

## API Keys Required

| Provider | Key Name | Where to Get |
|----------|----------|-------------|
| Anthropic | `ANTHROPIC_API_KEY` | console.anthropic.com |
| OpenAI | `OPENAI_API_KEY` | platform.openai.com |
| DeepSeek | `DEEPSEEK_API_KEY` | platform.deepseek.com |
| Alibaba/Qwen | `DASHSCOPE_API_KEY` | dashscope.aliyun.com |

All keys stored in environment variables, never in code.
