"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/lib/types";

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "1",
    senderType: "agent",
    senderName: "Rex Donovan",
    senderRole: "Project Coordinator — THUNDER HELM",
    content:
      "Welcome to SineLab. I'm Rex, your project coordinator. I'll be working with you to understand exactly what you need, and then our teams will take it from there.\n\nTell me — what are you looking to build?",
    timestamp: new Date().toISOString(),
  },
];

export default function ClientChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      senderType: "client",
      senderName: "You",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // TODO: Replace with real API call to backend → LLM
    // For now, simulate a response
    setTimeout(() => {
      const responses = getSimulatedResponse(userMsg.content, messages.length);
      setMessages((prev) => [...prev, responses]);
      setIsTyping(false);
    }, 1500 + Math.random() * 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border-light bg-bg-card flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#E74C3C] flex items-center justify-center text-white text-xs font-semibold">
          RD
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-text-primary">
            Rex Donovan
          </div>
          <div className="text-[11px] text-text-muted">
            Project Coordinator &middot; THUNDER HELM
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-success live-dot" />
          <span className="text-[11px] text-success font-medium">Online</span>
        </div>
      </div>

      {/* Participants bar */}
      <div className="px-6 py-2 border-b border-border-light bg-bg-secondary flex items-center gap-2 text-[11px] text-text-muted">
        <span>Participants:</span>
        <span className="flex items-center gap-1 text-text-secondary font-medium">
          <span
            className="w-4 h-4 rounded-full bg-[#E74C3C] text-white text-[7px] font-bold flex items-center justify-center"
          >
            RD
          </span>
          Rex Donovan (PM)
        </span>
        <span>&middot;</span>
        <span className="flex items-center gap-1 text-text-secondary font-medium">
          <span
            className="w-4 h-4 rounded-full bg-[#9B59B6] text-white text-[7px] font-bold flex items-center justify-center"
          >
            NP
          </span>
          Nova Patel (Domain)
        </span>
        <span className="ml-auto">{"\u{1F4CB}"} All conversations recorded</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${
              msg.senderType === "client" ? "justify-end" : ""
            }`}
          >
            {msg.senderType !== "client" && (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0 mt-0.5"
                style={{
                  background:
                    msg.senderName === "Rex Donovan"
                      ? "#E74C3C"
                      : msg.senderName === "Nova Patel"
                      ? "#9B59B6"
                      : "#C4704B",
                }}
              >
                {msg.senderName
                  .split(" ")
                  .map((w) => w[0])
                  .join("")}
              </div>
            )}

            <div
              className={`max-w-[520px] ${
                msg.senderType === "client" ? "text-right" : ""
              }`}
            >
              {msg.senderType !== "client" && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-text-primary">
                    {msg.senderName}
                  </span>
                  {msg.senderRole && (
                    <span className="text-[10px] text-text-muted">
                      {msg.senderRole}
                    </span>
                  )}
                </div>
              )}
              <div
                className={`inline-block text-sm leading-relaxed rounded-2xl px-4 py-2.5 ${
                  msg.senderType === "client"
                    ? "bg-accent text-white rounded-br-md"
                    : "bg-bg-secondary text-text-primary rounded-bl-md"
                }`}
              >
                {msg.content.split("\n").map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < msg.content.split("\n").length - 1 && <br />}
                  </span>
                ))}
              </div>
              <div className="mt-1 text-[10px] text-text-muted">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-[#E74C3C] flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0">
              RD
            </div>
            <div>
              <div className="text-xs font-semibold text-text-primary mb-1">
                Rex Donovan
              </div>
              <div className="inline-flex items-center gap-1 bg-bg-secondary rounded-2xl rounded-bl-md px-4 py-3">
                <span className="w-1.5 h-1.5 rounded-full bg-text-muted typing-dot" />
                <span className="w-1.5 h-1.5 rounded-full bg-text-muted typing-dot" />
                <span className="w-1.5 h-1.5 rounded-full bg-text-muted typing-dot" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-border-light bg-bg-card">
        <div className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 text-sm border border-border rounded-xl bg-bg-primary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-subtle transition"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="px-5 py-3 bg-accent text-white text-sm font-medium rounded-xl hover:bg-accent-hover transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
        <div className="mt-2 text-[10px] text-text-muted text-center">
          This conversation is recorded and stored for project reference
        </div>
      </div>
    </div>
  );
}

function getSimulatedResponse(
  userInput: string,
  msgCount: number
): ChatMessage {
  const input = userInput.toLowerCase();

  let response = "";
  let sender = "Rex Donovan";
  let role = "Project Coordinator — THUNDER HELM";

  if (msgCount <= 2) {
    response = `That sounds interesting. Let me understand better.\n\nWho would be the primary users of this system? What role do they have, and what's their biggest pain point today?`;
  } else if (msgCount <= 4) {
    response = `Got it. That gives me a clear picture of who we're building for.\n\nNow, what industry or domain does this fall into? This helps our domain experts understand the business rules and workflows.`;
    sender = "Nova Patel";
    role = "Domain Expert — PHANTOM ORACLE";
  } else if (msgCount <= 6) {
    response = `Perfect. Let me jot down the core features you need. Can you list the main things this system must do? Start with the most important ones.\n\nDon't worry about technical details — just describe what it should do from the user's perspective.`;
    sender = "Rex Donovan";
    role = "Project Coordinator — THUNDER HELM";
  } else if (msgCount <= 8) {
    response = `This is a solid scope. Let me summarize what I have so far:\n\n${
      input.length > 20 ? "Based on what you've described" : "Based on our conversation"
    }, I'm going to put together a project proposal with our architecture team. We'll have a plan ready for your review.\n\nAny specific technology preferences, or should our architects decide what's best?`;
  } else if (msgCount <= 10) {
    response = `Excellent. I have everything I need to get started.\n\nHere's what happens next:\n\n1. Our domain team (PHANTOM ORACLE) will analyze the business rules\n2. I'll create the product requirements document\n3. Architecture team (IRON BLUEPRINT) will design the system\n4. We'll present you with a full proposal\n\nYou'll be able to see progress right here in the portal. I'll check in with you if we have any questions.\n\nLet's build this.`;
  } else {
    response = `I'll pass that along to the team. Is there anything else you'd like to add or any questions about the process?`;
  }

  return {
    id: String(Date.now()),
    senderType: "agent",
    senderName: sender,
    senderRole: role,
    content: response,
    timestamp: new Date().toISOString(),
  };
}
