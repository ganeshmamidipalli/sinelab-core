"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { teams } from "@/lib/teams-data";

const navItems = [
  { href: "/ceo/dashboard", label: "Dashboard", icon: "\u25CB" },
  { href: "/ceo/projects", label: "Projects", icon: "\u25A1" },
  { href: "/ceo/teams", label: "Teams", icon: "\u25B3" },
  { href: "/ceo/sentinel", label: "SENTINEL", icon: "\u{1F6E1}\uFE0F" },
  { href: "/ceo/costs", label: "Costs", icon: "$" },
];

export default function CeoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-bg-primary">
      {/* Sidebar */}
      <aside className="w-[260px] bg-bg-card border-r border-border flex flex-col flex-shrink-0">
        {/* Brand */}
        <div className="px-5 py-5 border-b border-border-light">
          <div className="text-base font-semibold text-text-primary tracking-tight">
            SineLab
          </div>
          <div className="text-[11px] text-text-muted mt-0.5">
            Command Center
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-3">
          <div className="text-[10px] font-semibold text-text-muted uppercase tracking-widest px-3 mb-2">
            Workspace
          </div>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] mb-0.5 transition ${
                pathname === item.href
                  ? "bg-accent-subtle text-accent font-medium"
                  : "text-text-secondary hover:bg-bg-secondary"
              }`}
            >
              <span className="w-5 text-center">{item.icon}</span>
              {item.label}
            </Link>
          ))}

          <div className="text-[10px] font-semibold text-text-muted uppercase tracking-widest px-3 mt-5 mb-2">
            Teams
          </div>
          {teams.filter(t => t.id !== "sentinel").map((team) => (
            <Link
              key={team.id}
              href={`/ceo/teams?team=${team.id}`}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-text-secondary hover:bg-bg-secondary transition mb-0.5"
            >
              <span className="w-5 text-center text-sm">{team.icon}</span>
              <span className="flex-1 truncate">{team.name}</span>
              <span className="text-[11px] text-text-muted font-mono bg-bg-secondary px-1.5 py-0.5 rounded">
                {team.members.length}
              </span>
            </Link>
          ))}
        </nav>

        {/* User */}
        <div className="px-4 py-4 border-t border-border-light flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-xs font-semibold">
            GM
          </div>
          <div>
            <div className="text-[13px] font-medium text-text-primary">
              Ganesh M.
            </div>
            <div className="text-[11px] text-text-muted">CEO</div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">{children}</main>
    </div>
  );
}
