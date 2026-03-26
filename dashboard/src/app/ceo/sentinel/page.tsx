"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/lib/types";

const INITIAL: ChatMessage[] = [
  {
    id: "1",
    senderType: "agent",
    senderName: "SENTINEL",
    senderRole: "Chief of Staff",
    content:
      "Good morning, Ganesh. I'm online and monitoring all systems.\n\nCurrent status:\n\u2022 8 teams on standby (25 members)\n\u2022 No active projects\n\u2022 No pending alerts\n\u2022 LLM costs today: $0.00\n\nWhat would you like to do?",
    timestamp: new Date().toISOString(),
  },
];

export default function SentinelPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = {
      id: String(Date.now()),
      senderType: "ceo",
      senderName: "Ganesh",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // TODO: Replace with real SENTINEL API
    setTimeout(() => {
      const resp: ChatMessage = {
        id: String(Date.now() + 1),
        senderType: "agent",
        senderName: "SENTINEL",
        senderRole: "Chief of Staff",
        content: getSentinelResponse(userMsg.content),
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, resp]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1500);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-8 py-5 border-b border-border-light bg-bg-card flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-accent-light flex items-center justify-center text-lg">
            {"\u{1F6E1}\uFE0F"}
          </div>
          <div>
            <h1 className="text-lg font-semibold text-text-primary tracking-tight">
              SENTINEL
            </h1>
            <p className="text-[11px] text-text-muted">
              Chief of Staff &middot; Direct line to all teams
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-success live-dot" />
          <span className="text-[11px] text-success font-medium">Online</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${
              msg.senderType === "ceo" ? "justify-end" : ""
            }`}
          >
            {msg.senderType !== "ceo" && (
              <div className="w-8 h-8 rounded-lg bg-accent-light flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                {"\u{1F6E1}\uFE0F"}
              </div>
            )}
            <div
              className={`max-w-[560px] ${
                msg.senderType === "ceo" ? "text-right" : ""
              }`}
            >
              {msg.senderType !== "ceo" && (
                <div className="text-xs font-semibold text-accent mb-1">
                  SENTINEL
                </div>
              )}
              <div
                className={`inline-block text-sm leading-relaxed rounded-2xl px-4 py-3 ${
                  msg.senderType === "ceo"
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
            <div className="w-8 h-8 rounded-lg bg-accent-light flex items-center justify-center text-sm">
              {"\u{1F6E1}\uFE0F"}
            </div>
            <div className="inline-flex items-center gap-1 bg-bg-secondary rounded-2xl rounded-bl-md px-4 py-3">
              <span className="w-1.5 h-1.5 rounded-full bg-text-muted typing-dot" />
              <span className="w-1.5 h-1.5 rounded-full bg-text-muted typing-dot" />
              <span className="w-1.5 h-1.5 rounded-full bg-text-muted typing-dot" />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="px-8 py-4 border-t border-border-light bg-bg-card">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Give SENTINEL a directive..."
            className="flex-1 px-4 py-3 text-sm border border-border rounded-xl bg-bg-primary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-subtle transition"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="px-5 py-3 bg-accent text-white text-sm font-medium rounded-xl hover:bg-accent-hover transition disabled:opacity-40"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

function getSentinelResponse(input: string): string {
  const q = input.toLowerCase();
  if (q.includes("status") || q.includes("report"))
    return "All systems nominal.\n\n\u2022 Teams: 8 on standby\n\u2022 Active projects: 0\n\u2022 Pending alerts: 0\n\u2022 Today's spend: $0.00\n\nNo action needed at this time.";
  if (q.includes("team"))
    return "All 8 teams are on standby:\n\n1. PHANTOM ORACLE (Domain) — 3 members\n2. THUNDER HELM (PM) — 2 members\n3. IRON BLUEPRINT (Architect) — 3 members\n4. NEURAL STORM (AI/ML) — 4 members\n5. DARK FORGE (Backend) — 4 members\n6. PIXEL VENOM (Frontend) — 3 members\n7. GHOST DEPLOY (DevOps) — 3 members\n8. CRASH KINGS (QA) — 3 members\n\nTotal: 25 members. Ready to activate on your command.";
  if (q.includes("cost"))
    return "Cost summary:\n\n\u2022 Today: $0.00\n\u2022 This week: $0.00\n\u2022 This month: $0.00\n\nNo LLM calls made yet. Costs will be tracked per project, per team, and per model once we start.";
  return "Understood. I'll take care of that. Is there anything else you need?";
}
