# NEURAL STORM — AI/ML Engineer Knowledge Base

## How the Best AI Engineers Build Production Agents

Source: Practices from Anthropic, OpenAI, LangChain/LangGraph, Hugging Face, and production AI systems at scale.

---

## 1. Agent Design Patterns (from Anthropic & LangGraph)

### ReAct Pattern (Reasoning + Acting)
```
The agent loop:
  1. OBSERVE: Read the current state/input
  2. THINK: Reason about what to do next
  3. ACT: Call a tool or generate output
  4. OBSERVE: See the result
  5. Repeat until task complete

Best for: General-purpose agents, research, multi-step tasks
```

### Plan-and-Execute Pattern
```
  1. PLAN: Break task into sub-tasks
  2. EXECUTE: Run each sub-task sequentially
  3. REPLAN: If a sub-task fails, adjust the plan
  4. COMPLETE: Aggregate results

Best for: Complex tasks with clear sub-steps
```

### Multi-Agent Supervisor Pattern
```
  SUPERVISOR receives task
    → Routes to SPECIALIST AGENT A, B, or C
    → Specialist completes sub-task
    → Returns result to SUPERVISOR
    → SUPERVISOR decides next step or completion

Best for: SineLab's team structure (SENTINEL = supervisor)
```

### Tool-Use Pattern
```
  Agent has access to tools (functions it can call):
    - search_web(query)
    - read_file(path)
    - write_code(spec)
    - run_tests(path)
    - query_database(sql)

  Agent decides WHEN and WHICH tool to use based on the task.
  Tools are defined as structured function schemas.
```

## 2. LangGraph State Machine Design

```python
# Production LangGraph pattern

from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated

class AgentState(TypedDict):
    messages: list          # conversation history
    task: str               # current task description
    plan: list              # planned steps
    current_step: int       # which step we're on
    outputs: dict           # collected outputs
    errors: list            # any errors encountered
    status: str             # 'working' | 'blocked' | 'complete'

graph = StateGraph(AgentState)

# Nodes (each is a function)
graph.add_node("analyze", analyze_task)      # Understand the task
graph.add_node("plan", create_plan)          # Break into steps
graph.add_node("execute", execute_step)      # Do current step
graph.add_node("review", review_output)      # Check quality
graph.add_node("report", generate_report)    # Final output

# Edges (control flow)
graph.set_entry_point("analyze")
graph.add_edge("analyze", "plan")
graph.add_edge("plan", "execute")
graph.add_conditional_edges("execute", check_result, {
    "success": "review",
    "error": "plan",       # replan on error
})
graph.add_conditional_edges("review", check_quality, {
    "pass": "report",
    "fail": "execute",     # redo on quality fail
})
graph.add_edge("report", END)

app = graph.compile()
```

## 3. Prompt Engineering (Production Standards)

### System Prompt Structure
```
ROLE: Who is this agent? What's their expertise?
CONTEXT: What project are they working on? What phase?
TASK: What specifically must they do right now?
CONSTRAINTS: Rules, limitations, quality standards
OUTPUT FORMAT: Exact structure of expected output
EXAMPLES: 2-3 examples of good output (few-shot)
```

### Prompt Best Practices
```
DO:
  ✓ Be specific and unambiguous
  ✓ Use structured output formats (JSON, markdown)
  ✓ Include examples of desired output
  ✓ Set explicit constraints (max length, format, style)
  ✓ Break complex tasks into steps
  ✓ Include error handling instructions

DON'T:
  ✗ Use vague instructions ("make it good")
  ✗ Leave output format undefined
  ✗ Overload with too many instructions at once
  ✗ Assume the model knows project context
  ✗ Skip edge case instructions
```

### Prompt Template Library
```
CODE_GENERATION:
  "Write {language} code that {requirement}.
   Follow these rules:
   - {constraint_1}
   - {constraint_2}
   Include error handling for: {edge_cases}
   Output only the code, no explanations."

CODE_REVIEW:
  "Review this {language} code for:
   1. Bugs and logic errors
   2. Security vulnerabilities
   3. Performance issues
   4. Code style violations
   For each issue found, provide:
   - Line number
   - Issue description
   - Severity (critical/high/medium/low)
   - Fix suggestion"

ARCHITECTURE_DESIGN:
  "Design a {component} that:
   Requirements: {requirements}
   Constraints: {constraints}
   Output:
   1. High-level design (2-3 sentences)
   2. Component breakdown
   3. Data flow
   4. Key decisions and trade-offs"
```

## 4. RAG (Retrieval-Augmented Generation) — Production Setup

### Chunking Strategy
```
DOCUMENT CHUNKING RULES:
  - Chunk size: 500-1000 tokens (sweet spot)
  - Overlap: 100-200 tokens (prevent losing context at boundaries)
  - Respect boundaries: Don't split mid-sentence or mid-code-block
  - Add metadata to each chunk: source, page, section, date

CHUNKING BY DOCUMENT TYPE:
  Code files  → Split by function/class
  Markdown    → Split by heading (##, ###)
  PDFs        → Split by page + paragraph
  API docs    → Split by endpoint
  Chat logs   → Split by conversation turn
```

### Embedding Model Selection
```
| Model | Dimensions | Quality | Cost |
|-------|-----------|---------|------|
| text-embedding-3-small (OpenAI) | 1536 | Good | $0.02/M tokens |
| text-embedding-3-large (OpenAI) | 3072 | Better | $0.13/M tokens |
| BGE-M3 (open source) | 1024 | Good | Free (self-hosted) |
| Cohere embed-v3 | 1024 | Good | $0.10/M tokens |
```

### Vector Store Selection
```
| Store | Hosted | Free Tier | Best For |
|-------|--------|-----------|----------|
| pgvector (Supabase) | Yes | Yes | Small-medium, already using Supabase |
| Pinecone | Yes | 100K vectors | Large scale, managed |
| ChromaDB | Self | Unlimited | Local development, prototyping |
| Qdrant | Both | Yes | High performance, filtering |
```

### RAG Pipeline
```
INDEXING (offline):
  Document → Chunk → Embed → Store in vector DB

RETRIEVAL (online):
  Query → Embed → Search vector DB → Top-K results → Rerank → Return

GENERATION:
  System prompt + Retrieved context + User query → LLM → Response

QUALITY CONTROLS:
  - Relevance threshold: only use chunks with similarity > 0.7
  - Maximum context: don't stuff more than 5-8 chunks
  - Source citation: always reference which document/chunk
  - Fallback: if no relevant chunks found, say "I don't have information on that"
```

## 5. Tool Definition Standard (for function calling)

```python
# Every tool must follow this structure:

TOOL_SCHEMA = {
    "name": "search_documentation",
    "description": "Search the project documentation for relevant information. Use this when you need to find specific requirements, rules, or technical specs.",
    "parameters": {
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "The search query — be specific"
            },
            "doc_type": {
                "type": "string",
                "enum": ["prd", "architecture", "api_spec", "domain"],
                "description": "Which document category to search"
            }
        },
        "required": ["query"]
    }
}

# Tool implementation must:
# 1. Validate inputs
# 2. Handle errors gracefully
# 3. Return structured results
# 4. Log usage for audit trail
# 5. Timeout after reasonable duration
```

## 6. Agent Testing Framework

```
UNIT TESTS FOR AGENTS:
  1. Does it call the right tool for the right task?
  2. Does it handle tool errors gracefully?
  3. Does it produce output in the expected format?
  4. Does it stop when it should (not infinite loop)?
  5. Does it stay within token budget?

INTEGRATION TESTS:
  1. Does the full agent pipeline produce correct output?
  2. Does it handle multi-step tasks correctly?
  3. Do agents hand off to each other properly?
  4. Does the router select the right model?

EVALUATION METRICS:
  - Task completion rate (% tasks completed successfully)
  - Output quality score (human eval or LLM-as-judge)
  - Token efficiency (tokens used per task)
  - Latency (time to complete)
  - Error rate (% tasks that fail)
```

## 7. Production Safety Rules

```
GUARDRAILS:
  1. Max iterations per agent: 20 (prevent infinite loops)
  2. Max tokens per call: 4096 output (prevent runaway generation)
  3. Max total tokens per task: 100K (prevent cost explosion)
  4. Timeout per agent: 5 minutes (prevent hanging)
  5. All outputs validated against expected schema
  6. No agent can modify system files or env vars
  7. All agent actions logged to audit trail
  8. Human-in-the-loop for destructive actions (delete, deploy)

FAILURE HANDLING:
  - LLM timeout → retry once, then escalate
  - LLM error → switch to fallback model
  - Invalid output → retry with stricter prompt
  - Repeated failure → mark as blocked, alert SENTINEL
```

## 8. Model Context Management

```
CONTEXT WINDOW BUDGET:
  System prompt:     ~500 tokens (keep lean)
  RAG context:       ~2000 tokens (5-8 chunks)
  Conversation:      ~1500 tokens (recent turns)
  Current task:      ~500 tokens
  Tool results:      ~1000 tokens
  Buffer:            ~500 tokens
  TOTAL:             ~6000 tokens input
  OUTPUT:            ~2000 tokens max

CONTEXT PRUNING STRATEGIES:
  1. Summarize old conversation turns
  2. Only include relevant RAG chunks (rerank)
  3. Compress tool results to key fields
  4. Remove completed sub-task details
```
