"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-bg-primary">
      {/* Sidebar */}
      <aside className="w-[240px] bg-bg-card border-r border-border flex flex-col flex-shrink-0">
        <div className="px-5 py-5 border-b border-border-light">
          <div className="text-base font-semibold text-text-primary tracking-tight">
            SineLab
          </div>
          <div className="text-[11px] text-text-muted mt-0.5">
            Client Portal
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-3">
          <Link
            href="/client/portal"
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] mb-0.5 transition ${
              pathname === "/client/portal"
                ? "bg-accent-subtle text-accent font-medium"
                : "text-text-secondary hover:bg-bg-secondary"
            }`}
          >
            <span className="w-5 text-center">{"\u25CB"}</span>
            Overview
          </Link>
          <Link
            href="/client/chat"
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] mb-0.5 transition ${
              pathname === "/client/chat"
                ? "bg-accent-subtle text-accent font-medium"
                : "text-text-secondary hover:bg-bg-secondary"
            }`}
          >
            <span className="w-5 text-center">{"\u{1F4AC}"}</span>
            Chat with Team
          </Link>
        </nav>

        <div className="px-4 py-4 border-t border-border-light flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-info flex items-center justify-center text-white text-xs font-semibold">
            CL
          </div>
          <div>
            <div className="text-[13px] font-medium text-text-primary">
              Client User
            </div>
            <div className="text-[11px] text-text-muted">Guest</div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">{children}</main>
    </div>
  );
}
