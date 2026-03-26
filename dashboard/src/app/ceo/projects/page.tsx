export default function ProjectsPage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-8 py-5 border-b border-border-light bg-bg-card">
        <h1 className="text-lg font-semibold text-text-primary tracking-tight">
          Projects
        </h1>
        <p className="text-xs text-text-muted mt-0.5">
          All client projects managed by SineLab
        </p>
      </div>
      <div className="px-8 py-6">
        <div className="bg-bg-card border border-border rounded-xl p-8 shadow-sm text-center">
          <div className="text-3xl mb-3">{"\u{1F4C2}"}</div>
          <h3 className="text-sm font-semibold text-text-primary mb-1">
            No projects yet
          </h3>
          <p className="text-xs text-text-muted max-w-xs mx-auto">
            When a client starts a project through the portal, it will appear
            here. You&apos;ll see status, teams, costs, and deliverables for each.
          </p>
        </div>
      </div>
    </div>
  );
}
