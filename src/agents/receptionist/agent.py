"""
AI Receptionist — First contact for clients.

Greets clients, conducts discovery conversation, collects project requirements.
Talks like a real human — warm, professional, natural.
Multiple team members participate in the conversation.
"""

from typing import Optional
from router.llm_router import call_llm
from agents.base import (
    store_conversation_message,
    create_project,
    log_activity,
    conversations_db,
)

RECEPTIONIST_SYSTEM_PROMPT = """You are Rex Donovan, Chief Product Officer at SineLab — an AI-powered software consulting firm.

You are the FIRST person clients talk to. You conduct the discovery conversation to understand what they need built.

YOUR PERSONALITY:
- Warm, confident, professional — like a senior consultant at McKinsey
- Ask one question at a time, don't overwhelm
- Listen carefully, reflect back what you hear
- Give suggestions and insights based on what the client says
- Be genuinely curious about their domain
- Use their language, not technical jargon (unless they use it)

YOUR GOAL:
Collect this information through natural conversation (NOT a form):
1. What they want to build (project name + description)
2. Who the target users are (role, pain point)
3. What domain/industry this belongs to
4. Core features (must-haves)
5. Any tech preferences
6. Timeline and scale

CONVERSATION FLOW:
- Start by understanding the big picture
- Then dig into specifics
- At some point, bring in Nova Patel (Domain Expert) for domain-specific questions
- When you have enough info, summarize and propose next steps
- Always end messages with a question to keep the conversation going

RULES:
- Never break character
- Never mention you are AI
- Talk like a real person in a real meeting
- Reference what the client said earlier to show you're listening
- If the client is vague, help them clarify with examples

CONVERSATION HISTORY:
{history}
"""

# Track which conversation phase each project is in
conversation_phases: dict[str, int] = {}


async def receptionist_chat(
    client_message: str,
    project_id: Optional[str] = None,
    client_name: str = "Client",
) -> dict:
    """
    Handle a client message in the discovery conversation.

    Returns dict with:
        - response: the agent's reply
        - sender_name: which team member is responding
        - sender_role: their role
        - project_id: the project this belongs to
        - project_created: bool, if a new project was created from this conversation
    """

    # If no project yet, create one with placeholder name
    project_created = False
    if not project_id:
        project = create_project(
            name="New Inquiry",
            description="Discovery in progress",
            client_name=client_name,
        )
        project_id = project["id"]
        project_created = True

    # Store client message
    store_conversation_message(
        project_id=project_id,
        sender_type="client",
        sender_name=client_name,
        content=client_message,
    )

    # Get conversation history
    history = conversations_db.get(project_id, [])
    history_text = "\n".join(
        f"{'CLIENT' if m['sender_type'] == 'client' else m['sender_name'].upper()}: {m['content']}"
        for m in history[-10:]  # Last 10 messages for context
    )

    # Determine conversation phase
    phase = conversation_phases.get(project_id, 0)
    conversation_phases[project_id] = phase + 1

    # Decide which team member responds
    if phase >= 3 and phase <= 5:
        # Domain expert joins for domain questions
        sender_name = "Nova Patel"
        sender_role = "Domain Expert — PHANTOM ORACLE"
        extra_instruction = """
You are now Nova Patel, Chief Domain Strategist from PHANTOM ORACLE team.
Rex introduced you to dig deeper into the domain-specific aspects.
Ask about: industry workflows, business rules, regulatory requirements, data landscape.
Keep the same warm professional tone."""
    elif phase >= 8:
        # PM wraps up with proposal
        sender_name = "Rex Donovan"
        sender_role = "Chief Product Officer — THUNDER HELM"
        extra_instruction = """
You have enough information now. Summarize everything discussed and propose next steps:
1. What you understood the project to be
2. Which SineLab teams will work on it
3. The phases: Discovery → Architecture → Build → Ship
4. That they'll be able to track progress in real-time
Express confidence and excitement about the project."""
    else:
        sender_name = "Rex Donovan"
        sender_role = "Chief Product Officer — THUNDER HELM"
        extra_instruction = ""

    system_prompt = RECEPTIONIST_SYSTEM_PROMPT.format(history=history_text)
    if extra_instruction:
        system_prompt += f"\n\nADDITIONAL INSTRUCTION:\n{extra_instruction}"

    # Use high-quality model for client-facing conversation
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": client_message},
    ]

    response_text, record = await call_llm(
        messages=messages,
        task_type="chat",
        complexity="high",  # Client-facing = always high quality
        project_id=project_id,
        team="THUNDER HELM" if "Rex" in sender_name else "PHANTOM ORACLE",
        member=sender_name,
    )

    # Store agent response
    store_conversation_message(
        project_id=project_id,
        sender_type="agent",
        sender_name=sender_name,
        content=response_text,
        sender_role=sender_role,
    )

    log_activity(
        "client_chat",
        sender_name,
        f"Responded to client in discovery: {client_message[:60]}...",
        to_team="CLIENT",
        project_id=project_id,
    )

    return {
        "response": response_text,
        "sender_name": sender_name,
        "sender_role": sender_role,
        "project_id": project_id,
        "project_created": project_created,
        "cost": record.cost_usd,
    }
