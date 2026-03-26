"use client";

import { useState } from "react";
import { teams } from "@/lib/teams-data";
import Link from "next/link";

export default function CeoDashboard() {
  const [sentinelInput, setSentinelInput] = useState("");

  const totalMembers = teams.reduce((s, t) => s + t.members.length, 0);
  const activeMembers = teams.reduce(
    (s, t) => s + t.members.filter((m) => m.status === "active").length,
    0
  );

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="px-8 py-5 border-b border-border-light bg-bg-card flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-text-primary tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            Overview of all operations
          </p>
        </div>
        <div className="flex items-center gap-5">
          <Stat label="Teams" value="9" />
          <Stat label="Members" value={String(totalMembers)} />
          <Stat label="Active" value={String(activeMembers)} />
          <Stat label="Projects" value="0" />
        </div>
      </div>

      <div className="px-8 py-6 space-y-6">
        {/* SENTINEL Briefing */}
        <div className="bg-bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-accent-light flex items-center justify-center text-lg">
              {"\u{1F6E1}\uFE0F"}
            </div>
            <div>
              <h2 className="text-sm font-semibold text-text-primary">
                SENTINEL Briefing
              </h2>
              <p className="text-[11px] text-text-muted">
                Chief of Staff &middot; Last updated just now
              </p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-success live-dot" />
              <span className="text-[11px] text-success font-medium">
                Online
              </span>
            </div>
          </div>

          <div className="bg-bg-primary rounded-lg p-4 mb-4 border border-border-light">
            <p className="text-sm text-text-secondary leading-relaxed">
              Good morning, Ganesh. All 8 teams are on standby with 25 members
              ready. No active projects yet. When you&apos;re ready, start a new project
              or wait for a client to come through the portal. I&apos;ll brief you on
              everything as it happens.
            </p>
          </div>

          {/* Chat with SENTINEL */}
          <div className="flex gap-2">
            <input
              type="text"
              value={sentinelInput}
              onChange={(e) => setSentinelInput(e.target.value)}
              placeholder="Ask SENTINEL anything..."
              className="flex-1 px-3 py-2 text-sm border border-border rounded-lg bg-bg-primary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-subtle transition"
            />
            <button className="px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent-hover transition">
              Send
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-4">
          <Link
            href="/client/portal"
            className="bg-bg-card border border-border rounded-xl p-5 shadow-sm hover:border-accent hover:shadow-md transition group"
          >
            <div className="text-2xl mb-3">+</div>
            <div className="text-sm font-semibold text-text-primary group-hover:text-accent transition">
              New Project
            </div>
            <div className="text-xs text-text-muted mt-1">
              Start a new client project
            </div>
          </Link>
          <Link
            href="/ceo/teams"
            className="bg-bg-card border border-border rounded-xl p-5 shadow-sm hover:border-accent hover:shadow-md transition group"
          >
            <div className="text-2xl mb-3">{"\u25B3"}</div>
            <div className="text-sm font-semibold text-text-primary group-hover:text-accent transition">
              View Teams
            </div>
            <div className="text-xs text-text-muted mt-1">
              9 teams, {totalMembers} members
            </div>
          </Link>
          <Link
            href="/ceo/costs"
            className="bg-bg-card border border-border rounded-xl p-5 shadow-sm hover:border-accent hover:shadow-md transition group"
          >
            <div className="text-2xl mb-3">$</div>
            <div className="text-sm font-semibold text-text-primary group-hover:text-accent transition">
              Cost Report
            </div>
            <div className="text-xs text-text-muted mt-1">
              LLM usage and spending
            </div>
          </Link>
        </div>

        {/* Alerts */}
        <div className="bg-bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-text-primary mb-4">
            Pending Approvals
          </h3>
          <div className="text-sm text-text-muted text-center py-8">
            No pending approvals. You&apos;re all caught up.
          </div>
        </div>

        {/* Teams Overview */}
        <div>
          <h3 className="text-sm font-semibold text-text-primary mb-4">
            Team Status
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {teams
              .filter((t) => t.id !== "sentinel")
              .map((team) => (
                <div
                  key={team.id}
                  className="bg-bg-card border border-border rounded-xl p-4 shadow-sm hover:border-accent/30 transition"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">{team.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-text-primary truncate">
                        {team.name}
                      </div>
                      <div className="text-[10px] text-text-muted">
                        {team.role}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-1.5">
                      {team.members.map((m) => (
                        <div
                          key={m.id}
                          className="w-6 h-6 rounded-full border-2 border-bg-card flex items-center justify-center text-[8px] font-semibold text-white"
                          style={{ background: team.color }}
                          title={m.name}
                        >
                          {m.name
                            .split(" ")
                            .map((w) => w[0])
                            .join("")}
                        </div>
                      ))}
                    </div>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        team.members.some((m) => m.status === "active")
                          ? "bg-success-light text-success"
                          : "bg-bg-secondary text-text-muted"
                      }`}
                    >
                      {team.members.some((m) => m.status === "active")
                        ? "Active"
                        : "Standby"}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-text-primary mb-4">
            Recent Activity
          </h3>
          <div className="text-sm text-text-muted text-center py-8">
            No activity yet. Start a project to see team coordination.
          </div>
        </div>

        {/* GitHub Status */}
        <div className="flex items-center gap-3 px-4 py-3 bg-bg-secondary rounded-lg text-xs">
          <span>{"\u{1F4C1}"}</span>
          <span className="font-mono text-text-primary">
            ganeshmamidipalli/sinelab-core
          </span>
          <span className="ml-auto flex items-center gap-1.5 text-success font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            Connected
          </span>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center px-3 py-1.5 bg-bg-primary rounded-lg">
      <div className="text-base font-semibold font-mono text-text-primary">
        {value}
      </div>
      <div className="text-[10px] text-text-muted uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}
