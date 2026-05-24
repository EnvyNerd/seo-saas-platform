export default function ToolPageShell({ title, subtitle, icon: Icon, children }) {
  return (
    <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-start gap-4">
          {Icon && (
            <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-3">
              <Icon className="h-6 w-6 text-cyan-400" />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-white">{title}</h1>
            {subtitle && <p className="mt-2 text-slate-400">{subtitle}</p>}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
