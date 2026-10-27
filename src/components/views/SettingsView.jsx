import React, { useState, useEffect } from 'react';
import {
  Save,
  Download,
  Upload,
  Database,
  Trash2,
  Send,
  Globe,
  Lock,
  Mail,
  Zap,
  Check,
  Copy,
  Plus,
  ShieldCheck,
  Building
} from 'lucide-react';
import { DEFAULT_CLIENTS } from '../../constants/dashboardConfig';

export default function SettingsView({
  settings,
  clients = DEFAULT_CLIENTS,
  onSaveSettings,
  onDownloadBackup,
  onRestoreBackup,
  onLoadSampleData,
  onClearAllToEmpty,
  onTestSlackWebhook
}) {
  const [form, setForm] = useState(settings);
  const [testSlackLoading, setTestSlackLoading] = useState(false);
  const [copiedClientId, setCopiedClientId] = useState(null);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveSettings(form);
  };

  const handleTestSlack = async () => {
    if (!onTestSlackWebhook) return;
    setTestSlackLoading(true);
    await onTestSlackWebhook(form.slackWebhookUrl);
    setTestSlackLoading(false);
  };

  const handleCopyPortalLink = (clientName, clientId) => {
    const url = `${window.location.origin}/?portal=${encodeURIComponent(clientName)}`;
    navigator.clipboard?.writeText(url);
    setCopiedClientId(clientId);
    setTimeout(() => setCopiedClientId(null), 2500);
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-[#172033] dark:text-white tracking-tight">
          Settings, Integrations &amp; Portals
        </h2>
        <p className="text-xs text-[#667085] dark:text-slate-400 mt-0.5">
          Control your workday assumptions, Slack webhook automations, client stakeholder portals, and data backups.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Workday & Shift Settings */}
        <article className="lg:col-span-7 bg-white dark:bg-[#162033] border border-[#e5eaf2] dark:border-slate-800 rounded-3xl p-6 shadow-xs">
          <h3 className="text-sm font-bold text-[#172033] dark:text-white mb-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span>Workday &amp; Shift Targets</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
              <div className="grid gap-1.5">
                <label
                  htmlFor="workStart"
                  className="text-[11px] text-[#667085] dark:text-slate-400 font-bold"
                >
                  Work starts
                </label>
                <input
                  id="workStart"
                  type="time"
                  value={form.start || '11:00'}
                  onChange={(e) => setForm({ ...form, start: e.target.value })}
                  className="w-full border border-[#e5eaf2] dark:border-slate-700 rounded-xl p-2.5 bg-white dark:bg-slate-900 text-[#172033] dark:text-white outline-none focus:border-[#3157d5]"
                />
              </div>

              <div className="grid gap-1.5">
                <label
                  htmlFor="workEnd"
                  className="text-[11px] text-[#667085] dark:text-slate-400 font-bold"
                >
                  Work ends
                </label>
                <input
                  id="workEnd"
                  type="time"
                  value={form.end || '17:00'}
                  onChange={(e) => setForm({ ...form, end: e.target.value })}
                  className="w-full border border-[#e5eaf2] dark:border-slate-700 rounded-xl p-2.5 bg-white dark:bg-slate-900 text-[#172033] dark:text-white outline-none focus:border-[#3157d5]"
                />
              </div>

              <div className="grid gap-1.5">
                <label
                  htmlFor="breakStart"
                  className="text-[11px] text-[#667085] dark:text-slate-400 font-bold"
                >
                  Break starts
                </label>
                <input
                  id="breakStart"
                  type="time"
                  value={form.breakStart || '13:30'}
                  onChange={(e) =>
                    setForm({ ...form, breakStart: e.target.value })
                  }
                  className="w-full border border-[#e5eaf2] dark:border-slate-700 rounded-xl p-2.5 bg-white dark:bg-slate-900 text-[#172033] dark:text-white outline-none focus:border-[#3157d5]"
                />
              </div>

              <div className="grid gap-1.5">
                <label
                  htmlFor="breakEnd"
                  className="text-[11px] text-[#667085] dark:text-slate-400 font-bold"
                >
                  Break ends
                </label>
                <input
                  id="breakEnd"
                  type="time"
                  value={form.breakEnd || '14:30'}
                  onChange={(e) =>
                    setForm({ ...form, breakEnd: e.target.value })
                  }
                  className="w-full border border-[#e5eaf2] dark:border-slate-700 rounded-xl p-2.5 bg-white dark:bg-slate-900 text-[#172033] dark:text-white outline-none focus:border-[#3157d5]"
                />
              </div>

              <div className="grid gap-1.5">
                <label
                  htmlFor="weeklyGoal"
                  className="text-[11px] text-[#667085] dark:text-slate-400 font-bold"
                >
                  Weekly task goal
                </label>
                <input
                  id="weeklyGoal"
                  type="number"
                  min="1"
                  value={form.weeklyGoal || 25}
                  onChange={(e) =>
                    setForm({ ...form, weeklyGoal: e.target.value })
                  }
                  className="w-full border border-[#e5eaf2] dark:border-slate-700 rounded-xl p-2.5 bg-white dark:bg-slate-900 text-[#172033] dark:text-white outline-none focus:border-[#3157d5]"
                />
              </div>

              <div className="grid gap-1.5">
                <label
                  htmlFor="monthlyOutputGoal"
                  className="text-[11px] text-[#667085] dark:text-slate-400 font-bold"
                >
                  Monthly output goal
                </label>
                <input
                  id="monthlyOutputGoal"
                  type="number"
                  min="1"
                  value={form.monthlyOutputGoal || 80}
                  onChange={(e) =>
                    setForm({ ...form, monthlyOutputGoal: e.target.value })
                  }
                  className="w-full border border-[#e5eaf2] dark:border-slate-700 rounded-xl p-2.5 bg-white dark:bg-slate-900 text-[#172033] dark:text-white outline-none focus:border-[#3157d5]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#3157d5] hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
              >
                <Save className="w-4 h-4" />
                <span>Save Workday Settings</span>
              </button>
            </div>
          </form>
        </article>

        {/* Slack & Automated Webhooks Dispatch */}
        <article className="lg:col-span-5 bg-white dark:bg-[#162033] border border-[#e5eaf2] dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#172033] dark:text-white mb-1 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Slack &amp; Notification Automations</span>
            </h3>
            <p className="text-xs text-[#667085] dark:text-slate-400 leading-relaxed mb-4">
              Connect your company Slack channel to automatically dispatch 1-click End-of-Day (EOD) reports.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label
                  htmlFor="slackWebhookUrl"
                  className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1"
                >
                  Slack Incoming Webhook URL
                </label>
                <input
                  id="slackWebhookUrl"
                  type="url"
                  value={form.slackWebhookUrl || ''}
                  onChange={(e) =>
                    setForm({ ...form, slackWebhookUrl: e.target.value })
                  }
                  placeholder="https://hooks.slack.com/services/..."
                  className="w-full border border-[#e5eaf2] dark:border-slate-700 rounded-xl p-2.5 bg-white dark:bg-slate-900 text-[#172033] dark:text-white outline-none focus:border-[#3157d5] font-mono text-xs"
                />
              </div>

              <div>
                <label
                  htmlFor="notificationEmail"
                  className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1"
                >
                  Management EOD Digest Email
                </label>
                <input
                  id="notificationEmail"
                  type="email"
                  value={form.notificationEmail || ''}
                  onChange={(e) =>
                    setForm({ ...form, notificationEmail: e.target.value })
                  }
                  placeholder="management@timeglobaltech.com"
                  className="w-full border border-[#e5eaf2] dark:border-slate-700 rounded-xl p-2.5 bg-white dark:bg-slate-900 text-[#172033] dark:text-white outline-none focus:border-[#3157d5] text-xs"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleTestSlack}
              disabled={testSlackLoading || !form.slackWebhookUrl}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#4a154b] hover:bg-[#611f69] text-white text-xs font-bold rounded-xl shadow-xs transition disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{testSlackLoading ? 'Testing...' : 'Test Slack Ping'}</span>
            </button>

            <button
              type="button"
              onClick={() => onSaveSettings(form)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Integrations</span>
            </button>
          </div>
        </article>
      </div>

      {/* Shareable Client Portals Directory */}
      <article className="bg-white dark:bg-[#162033] border border-[#e5eaf2] dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-[#172033] dark:text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-500" />
              <span>Shareable Client Stakeholder Portals</span>
            </h3>
            <p className="text-xs text-[#667085] dark:text-slate-400">
              Each managed brand has a dedicated view-only URL. Stakeholders can audit their deliverables, hours and KPIs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Master Portal Access:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 font-bold text-xs border border-emerald-200 dark:border-emerald-800">
              Active
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {clients.map((c) => {
            const hasPassword = Boolean(c.portalPassword && c.portalPassword.trim() !== '');
            const isCopied = copiedClientId === c.id;
            return (
              <div
                key={c.id || c.name}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <b className="font-bold text-slate-800 dark:text-slate-100 truncate">
                      {c.name}
                    </b>
                    {hasPassword ? (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                        <Lock className="w-2.5 h-2.5" />
                        <span>Passcode</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                        <span>Public</span>
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {c.category || 'Operations Account'}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-2">
                  <a
                    href={`/?portal=${encodeURIComponent(c.name)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Open View ↗
                  </a>

                  <button
                    onClick={() => handleCopyPortalLink(c.name, c.id)}
                    className="p-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-[10px] font-bold hover:bg-slate-100 transition flex items-center gap-1"
                    title="Copy direct portal link"
                  >
                    {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{isCopied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </article>

      {/* Data Backup & Disaster Recovery */}
      <article className="bg-white dark:bg-[#162033] border border-[#e5eaf2] dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-[#172033] dark:text-white mb-1 flex items-center gap-2">
            <Database className="w-4 h-4 text-purple-600" />
            <span>Database Backup &amp; Disaster Recovery</span>
          </h3>
          <p className="text-xs text-[#667085] dark:text-slate-400 leading-relaxed">
            Export a full JSON backup of your tasks, metrics, clients and calendar. Import a backup anytime to restore your data.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onDownloadBackup}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#3157d5] hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
          >
            <Download className="w-4 h-4" />
            <span>Download Full Backup JSON</span>
          </button>

          <label
            htmlFor="restoreFile"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-[#e5eaf2] dark:border-slate-700 text-[#26324a] dark:text-slate-200 text-xs font-bold rounded-xl shadow-xs cursor-pointer transition"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Import Backup JSON</span>
          </label>
          <input
            id="restoreFile"
            type="file"
            accept=".json,application/json"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                onRestoreBackup(file);
                e.target.value = '';
              }
            }}
          />

          <button
            onClick={onLoadSampleData}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition"
          >
            <Database className="w-3.5 h-3.5 text-blue-500" />
            <span>Load Sample Data</span>
          </button>

          <button
            onClick={onClearAllToEmpty}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 text-rose-700 dark:text-rose-400 text-xs font-bold rounded-xl border border-rose-200 dark:border-rose-900/40 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset to Clean Workspace</span>
          </button>
        </div>
      </article>
    </section>
  );
}
