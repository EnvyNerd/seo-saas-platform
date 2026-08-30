import { Link } from 'react-router-dom';
import { BarChart3, Globe, LayoutDashboard, Search, ShieldCheck, Target, Zap } from 'lucide-react';

const FEATURES = [
  { title: 'Deep SEO Audits', description: 'Run full site audits with actionable issues, priority fixes, and monitoring-ready reporting.', icon: Search },
  { title: 'Keyword Intelligence', description: 'Generate keyword clusters, analyze gaps, and track rankings against competitors.', icon: Target },
  { title: 'Competitor Analysis', description: 'Compare sites, reveal gaps, and find content and backlink opportunities fast.', icon: BarChart3 },
  { title: 'AI Content Assistant', description: 'Create optimized outlines, drafts, and on-page recommendations with AI guidance.', icon: Zap },
  { title: 'AEO & GEO Insights', description: 'Optimize for answer engines and generative search with structured visibility checks.', icon: Globe },
  { title: 'Realtime Analytics', description: 'Monitor performance, track changes, and measure impact after each optimization.', icon: LayoutDashboard },
];

const STATS = [
  { value: '10x', label: 'Faster audits' },
  { value: '85%', label: 'More keywords found' },
  { value: '3.2x', label: 'Better CTR on optimized pages' },
  { value: '24/7', label: 'Monitoring coverage' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src="/orbital-meridian.png" alt="VISIORAX PROJECT" className="h-9 w-9 rounded-xl object-cover" />
            <span className="text-lg font-bold tracking-tight">VISIORAX PROJECT</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden md:inline-flex text-sm font-semibold text-slate-300 hover:text-white transition-colors">
              Sign in
            </Link>
            <Link to="/register" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-600 hover:to-purple-700 transition-all">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(99,102,241,0.25),transparent_40%),radial-gradient(circle_at_bottom_left,_rgba(168,85,247,0.25),transparent_40%)]" />
        <div className="container relative mx-auto px-4 md:px-8 max-w-7xl py-20 md:py-28">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-300 mb-4">AI-powered SEO platform</p>
            <h1 className="text-4xl md:text-6xl font-bold leading-[1.1] tracking-tight">
              Rank higher with AI-driven SEO workflows
            </h1>
            <p className="mt-6 text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Run deep audits, generate high-intent keywords, analyze competitors, and optimize content
              in one platform. Built for teams that want execution speed without losing quality.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link to="/register" className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-600 hover:to-purple-700 transition-all">
                Start free trial
              </Link>
              <Link to="/login" className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900/50 px-5 py-3.5 text-sm font-bold text-slate-200 hover:bg-slate-800 transition-colors">
                Sign in to dashboard
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
              {STATS.map((item) => (
                <div key={item.label} className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                  <p className="text-xl font-bold text-white">{item.value}</p>
                  <p className="text-xs text-slate-400 mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-slate-800 bg-slate-950">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl py-16 md:py-24">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-300 mb-3">Features</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Everything you need to grow organic traffic</h2>
            <p className="mt-4 text-slate-300">From technical audits to content planning, this platform covers the SEO workflow end to end.</p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ title, description, icon: Icon }) => (
              <div key={title} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 hover:border-indigo-500/40 transition-colors">
                <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4">
                  <Icon size={20} className="text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing tease */}
      <section className="border-t border-slate-800 bg-slate-950">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl py-16 md:py-24">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-300 mb-3">Pricing</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Simple plans for every stage</h2>
            <p className="mt-4 text-slate-300">Start free, then upgrade when you’re ready for full workflows and AI power.</p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
            {['Free', 'Pro', 'Agency'].map((plan, index) => (
              <div key={plan} className={`rounded-2xl border ${index === 1 ? 'border-indigo-500/60 shadow-lg shadow-indigo-500/10' : 'border-slate-800'} bg-slate-900/50 p-6`}>
                <p className="text-sm font-semibold text-indigo-300">{plan}</p>
                <p className="mt-2 text-3xl font-bold text-white">{plan === 'Free' ? '$0' : plan === 'Pro' ? '$49' : '$149'}</p>
                <p className="mt-1 text-xs text-slate-400">per month</p>

                <ul className="mt-5 space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2"><ShieldCheck size={16} className="text-indigo-400" /> Core audit & keyword tools</li>
                  {index > 0 && <li className="flex items-center gap-2"><ShieldCheck size={16} className="text-indigo-400" /> AI generation limits raised</li>}
                  {index > 1 && <li className="flex items-center gap-2"><ShieldCheck size={16} className="text-indigo-400" /> Competitor and export access</li>}
                  <li className="flex items-center gap-2"><ShieldCheck size={16} className="text-indigo-400" /> SSL and account security</li>
                </ul>

                <div className="mt-6">
                  <Link to="/register" className="inline-flex items-center justify-center w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-3 text-sm font-bold text-white hover:from-indigo-600 hover:to-purple-700 transition-all">
                    {plan === 'Free' ? 'Create free account' : 'Start trial'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400">VISIORAX PROJECT by RigVisionX Technology™. All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <Link to="/login" className="hover:text-white transition-colors">Sign in</Link>
            <Link to="/register" className="hover:text-white transition-colors">Get started</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
