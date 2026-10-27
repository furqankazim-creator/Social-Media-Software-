import React, { useState, useMemo } from 'react';
import {
  Shield,
  Lock,
  Unlock,
  KeyRound,
  ExternalLink,
  Printer,
  Copy,
  Check,
  Clock,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
  TrendingUp,
  Users,
  Target,
  ArrowLeft,
  Share2
} from 'lucide-react';
import { formatNum, formatMoney } from '../../utils/helpers';

export default function ClientPortalView({
  client,
  tasks = [],
  projects = [],
  calendar = [],
  metrics = [],
  onExitPortal,
  notify
}) {
  const [passwordInput, setPasswordInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // If no password set or already authenticated
    return !client?.portalPassword || client.portalPassword.trim() === '';
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const clientColor = client?.color || '#3157d5';

  const handleUnlock = (e) => {
    e.preventDefault();
    if (passwordInput === client.portalPassword) {
      setIsAuthenticated(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Incorrect passcode. Please contact Akhtar Ali for access.');
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/?portal=${encodeURIComponent(client.name)}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
    if (notify) notify(`Portal link copied for ${client.name}!`);
  };

  // Client-specific statistics
  const clientTasks = useMemo(
    () => tasks.filter((t) => t.brand === client?.name),
    [tasks, client]
  );
  const completedTasks = useMemo(
    () => clientTasks.filter((t) => t.status === 'Completed'),
    [clientTasks]
  );
  const clientProjects = useMemo(
    () => projects.filter((p) => p.brand === client?.name),
    [projects, client]
  );
  const clientCalendar = useMemo(
    () => calendar.filter((c) => c.brand === client?.name),
    [calendar, client]
  );
  const clientMetrics = useMemo(
    () => metrics.filter((m) => m.brand === client?.name),
    [metrics, client]
  );

  const totalHours = useMemo(
    () => clientTasks.reduce((sum, t) => sum + Number(t.actual || 0), 0),
    [clientTasks]
  );
  const totalOutputs = useMemo(
    () => clientTasks.reduce((sum, t) => sum + Number(t.output || 0), 0),
    [clientTasks]
  );
  const totalReach = useMemo(
    () => clientMetrics.reduce((sum, m) => sum + Number(m.reach || 0), 0),
    [clientMetrics]
  );
  const totalImpressions = useMemo(
    () => clientMetrics.reduce((sum, m) => sum + Number(m.impressions || 0), 0),
    [clientMetrics]
  );
  const totalLeads = useMemo(
    () => clientMetrics.reduce((sum, m) => sum + Number(m.leads || 0), 0),
    [clientMetrics]
  );
  const totalConversions = useMemo(
    () => clientMetrics.reduce((sum, m) => sum + Number(m.conversions || 0), 0),
    [clientMetrics]
  );

  // Authentication Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-800 border border-slate-700/80 rounded-3xl p-8 shadow-2xl text-center space-y-6 animate-fade-in">
          <div
            className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-white shadow-lg"
            style={{ backgroundColor: clientColor }}
          >
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <span
              className="text-xs uppercase font-extrabold tracking-widest px-2.5 py-1 rounded-full text-white"
              style={{ backgroundColor: clientColor }}
            >
              {client?.name}
            </span>
            <h2 className="text-xl font-black text-white mt-3">
              Protected Stakeholder Portal
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Enter the access passcode provided by Akhtar Ali to view deliverables &amp; performance metrics.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4 text-left">
            <div>
              <label
                htmlFor="passcode"
                className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5"
              >
                Passcode
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="passcode"
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter access code..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
                  autoFocus
                />
              </div>
              {errorMsg && (
                <p className="text-xs text-rose-400 mt-2 font-medium">
                  {errorMsg}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-white font-bold text-xs uppercase tracking-wider shadow-lg transition flex items-center justify-center gap-2"
              style={{ backgroundColor: clientColor }}
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Client Portal</span>
            </button>
          </form>

          <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
            <span>WorkPulse Security</span>
            <button
              onClick={onExitPortal}
              className="text-slate-300 hover:text-white flex items-center gap-1 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Portal View
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] antialiased">
      {/* Top Banner & Control Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3.5 shadow-xs no-print">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onExitPortal}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
              title="Return to internal WorkPulse dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
            <div className="h-5 w-px bg-slate-200" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Client Stakeholder View
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
              title="Copy shareable link for this portal"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy Portal Link'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-white text-xs font-bold rounded-xl shadow-sm transition"
              style={{ backgroundColor: clientColor }}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto p-4 sm:p-8 space-y-6">
        {/* Brand Executive Header Card */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
          <div
            className="absolute top-0 left-0 w-full h-2"
            style={{ backgroundColor: clientColor }}
          />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shrink-0"
                style={{ backgroundColor: clientColor }}
              >
                {client?.name ? client.name.substring(0, 2).toUpperCase() : 'CP'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {client?.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Active Account</span>
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  {client?.category || 'Enterprise Account'} · Stakeholder Operations &amp; Performance Reporting
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                  <span>Operator: <b className="text-slate-700">Akhtar Ali</b></span>
                  <span>•</span>
                  <span>Contact: {client?.contactPerson || 'Account Executive'}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs space-y-1.5 min-w-[240px]">
              <div className="flex items-center justify-between text-slate-500">
                <span>Account Status:</span>
                <span className="font-bold text-slate-800">Verified &amp; Synced</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Total Deliverables:</span>
                <span className="font-bold text-slate-800">{clientTasks.length} tasks</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Completion Rate:</span>
                <span className="font-bold text-emerald-600">
                  {clientTasks.length ? Math.round((completedTasks.length / clientTasks.length) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* High-Level Executive KPI Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>Time Invested</span>
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-3xl font-black text-slate-900 mt-3 mb-1">
              {formatNum(totalHours, 1)}h
            </div>
            <p className="text-xs text-slate-400">
              Total dedicated hours logged
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>Completed Outputs</span>
              <Sparkles className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-3xl font-black text-slate-900 mt-3 mb-1">
              {completedTasks.length}
            </div>
            <p className="text-xs text-slate-400">
              {totalOutputs} creative/social assets delivered
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>Total Reach / Impressions</span>
              <TrendingUp className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-3xl font-black text-slate-900 mt-3 mb-1">
              {formatNum(totalImpressions || totalReach)}
            </div>
            <p className="text-xs text-slate-400">
              Audience campaign impressions
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>Leads &amp; Inquiries</span>
              <Target className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-3xl font-black text-slate-900 mt-3 mb-1">
              {totalLeads}
            </div>
            <p className="text-xs text-slate-400">
              {totalConversions} client conversions recorded
            </p>
          </div>
        </section>

        {/* Completed Deliverables Table (Read-Only) */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Completed Deliverables &amp; Output Register
              </h2>
              <p className="text-xs text-slate-500">
                Audited list of verified work delivered for {client?.name}.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-xl">
              {completedTasks.length} Completed
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Deliverable Title</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Channel</th>
                  <th className="py-2.5 px-3 text-right">Hours Logged</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {completedTasks.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400 text-xs">
                      No completed deliverables recorded yet for this period.
                    </td>
                  </tr>
                ) : (
                  completedTasks.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-3 font-mono text-slate-500 font-semibold whitespace-nowrap">
                        {t.date}
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-800">
                        {t.title}
                        {t.notes && (
                          <div className="text-[11px] font-normal text-slate-500 mt-0.5">
                            {t.notes}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                        {t.category}
                      </td>
                      <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                        <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">
                          {t.platform || 'General'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-800">
                        {t.actual || 0}h
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Delivered</span>
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Active Projects & Pipeline Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Projects Pipeline */}
          <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Strategic Deliverables &amp; Roadmap</span>
              </h2>
              <span className="text-xs font-bold text-slate-500">
                {clientProjects.length} Active
              </span>
            </div>

            <div className="space-y-3">
              {clientProjects.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">
                  No active project milestones listed.
                </p>
              ) : (
                clientProjects.map((p) => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-3 text-xs"
                  >
                    <div>
                      <b className="text-slate-900 font-bold block">{p.title}</b>
                      {p.notes && (
                        <p className="text-slate-500 text-[11px] mt-1">{p.notes}</p>
                      )}
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold text-[10px] uppercase whitespace-nowrap">
                      {p.stage}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Planned Content Queue */}
          <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-600" />
                <span>Scheduled Content Queue</span>
              </h2>
              <span className="text-xs font-bold text-slate-500">
                {clientCalendar.length} Scheduled
              </span>
            </div>

            <div className="space-y-3">
              {clientCalendar.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">
                  No upcoming calendar items scheduled yet.
                </p>
              ) : (
                clientCalendar.slice(0, 5).map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <b className="text-slate-800 font-bold block">{c.title}</b>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {c.date} · {c.platform} ({c.type || 'Post'})
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                      {c.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Footer info */}
        <footer className="text-center pt-6 pb-8 border-t border-slate-200 text-xs text-slate-400">
          <p>
            WorkPulse Client Performance Portal · Designed and managed by Akhtar Ali · Enterprise Operations Hub
          </p>
        </footer>
      </main>
    </div>
  );
}

