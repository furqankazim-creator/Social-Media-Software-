import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Zap,
  Play,
  Pause,
  RotateCcw,
  Clock,
  CheckCircle2,
  ListPlus,
  Copy,
  Check,
  Server,
  RefreshCw,
  Send,
  Coffee,
  CalendarCheck,
  Mail,
  MessageCircle
} from 'lucide-react';
import { BRAND_COLORS } from '../../constants/dashboardConfig';
import { formatMoney, formatNum, todayStr } from '../../utils/helpers';

export default function DailyAssistantView({
  tasks,
  calendar,
  settings,
  isBackendConnected,
  onRefreshBackend,
  onSyncTodayCalendarToTasks,
  onLogTimeToTask,
  onUpdateTaskStatus,
  onConvertCalendarToTask,
  onNavigate,
  onSendSlackEod
}) {
  const today = todayStr();

  // Filter tasks and calendar items for today
  const todayTasks = useMemo(
    () => tasks.filter((t) => t.date === today),
    [tasks, today]
  );
  const todayCalendar = useMemo(
    () => calendar.filter((c) => c.date === today),
    [calendar, today]
  );

  // Focus Timer state
  const [timerActive, setTimerActive] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [copiedEod, setCopiedEod] = useState(false);
  const [isSendingSlack, setIsSendingSlack] = useState(false);
  const [isTriggeringAuto, setIsTriggeringAuto] = useState(false);

  const handleTriggerAutoDispatch = async () => {
    setIsTriggeringAuto(true);
    try {
      const res = await fetch('/api/eod/trigger-auto-dispatch', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert('🚀 5:00 PM Auto-Dispatch executed successfully! Report delivered to Slack (# new-channel) and dispatched to proposal.tgi@gmail.com.');
      } else {
        alert('Auto-dispatch error: ' + (data.error || 'Failed'));
      }
    } catch (e) {
      alert('Error triggering dispatch: ' + e.message);
    } finally {
      setIsTriggeringAuto(false);
    }
  };

  useEffect(() => {
    let interval = null;
    if (timerActive) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleApplyTimerHours = () => {
    if (!selectedTaskId) {
      alert('Please select a task to log time against.');
      return;
    }
    const hours = Math.round((secondsElapsed / 3600) * 100) / 100;
    if (hours <= 0) {
      alert('Timer has not accumulated measurable hours yet.');
      return;
    }
    onLogTimeToTask(selectedTaskId, hours);
    setTimerActive(false);
    setSecondsElapsed(0);
  };

  // EOD Report calculation
  const completedToday = todayTasks.filter((t) => t.status === 'Completed');
  const inProgressToday = todayTasks.filter((t) => t.status === 'In progress');
  const totalHoursToday = todayTasks.reduce(
    (sum, t) => sum + Number(t.actual || 0),
    0
  );
  const totalOutputsToday = todayTasks.reduce(
    (sum, t) => sum + Number(t.output || 0),
    0
  );
  const totalSpendToday = todayTasks.reduce(
    (sum, t) => sum + Number(t.spend || 0),
    0
  );

  const eodReportText = useMemo(() => {
    const lines = [
      `📊 *WORKPULSE DAILY EOD REPORT*`,
      `📅 Date: ${today} | Operator: Akhtar Ali`,
      `⏱️ Productive Hours Logged: ${totalHoursToday}h (Planned: 5.0h)`,
      `📦 Deliverables Generated: ${totalOutputsToday}`,
      `💰 Task Ad Spend: PKR ${totalSpendToday.toLocaleString()}`,
      ``,
      `✅ *COMPLETED DELIVERABLES (${completedToday.length})*:`,
      completedToday.length > 0
        ? completedToday
            .map(
              (t) =>
                `• [${t.brand}] ${t.title} (${t.platform}) — ${t.actual}h logged${
                  t.notes ? ' | ' + t.notes : ''
                }`
            )
            .join('\n')
        : '• No completed tasks logged today.',
      ``,
      `🔄 *IN PROGRESS / ACTIVE (${inProgressToday.length})*:`,
      inProgressToday.length > 0
        ? inProgressToday
            .map(
              (t) =>
                `• [${t.brand}] ${t.title} (${t.platform}) — Due: ${t.due || 'Today'}`
            )
            .join('\n')
        : '• All scheduled items completed.',
      ``,
      `🎯 *CLIENT OPERATIONS SUMMARY*:`,
      `• MoneyMinds & Orgpyur: Executed within shared LinkedIn account guidelines.`,
      `• Time Global Tech: Profile & core initiatives progressing on target.`
    ];
    return lines.join('\n');
  }, [today, totalHoursToday, totalOutputsToday, totalSpendToday, completedToday, inProgressToday]);

  const handleCopyEod = () => {
    navigator.clipboard?.writeText(eodReportText);
    setCopiedEod(true);
    setTimeout(() => setCopiedEod(false), 2200);
  };

  const handleSendSlack = async () => {
    if (!onSendSlackEod) return;
    setIsSendingSlack(true);
    await onSendSlackEod({ reportText: eodReportText });
    setIsSendingSlack(false);
  };

  const handleSendEmail = () => {
    const to = settings?.notificationEmail || 'proposal.tgi@gmail.com';
    const subject = encodeURIComponent(`[WorkPulse EOD] Performance Report - ${today} (Akhtar Ali)`);
    const body = encodeURIComponent(eodReportText);

    // Open direct Gmail Web compose in a new tab
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${subject}&body=${body}`;
    const win = window.open(gmailUrl, '_blank');

    // Fallback to mailto protocol if popup was blocked
    if (!win || win.closed || typeof win.closed === 'undefined') {
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    }
  };

  const handleSendWhatsApp = () => {
    const text = encodeURIComponent(eodReportText);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  // Check which today calendar items are already in daily tasks
  const calendarSyncStatus = useMemo(() => {
    const taskTitles = new Set(todayTasks.map((t) => t.title.toLowerCase()));
    return todayCalendar.map((cal) => {
      const match = taskTitles.has(`[publish] ${cal.title}`.toLowerCase()) || taskTitles.has(cal.title.toLowerCase());
      return {
        ...cal,
        isSynced: match
      };
    });
  }, [todayCalendar, todayTasks]);

  const unsyncedCount = calendarSyncStatus.filter((c) => !c.isSynced).length;

  return (
    <section className="space-y-6">
      {/* HEADER & SERVER STATUS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#3157d5] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Work Assistant</span>
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                isBackendConnected
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              <Server className="w-3 h-3" />
              <span>{isBackendConnected ? 'Backend REST API Online' : 'Local Offline Mode'}</span>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#172033] tracking-tight mt-1">
            Daily Action Plan &amp; Execution Hub
          </h2>
          <p className="text-xs text-[#667085]">
            Bridging your content plan into daily tasks, live work focus timer, and instant EOD reporting.
          </p>
        </div>

        <div className="flex items-center gap-2 no-print">
          <button
            onClick={onRefreshBackend}
            className="inline-flex items-center gap-1 px-3 py-2 bg-white hover:bg-slate-50 border border-[#e5eaf2] text-[#26324a] text-xs font-bold rounded-xl shadow-sm"
            title="Reload from Express Backend Database"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Sync DB</span>
          </button>
          <button
            onClick={() => onSyncTodayCalendarToTasks(today)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#3157d5] hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm"
          >
            <Zap className="w-4 h-4" />
            <span>Sync Today's Content Plan ({unsyncedCount})</span>
          </button>
        </div>
      </div>

      {/* TODAY'S PLAN-TO-TASK PIPELINE CARD */}
      <article className="bg-white border border-[#e5eaf2] rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#e5eaf2]">
          <div>
            <h3 className="text-sm font-bold text-[#172033] flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-[#3157d5]" />
              <span>Today's Planned Content Pipeline ({todayCalendar.length})</span>
            </h3>
            <p className="text-xs text-[#667085]">
              Posts scheduled for today in the Content Planner. Click &quot;Add to Daily Tasks&quot; to log them into your operational workflow.
            </p>
          </div>

          {unsyncedCount > 0 ? (
            <button
              onClick={() => onSyncTodayCalendarToTasks(today)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200 transition-colors"
            >
              <ListPlus className="w-3.5 h-3.5" />
              <span>Sync All to Daily Tasks</span>
            </button>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold">
              <Check className="w-3 h-3" />
              <span>All Planned Posts Synced with Tasks</span>
            </span>
          )}
        </div>

        {todayCalendar.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#667085]">
            No social content planned for today yet.{' '}
            <button
              onClick={() => onNavigate('planner')}
              className="text-[#3157d5] font-bold hover:underline"
            >
              Open Content Planner →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {calendarSyncStatus.map((item) => {
              const brandColor = BRAND_COLORS[item.brand]?.hex || '#3157d5';
              return (
                <div
                  key={item.id}
                  style={{ borderLeftColor: brandColor }}
                  className="border border-[#e5eaf2] border-l-4 rounded-xl p-3.5 bg-slate-50/50 hover:bg-white transition-all space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[#667085] text-[11px]">
                      {item.time || '14:30'} · {item.platform}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#eef2ff] text-[#3949ab]">
                      {item.status}
                    </span>
                  </div>

                  <div className="font-bold text-[#172033] text-sm leading-snug">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-[#667085]">
                    {item.brand} · {item.type}
                  </div>

                  {item.copy && (
                    <p className="text-[11px] text-[#26324a] bg-white p-2 rounded border border-slate-100 truncate">
                      {item.copy}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 no-print">
                    {item.isSynced ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                        <Check className="w-3 h-3" />
                        <span>Synced to Tasks</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => onConvertCalendarToTask(item)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#3157d5] font-bold rounded-lg transition-colors text-[11px]"
                      >
                        <ListPlus className="w-3 h-3" />
                        <span>Add to Daily Tasks</span>
                      </button>
                    )}

                    <button
                      onClick={() => onNavigate('tasks')}
                      className="text-[11px] font-semibold text-[#667085] hover:text-[#172033]"
                    >
                      View Tasks →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </article>

      {/* TWO COLUMN: LIVE WORK TIMER & WORKDAY TIMELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Live Work Focus Timer */}
        <article className="lg:col-span-5 bg-white border border-[#e5eaf2] rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#172033] flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#3157d5]" />
                <span>Live Work Focus Timer</span>
              </h3>
              <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-[#3157d5]">
                Pomodoro Mode
              </span>
            </div>

            <p className="text-xs text-[#667085] mb-4">
              Select the active task you are working on, run the timer, and log actual hours directly into the database.
            </p>

            {/* Timer Display */}
            <div className="bg-[#0f172a] text-white rounded-2xl p-6 text-center space-y-3">
              <div className="text-4xl sm:text-5xl font-mono font-extrabold tracking-wider text-emerald-400">
                {formatTimer(secondsElapsed)}
              </div>
              <p className="text-xs text-slate-400">
                {timerActive ? '⚡ Active execution in progress...' : 'Timer paused'}
              </p>

              {/* Controls */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setTimerActive(!timerActive)}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                    timerActive
                      ? 'bg-amber-500 hover:bg-amber-600 text-white'
                      : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                  }`}
                >
                  {timerActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{timerActive ? 'Pause Timer' : 'Start Focus'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTimerActive(false);
                    setSecondsElapsed(0);
                  }}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Assign to Task */}
            <div className="mt-4 space-y-2 text-xs">
              <label className="font-bold text-[#667085] block">
                Assign accumulated time to task:
              </label>
              <select
                value={selectedTaskId}
                onChange={(e) => setSelectedTaskId(e.target.value)}
                className="w-full border border-[#e5eaf2] rounded-xl p-2.5 bg-white text-[#172033] font-medium outline-none"
              >
                <option value="">-- Choose today's task --</option>
                {todayTasks.map((t) => (
                  <option key={t.id} value={t.id}>
                    [{t.brand.slice(0, 14)}] {t.title} ({t.actual}h logged)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={handleApplyTimerHours}
            disabled={!selectedTaskId || secondsElapsed === 0}
            className="w-full py-2.5 bg-[#3157d5] hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
          >
            Log {((secondsElapsed / 3600) || 0).toFixed(2)}h to Selected Task
          </button>
        </article>

        {/* Workday Schedule Timeline & Shift Roadmap */}
        <article className="lg:col-span-7 bg-white border border-[#e5eaf2] rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#e5eaf2]">
            <div>
              <h3 className="text-sm font-bold text-[#172033]">
                Workday Shift Roadmap (11:00 AM – 5:00 PM)
              </h3>
              <p className="text-xs text-[#667085]">
                5 productive hours planned with structured breaks and brand focus blocks.
              </p>
            </div>
            <span className="font-mono text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
              {totalHoursToday}h / 5.0h Logged
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl border border-blue-200 bg-blue-50/40 flex items-start gap-3">
              <span className="font-mono font-bold text-[#3157d5] min-w-[110px]">
                11:00 – 12:30
              </span>
              <div>
                <b className="text-[#172033] block">Morning Deep Work &amp; Research</b>
                <span className="text-[#667085]">
                  Competitor research, LinkedIn carousels strategy, candidate screening for Orgpyur/MoneyMinds.
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-teal-200 bg-teal-50/40 flex items-start gap-3">
              <span className="font-mono font-bold text-[#0f9d8a] min-w-[110px]">
                12:30 – 1:30
              </span>
              <div>
                <b className="text-[#172033] block">Creative Asset Design &amp; Ad Reviews</b>
                <span className="text-[#667085]">
                  Visual carousel design, Legal Tech Pakistan Meta ad leads &amp; WhatsApp inquiry triage.
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/50 flex items-start gap-3">
              <span className="font-mono font-bold text-amber-700 min-w-[110px] flex items-center gap-1">
                <Coffee className="w-3.5 h-3.5" />
                <span>1:30 – 2:30</span>
              </span>
              <div>
                <b className="text-[#172033] block">Scheduled Lunch, Prayer &amp; Rest Break</b>
                <span className="text-[#667085]">
                  Protected break interval. Do not schedule active client calls or intensive deliverables.
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-purple-200 bg-purple-50/40 flex items-start gap-3">
              <span className="font-mono font-bold text-[#7756c8] min-w-[110px]">
                2:30 – 4:00
              </span>
              <div>
                <b className="text-[#172033] block">Publishing, Client Accounts &amp; Pipeline</b>
                <span className="text-[#667085]">
                  Publish approved LinkedIn posts, Time Global Tech case study updates, candidate follow-ups.
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
              <span className="font-mono font-bold text-[#172033] min-w-[110px]">
                4:00 – 5:00
              </span>
              <div>
                <b className="text-[#172033] block">Reporting, Comment Engagement &amp; Wrap-up</b>
                <span className="text-[#667085]">
                  Engage on LinkedIn comments, log actual hours in register, generate EOD report.
                </span>
              </div>
            </div>
          </div>
        </article>
      </div>

      {/* 1-CLICK END-OF-DAY (EOD) REPORT GENERATOR CARD */}
      <article className="bg-white border border-[#e5eaf2] rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#e5eaf2]">
          <div>
            <h3 className="text-sm font-bold text-[#172033] flex items-center gap-2">
              <Send className="w-4 h-4 text-emerald-600" />
              <span>Instant End-of-Day (EOD) Client &amp; Internal Report</span>
            </h3>
            <p className="text-xs text-[#667085]">
              Auto-generated report from today&apos;s real logged tasks. Ready to paste directly into Slack, WhatsApp or Email.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopyEod}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl shadow-xs transition-all"
              title="Copy formatted markdown text to clipboard"
            >
              {copiedEod ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedEod ? 'Copied!' : 'Copy Text'}</span>
            </button>

            <button
              onClick={handleSendSlack}
              disabled={isSendingSlack}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#4a154b] hover:bg-[#611f69] text-white text-xs font-bold rounded-xl shadow-xs transition-all disabled:opacity-50"
              title="Dispatch directly to Slack incoming webhook channel"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSendingSlack ? 'Sending...' : 'Dispatch to Slack'}</span>
            </button>

            <button
              onClick={handleSendEmail}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
              title={`Compose email to ${settings?.notificationEmail || 'proposal.tgi@gmail.com'}`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Gmail / Email</span>
            </button>

            <button
              onClick={handleSendWhatsApp}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold rounded-xl shadow-xs transition-all"
              title="Send formatted EOD report directly via WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>

        {/* AUTOMATED 5:00 PM DISPATCH STATUS BANNER */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-emerald-500/10 border border-blue-200/80 dark:border-blue-900/60 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <div>
              <span className="font-extrabold text-slate-900 dark:text-white mr-1.5">
                ⏰ Automated 5:00 PM Daily Dispatch:
              </span>
              <span className="text-slate-600 dark:text-slate-300">
                Automatically compiles &amp; sends report at <strong>5:00 PM (17:00)</strong> to <strong>{settings?.notificationEmail || 'proposal.tgi@gmail.com'}</strong> &amp; Slack <strong>(# new-channel)</strong>.
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleTriggerAutoDispatch}
            disabled={isTriggeringAuto}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-[11px] shadow-xs transition shrink-0 disabled:opacity-50"
            title="Simulate the automatic 5:00 PM daily dispatch right now"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>{isTriggeringAuto ? 'Dispatching...' : 'Test 5:00 PM Dispatch Now'}</span>
          </button>
        </div>

        <pre className="bg-[#f8fafc] border border-[#e5eaf2] rounded-xl p-4 text-xs font-mono text-[#172033] whitespace-pre-wrap leading-relaxed overflow-x-auto">
          {eodReportText}
        </pre>
      </article>
    </section>
  );
}

