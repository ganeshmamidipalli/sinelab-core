export default function CostsPage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-8 py-5 border-b border-border-light bg-bg-card">
        <h1 className="text-lg font-semibold text-text-primary tracking-tight">
          Costs
        </h1>
        <p className="text-xs text-text-muted mt-0.5">
          LLM usage and spending across all projects
        </p>
      </div>
      <div className="px-8 py-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Today", value: "$0.00" },
            { label: "This Week", value: "$0.00" },
            { label: "This Month", value: "$0.00" },
            { label: "Total", value: "$0.00" },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-bg-card border border-border rounded-xl p-4 shadow-sm"
            >
              <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1">
                {s.label}
              </div>
              <div className="text-xl font-semibold font-mono text-text-primary">
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* By Model */}
        <div className="bg-bg-card border border-border rounded-xl p-6 shadow-sm mb-4">
          <h3 className="text-sm font-semibold text-text-primary mb-4">
            Cost by LLM Model
          </h3>
          <div className="space-y-3">
            {[
              { name: "Claude Sonnet", cost: 0, color: "#C4704B" },
              { name: "DeepSeek V3", cost: 0, color: "#1ABC9C" },
              { name: "GPT-4o-mini", cost: 0, color: "#5B7FB5" },
              { name: "Qwen 2.5 Coder", cost: 0, color: "#9B59B6" },
              { name: "Claude Haiku", cost: 0, color: "#E67E22" },
            ].map((m) => (
              <div key={m.name} className="flex items-center gap-3">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: m.color }}
                />
                <span className="text-xs text-text-secondary flex-1">
                  {m.name}
                </span>
                <span className="text-xs font-mono text-text-primary">
                  ${m.cost.toFixed(2)}
                </span>
                <div className="w-32 h-2 bg-bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: "0%", background: m.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* By Team */}
        <div className="bg-bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-text-primary mb-4">
            Cost by Team
          </h3>
          <div className="text-sm text-text-muted text-center py-6">
            No usage data yet. Costs will appear once projects start.
          </div>
        </div>
      </div>
    </div>
  );
}
