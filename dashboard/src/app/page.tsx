import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-border-light">
        <div className="text-lg font-semibold tracking-tight text-text-primary">
          SineLab
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm text-text-secondary hover:text-text-primary transition"
          >
            Login
          </Link>
          <Link
            href="/login?role=client"
            className="text-sm px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-8">
        <div className="max-w-2xl text-center">
          <div className="inline-block px-3 py-1 mb-6 text-xs font-medium tracking-wider uppercase text-accent bg-accent-light rounded-full">
            Agentic Framework
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-text-primary leading-tight mb-6">
            Your AI-powered
            <br />
            software consulting firm
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed mb-10 max-w-lg mx-auto">
            8 specialized teams. 25 AI agents. One framework that designs,
            architects, builds, tests, and ships enterprise applications.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/login?role=client"
              className="px-6 py-3 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-hover transition"
            >
              Start a Project
            </Link>
            <Link
              href="/login?role=ceo"
              className="px-6 py-3 border border-border text-text-secondary rounded-lg text-sm font-medium hover:bg-bg-secondary transition"
            >
              CEO Login
            </Link>
          </div>

          {/* Team badges */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-3">
            {[
              { name: "PHANTOM ORACLE", color: "#9B59B6" },
              { name: "THUNDER HELM", color: "#E74C3C" },
              { name: "IRON BLUEPRINT", color: "#3498DB" },
              { name: "NEURAL STORM", color: "#1ABC9C" },
              { name: "DARK FORGE", color: "#E67E22" },
              { name: "PIXEL VENOM", color: "#F39C12" },
              { name: "GHOST DEPLOY", color: "#2ECC71" },
              { name: "CRASH KINGS", color: "#C25B4E" },
            ].map((team) => (
              <span
                key={team.name}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white border border-border-light"
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: team.color }}
                />
                {team.name}
              </span>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-8 py-6 border-t border-border-light text-center">
        <p className="text-xs text-text-muted">
          SineLab &mdash; Built by Ganesh Mamidipalli
        </p>
      </footer>
    </div>
  );
}
