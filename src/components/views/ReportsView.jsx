import React, { useState, useMemo } from 'react';
import { Download, Plus, Trash2, Edit3, RotateCcw, BarChart2, TrendingUp, Sparkles, Camera, Image as ImageIcon } from 'lucide-react';
import { BRANDS, PLATFORMS } from '../../constants/dashboardConfig';
import {
  formatMoney,
  formatNum,
  pct,
  periodBounds,
  todayStr
} from '../../utils/helpers';
import BrandBarChart from '../charts/BrandBarChart';
import MarketingTrendGraph from '../charts/MarketingTrendGraph';
import FunnelConversionChart from '../charts/FunnelConversionChart';
import ScreenshotExtractorModal from '../modals/ScreenshotExtractorModal';

const getInitialMetricForm = (defaultDate) => ({
  id: null,
  date: defaultDate || todayStr(),
  brand: 'Time Global Tech',
  platform: 'LinkedIn — shared account',
  reach: 0,
  impressions: 0,
  engagements: 0,
  clicks: 0,
  leads: 0,
  conversions: 0,
  spend: 0,
  cpc: '',
  ctr: '',
  notes: ''
});

export default function ReportsView({
  allTasks,
  allMetrics,
  filteredMetrics,
  periodDate,
  brandFilter,
  settings,
  onAddMetric,
  onDeleteMetric,
  onDownloadReport
}) {
  const [form, setForm] = useState(() => getInitialMetricForm(periodDate));
  const [isExtractorOpen, setIsExtractorOpen] = useState(false);

  const buildReport = (mode) => {
    const [start, end] = periodBounds(mode, periodDate || todayStr());
    const tasks = allTasks.filter(
      (t) =>
        t.date >= start &&
        t.date <= end &&
        (brandFilter === 'All' || t.brand === brandFilter)
    );
    const metrics = allMetrics.filter(
      (m) =>
        m.date >= start &&
        m.date <= end &&
        (brandFilter === 'All' || m.brand === brandFilter)
    );

    const all = tasks.length;
    const done = tasks.filter((t) => t.status === 'Completed').length;
    const hours = tasks.reduce((s, t) => s + Number(t.actual || 0), 0);
    const outputs = tasks.reduce((s, t) => s + Number(t.output || 0), 0);
    const taskSpend = tasks.reduce((s, t) => s + Number(t.spend || 0), 0);

    const reach = metrics.reduce((s, m) => s + Number(m.reach || 0), 0);
    const impressions = metrics.reduce(
      (s, m) => s + Number(m.impressions || 0),
      0
    );
    const engagements = metrics.reduce(
      (s, m) => s + Number(m.engagements || 0),
      0
    );
    const clicks = metrics.reduce((s, m) => s + Number(m.clicks || 0), 0);
    const leads = metrics.reduce((s, m) => s + Number(m.leads || 0), 0);
    const conversions = metrics.reduce(
      (s, m) => s + Number(m.conversions || 0),
      0
    );
    const metricSpend = metrics.reduce((s, m) => s + Number(m.spend || 0), 0);

    return {
      mode,
      start,
      end,
      all,
      done,
      rate: pct(done, all),
      hours,
      outputs,
      taskSpend,
      reach,
      impressions,
      engagements,
      clicks,
      leads,
      conversions,
      metricSpend
    };
  };

  const daily = useMemo(
    () => buildReport('daily'),
    [allTasks, allMetrics, periodDate, brandFilter]
  );
  const weekly = useMemo(
    () => buildReport('weekly'),
    [allTasks, allMetrics, periodDate, brandFilter]
  );
  const monthly = useMemo(
    () => buildReport('monthly'),
    [allTasks, allMetrics, periodDate, brandFilter]
  );

  const sortedMetrics = useMemo(() => {
    return [...filteredMetrics].sort((a, b) =>
      (b.date || '').localeCompare(a.date || '')
    );
  }, [filteredMetrics]);

  const handleReset = () => {
    setForm(getInitialMetricForm(periodDate));
  };

  const handleEditMetric = (m) => {
    setForm({
      id: m.id,
      date: m.date || todayStr(),
      brand: m.brand || 'Time Global Tech',
      platform: m.platform || 'LinkedIn — shared account',
      reach: m.reach ?? 0,
      impressions: m.impressions ?? 0,
      engagements: m.engagements ?? 0,
      clicks: m.clicks ?? 0,
      leads: m.leads ?? 0,
      conversions: m.conversions ?? 0,
      spend: m.spend ?? 0,
      cpc: m.cpc ?? '',
      ctr: m.ctr ?? '',
      notes: m.notes || ''
    });
    const el = document.getElementById('metricFormCard');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddMetric({
      id: form.id,
      date: form.date,
      brand: form.brand,
      platform: form.platform,
      reach: Number(form.reach || 0),
      impressions: Number(form.impressions || 0),
      engagements: Number(form.engagements || 0),
      clicks: Number(form.clicks || 0),
      leads: Number(form.leads || 0),
      conversions: Number(form.conversions || 0),
      spend: Number(form.spend || 0),
      cpc: form.cpc,
      ctr: form.ctr,
      notes: form.notes.trim()
    });
    handleReset();
  };

  const weeklyGoal = Number(settings?.weeklyGoal || 25);
  const monthlyOutputGoal = Number(settings?.monthlyOutputGoal || 80);

  const reportCards = [
    {
      title: 'Daily summary',
      label: daily.start,
      data: daily,
      goalText: null
    },
    {
      title: 'Weekly summary',
      label: `${weekly.start} – ${weekly.end}`,
      data: weekly,
      goalText: `Weekly task goal: ${weekly.done}/${weeklyGoal} (${Math.min(
        100,
        pct(weekly.done, weeklyGoal)
      ).toFixed(0)}%)`,
      goalPct: Math.min(100, pct(weekly.done, weeklyGoal))
    },
    {
      title: 'Monthly summary',
      label: new Date(monthly.start + 'T12:00:00').toLocaleDateString('en', {
        month: 'long',
        year: 'numeric'
      }),
      data: monthly,
      goalText: `Monthly output goal: ${monthly.outputs}/${monthlyOutputGoal} (${Math.min(
        100,
        pct(monthly.outputs, monthlyOutputGoal)
      ).toFixed(0)}%)`,
      goalPct: Math.min(100, pct(monthly.outputs, monthlyOutputGoal))
    }
  ];

  return (
    <section className="space-y-6">
      {/* TITLE & CSV EXPORT */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold text-[#172033] tracking-tight flex items-center gap-2">
            <span>Daily, weekly &amp; monthly reporting</span>
            <span className="text-xs font-bold text-[#3157d5] bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Interactive Analytics</span>
            </span>
          </h2>
          <p className="text-xs text-[#667085]">
            Visual graphs, performance bar charts, conversion funnels and marketing metrics.
          </p>
        </div>

        <div className="flex items-center gap-2.5 no-print">
          <button
            onClick={() => setIsExtractorOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02]"
            title="Upload or paste (Ctrl+V) analytics screenshots to auto-extract metrics"
          >
            <Sparkles className="w-4 h-4 text-cyan-200" />
            <span>AI Screenshot Extractor</span>
          </button>

          <button
            onClick={() => onDownloadReport([daily, weekly, monthly])}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl shadow-xs transition"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* EXECUTIVE SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reportCards.map((c) => (
          <article
            key={c.title}
            className="bg-white border border-[#e5eaf2] rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow fade-in-slide"
          >
            <div>
              <h3 className="text-sm font-bold text-[#172033]">{c.title}</h3>
              <p className="text-xs text-[#667085] mb-3">{c.label}</p>
              <div className="text-2xl font-extrabold text-[#172033] mb-3">
                {c.data.all} tasks
              </div>
              <ul className="list-disc pl-4 text-xs text-[#667085] space-y-1.5">
                <li>
                  Completed:{' '}
                  <b className="text-[#172033]">{c.data.done}</b> (
                  {c.data.rate.toFixed(1)}%)
                </li>
                <li>
                  Hours logged:{' '}
                  <b className="text-[#172033]">{formatNum(c.data.hours)}h</b>
                </li>
                <li>
                  Outputs: <b className="text-[#172033]">{c.data.outputs}</b>
                </li>
                <li>
                  Ad spend in tasks:{' '}
                  <b className="text-[#172033]">
                    {formatMoney(c.data.taskSpend)}
                  </b>
                </li>
                <li>
                  Reach / impressions:{' '}
                  <b className="text-[#172033]">
                    {formatNum(c.data.reach)} / {formatNum(c.data.impressions)}
                  </b>
                </li>
                <li>
                  Engagements / clicks:{' '}
                  <b className="text-[#172033]">
                    {formatNum(c.data.engagements)} / {formatNum(c.data.clicks)}
                  </b>
                </li>
                <li>
                  Leads / conversions:{' '}
                  <b className="text-[#172033]">
                    {formatNum(c.data.leads)} / {formatNum(c.data.conversions)}
                  </b>
                </li>
                <li>
                  Spend in KPI records:{' '}
                  <b className="text-[#172033]">
                    {formatMoney(c.data.metricSpend)}
                  </b>
                </li>
              </ul>
            </div>

            {c.goalText && (
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="text-[11px] font-bold text-[#172033] mb-1">
                  {c.goalText}
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0f9d8a] rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${c.goalPct}%` }}
                  />
                </div>
              </div>
            )}
          </article>
        ))}
      </div>

      {/* INTERACTIVE BAR CHARTS & TREND GRAPHS */}
      <div className="space-y-5">
        {/* Brand Workload Bar Chart */}
        <BrandBarChart tasks={allTasks} />

        {/* Two Columns: Marketing Trend Graph & Funnel Conversion Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <MarketingTrendGraph metrics={allMetrics} />
          <FunnelConversionChart metrics={allMetrics} />
        </div>
      </div>

      {/* PERFORMANCE KPIS FORM */}
      <div id="metricFormCard" className="no-print">
        <div className="mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-[#172033] dark:text-white tracking-tight">
              {form.id ? 'Edit performance KPI record' : 'Performance KPIs'}
            </h2>
            <p className="text-xs text-[#667085] dark:text-slate-400">
              Log performance separately by client and platform. MoneyMinds and
              Orgpyur activity uses the same shared LinkedIn account.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsExtractorOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold rounded-xl transition shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Scan Analytics Image</span>
          </button>
        </div>

        <article className="bg-white border border-[#e5eaf2] rounded-2xl p-5 shadow-sm fade-in-slide">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
              <div className="grid gap-1.5">
                <label
                  htmlFor="metricDate"
                  className="text-[11px] text-[#667085] font-bold"
                >
                  Report date
                </label>
                <input
                  id="metricDate"
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full border border-[#e5eaf2] rounded-xl p-2.5 bg-white text-[#172033] outline-none focus:border-[#3157d5]"
                />
              </div>

              <div className="grid gap-1.5">
                <label
                  htmlFor="metricBrand"
                  className="text-[11px] text-[#667085] font-bold"
                >
                  Brand / client
                </label>
                <select
                  id="metricBrand"
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  className="w-full border border-[#e5eaf2] rounded-xl p-2.5 bg-white text-[#172033] outline-none focus:border-[#3157d5]"
                >
                  {BRANDS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-1.5">
                <label
                  htmlFor="metricPlatform"
                  className="text-[11px] text-[#667085] font-bold"
                >
                  Platform / account
                </label>
                <select
                  id="metricPlatform"
                  value={form.platform}
                  onChange={(e) =>
                    setForm({ ...form, platform: e.target.value })
                  }
                  className="w-full border border-[#e5eaf2] rounded-xl p-2.5 bg-white text-[#172033] outline-none focus:border-[#3157d5]"
                >
                  {PLATFORMS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-1.5">
                <label
                  htmlFor="metricReach"
                  className="text-[11px] text-[#667085] font-bold"
                >
                  Reach
                </label>
                <input
                  id="metricReach"
                  type="number"
                  min="0"
                  value={form.reach}
                  onChange={(e) => setForm({ ...form, reach: e.target.value })}
                  className="w-full border border-[#e5eaf2] rounded-xl p-2.5 bg-white text-[#172033] outline-none focus:border-[#3157d5]"
                />
              </div>

              <div className="grid gap-1.5">
                <label
                  htmlFor="metricImpressions"
                  className="text-[11px] text-[#667085] font-bold"
                >
                  Impressions
                </label>
                <input
                  id="metricImpressions"
                  type="number"
                  min="0"
                  value={form.impressions}
                  onChange={(e) =>
                    setForm({ ...form, impressions: e.target.value })
                  }
                  className="w-full border border-[#e5eaf2] rounded-xl p-2.5 bg-white text-[#172033] outline-none focus:border-[#3157d5]"
                />
              </div>

              <div className="grid gap-1.5">
                <label
                  htmlFor="metricEngagements"
                  className="text-[11px] text-[#667085] font-bold"
                >
                  Engagements
                </label>
                <input
                  id="metricEngagements"
                  type="number"
                  min="0"
                  value={form.engagements}
                  onChange={(e) =>
                    setForm({ ...form, engagements: e.target.value })
                  }
                  className="w-full border border-[#e5eaf2] rounded-xl p-2.5 bg-white text-[#172033] outline-none focus:border-[#3157d5]"
                />
              </div>

              <div className="grid gap-1.5">
                <label
                  htmlFor="metricClicks"
                  className="text-[11px] text-[#667085] font-bold"
                >
                  Clicks
                </label>
                <input
                  id="metricClicks"
                  type="number"
                  min="0"
                  value={form.clicks}
                  onChange={(e) => setForm({ ...form, clicks: e.target.value })}
                  className="w-full border border-[#e5eaf2] rounded-xl p-2.5 bg-white text-[#172033] outline-none focus:border-[#3157d5]"
                />
              </div>

              <div className="grid gap-1.5">
                <label
                  htmlFor="metricLeads"
                  className="text-[11px] text-[#667085] font-bold"
                >
                  Leads
                </label>
                <input
                  id="metricLeads"
                  type="number"
                  min="0"
                  value={form.leads}
                  onChange={(e) => setForm({ ...form, leads: e.target.value })}
                  className="w-full border border-[#e5eaf2] rounded-xl p-2.5 bg-white text-[#172033] outline-none focus:border-[#3157d5]"
                />
              </div>

              <div className="grid gap-1.5">
                <label
                  htmlFor="metricConversions"
                  className="text-[11px] text-[#667085] font-bold"
                >
                  Conversions / clients
                </label>
                <input
                  id="metricConversions"
                  type="number"
                  min="0"
                  value={form.conversions}
                  onChange={(e) =>
                    setForm({ ...form, conversions: e.target.value })
                  }
                  className="w-full border border-[#e5eaf2] rounded-xl p-2.5 bg-white text-[#172033] outline-none focus:border-[#3157d5]"
                />
              </div>

              <div className="grid gap-1.5">
                <label
                  htmlFor="metricSpend"
                  className="text-[11px] text-[#667085] font-bold"
                >
                  Ad spend (PKR)
                </label>
                <input
                  id="metricSpend"
                  type="number"
                  min="0"
                  value={form.spend}
                  onChange={(e) => setForm({ ...form, spend: e.target.value })}
                  className="w-full border border-[#e5eaf2] rounded-xl p-2.5 bg-white text-[#172033] outline-none focus:border-[#3157d5]"
                />
              </div>

              <div className="grid gap-1.5">
                <label
                  htmlFor="metricCpc"
                  className="text-[11px] text-[#667085] font-bold"
                >
                  CPC (PKR, optional)
                </label>
                <input
                  id="metricCpc"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Auto from spend/clicks if blank"
                  value={form.cpc}
                  onChange={(e) => setForm({ ...form, cpc: e.target.value })}
                  className="w-full border border-[#e5eaf2] rounded-xl p-2.5 bg-white text-[#172033] outline-none focus:border-[#3157d5]"
                />
              </div>

              <div className="grid gap-1.5">
                <label
                  htmlFor="metricCtr"
                  className="text-[11px] text-[#667085] font-bold"
                >
                  CTR % (optional)
                </label>
                <input
                  id="metricCtr"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Auto from clicks/impressions"
                  value={form.ctr}
                  onChange={(e) => setForm({ ...form, ctr: e.target.value })}
                  className="w-full border border-[#e5eaf2] rounded-xl p-2.5 bg-white text-[#172033] outline-none focus:border-[#3157d5]"
                />
              </div>

              <div className="sm:col-span-2 grid gap-1.5">
                <label
                  htmlFor="metricNotes"
                  className="text-[11px] text-[#667085] font-bold"
                >
                  Notes / learning
                </label>
                <textarea
                  id="metricNotes"
                  rows={2}
                  placeholder="Best-performing content, lead quality, next optimization…"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full border border-[#e5eaf2] rounded-xl p-2.5 bg-white text-[#172033] outline-none focus:border-[#3157d5] resize-y"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#3157d5] hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>{form.id ? 'Save KPI changes' : 'Save KPI record'}</span>
              </button>

              {form.id && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-slate-50 border border-[#e5eaf2] text-[#26324a] text-xs font-bold rounded-xl shadow-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Cancel edit</span>
                </button>
              )}
            </div>
          </form>
        </article>
      </div>

      {/* SAVED MARKETING METRICS TABLE */}
      <div>
        <div className="mb-3">
          <h2 className="text-lg font-extrabold text-[#172033] tracking-tight">
            Saved marketing metrics ({sortedMetrics.length})
          </h2>
          <p className="text-xs text-[#667085]">
            CTR = clicks ÷ impressions. CPC = ad spend ÷ clicks. Engagement rate
            shown as engagements ÷ impressions.
          </p>
        </div>

        <div className="bg-white border border-[#e5eaf2] rounded-2xl overflow-hidden shadow-sm fade-in-slide">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left min-w-[960px]">
              <thead>
                <tr className="bg-[#fafbfe] border-b border-[#e5eaf2] text-[10px] uppercase tracking-wider text-[#667085]">
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Brand</th>
                  <th className="py-3 px-3">Platform</th>
                  <th className="py-3 px-3">Reach</th>
                  <th className="py-3 px-3">Impressions</th>
                  <th className="py-3 px-3">Engagements</th>
                  <th className="py-3 px-3">Clicks</th>
                  <th className="py-3 px-3">CTR</th>
                  <th className="py-3 px-3">CPC</th>
                  <th className="py-3 px-3">Leads</th>
                  <th className="py-3 px-3">Conversions</th>
                  <th className="py-3 px-3">Spend PKR</th>
                  <th className="py-3 px-3 text-right no-print">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5eaf2] text-xs">
                {sortedMetrics.length === 0 ? (
                  <tr>
                    <td
                      colSpan={13}
                      className="py-8 text-center text-[#667085]"
                    >
                      No KPI records saved for this period.
                    </td>
                  </tr>
                ) : (
                  sortedMetrics.map((m) => {
                    const ctr =
                      m.ctr !== '' && m.ctr != null
                        ? Number(m.ctr)
                        : pct(m.clicks, m.impressions);
                    const cpc =
                      m.cpc !== '' && m.cpc != null
                        ? Number(m.cpc)
                        : Number(m.clicks)
                        ? Number(m.spend || 0) / Number(m.clicks)
                        : 0;
                    return (
                      <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3 font-mono whitespace-nowrap">
                          {m.date}
                        </td>
                        <td className="py-3 px-3 font-bold text-[#172033]">
                          {m.brand}
                          {m.notes && (
                            <div className="text-[10px] font-normal text-[#667085] truncate max-w-[160px]">
                              {m.notes}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-3 text-[#667085]">
                          {m.platform}
                        </td>
                        <td className="py-3 px-3 font-mono">
                          {formatNum(m.reach)}
                        </td>
                        <td className="py-3 px-3 font-mono">
                          {formatNum(m.impressions)}
                        </td>
                        <td className="py-3 px-3 font-mono">
                          {formatNum(m.engagements)}
                        </td>
                        <td className="py-3 px-3 font-mono">
                          {formatNum(m.clicks)}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-[#3157d5]">
                          {ctr.toFixed(2)}%
                        </td>
                        <td className="py-3 px-3 font-mono">
                          {formatMoney(cpc)}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-[#0f9d8a]">
                          {formatNum(m.leads)}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-[#7756c8]">
                          {formatNum(m.conversions)}
                        </td>
                        <td className="py-3 px-3 font-mono">
                          {formatMoney(m.spend)}
                        </td>
                        <td className="py-3 px-3 text-right whitespace-nowrap no-print">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => handleEditMetric(m)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-[#e5eaf2] text-[#26324a] text-xs font-bold rounded-lg"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => onDeleteMetric(m.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-rose-50 border border-[#e5eaf2] text-rose-600 text-xs font-bold rounded-lg"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ScreenshotExtractorModal
        isOpen={isExtractorOpen}
        onClose={() => setIsExtractorOpen(false)}
        onSaveMetric={onAddMetric}
        onFillForm={(extracted) => {
          setForm((prev) => ({
            ...prev,
            ...extracted
          }));
          const el = document.getElementById('metricFormCard');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
      />
    </section>
  );
}
