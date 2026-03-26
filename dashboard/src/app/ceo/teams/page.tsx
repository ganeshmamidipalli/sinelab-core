"use client";

import { useState } from "react";
import { teams } from "@/lib/teams-data";

export default function TeamsPage() {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-8 py-5 border-b border-border-light bg-bg-card">
        <h1 className="text-lg font-semibold text-text-primary tracking-tight">
          Teams
        </h1>
        <p className="text-xs text-text-muted mt-0.5">
          9 teams &middot;{" "}
          {teams.reduce((s, t) => s + t.members.length, 0)} members
        </p>
      </div>

      <div className="px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {teams.map((team) => (
            <div
              key={team.id}
              onClick={() =>
                setSelectedTeam(selectedTeam === team.id ? null : team.id)
              }
              className={`bg-bg-card border rounded-xl p-5 shadow-sm cursor-pointer transition ${
                selectedTeam === team.id
                  ? "border-accent shadow-md"
                  : "border-border hover:border-accent/30"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                  style={{
                    background: `${team.color}15`,
                  }}
                >
                  {team.icon}
                </div>
                <div className="flex-1">
                  <div
                    className="text-sm font-semibold"
                    style={{ color: team.color }}
                  >
                    {team.name}
                  </div>
                  <div className="text-[11px] text-text-muted">
                    {team.role} &middot; {team.code}
                  </div>
                </div>
              </div>

              <p className="text-xs text-text-secondary leading-relaxed mb-4">
                {team.mission}
              </p>

              <div className="space-y-2">
                {team.members.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center gap-2.5 py-1.5"
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold text-white"
                      style={{ background: team.color }}
                    >
                      {m.name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-medium text-text-primary">
                        {m.name}
                      </div>
                      <div className="text-[10px] text-text-muted">
                        {m.title}
                      </div>
                    </div>
                    <span
                      className={`text-[9px] font-medium px-2 py-0.5 rounded-full ${
                        m.status === "active"
                          ? "bg-success-light text-success"
                          : m.status === "blocked"
                          ? "bg-error-light text-error"
                          : m.status === "review"
                          ? "bg-warning-light text-warning"
                          : "bg-bg-secondary text-text-muted"
                      }`}
                    >
                      {m.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
