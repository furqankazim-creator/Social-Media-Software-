import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  RotateCcw,
  Trash2,
  Edit3,
  CheckSquare,
  Copy,
  Check,
  Clock,
  Search,
  Calendar,
  ListPlus,
  Zap,
  ArrowRight,
  LayoutList,
  Kanban,
  Sparkles,
  TrendingUp,
  Package,
  Layers,
  ChevronDown,
  AlertCircle
} from 'lucide-react';
import {
  BRANDS,
  BRAND_COLORS,
  PLATFORMS,
  WORK_CATEGORIES
} from '../../constants/dashboardConfig';
import {
  formatMoney,
  formatNum,
  todayStr,
  timeMinutes
} from '../../utils/helpers';

const getInitialFormState = (defaultDate) => ({
  id: null,
  title: '',
  brand: 'Time Global Tech',
  platform: 'LinkedIn — shared account',
  category: 'Research & strategy',
  date: defaultDate || todayStr(),
  due: '',
  priority: 'Medium',
  status: 'Not started',
  start: '11:00',
  end: '12:00',
  estimate: 1,
  actual: 0,
  output: 0,
  spend: 0,
  notes: ''
});

export default function TasksView({
  filteredTasks,
  allCalendar = [],
  periodDate,
  editingTask,
  onClearEditingTask,
  onSaveTask,
  onDuplicateTask,
  onUpdateStatus,
  onConvertCalendarToTask,
  onSyncTodayCalendarToTasks,
  onEditTask,
  onDeleteTask,
  onClearCompleted,
  onNavigate
}) {
  const [form, setForm] = useState(() => getInitialFormState(periodDate));
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'kanban'
  const [isFormOpen, setIsFormOpen] = useState(true);

  const today = todayStr();

  // Find content planned for today in the Content Planner
  const todayPlannedContent = useMemo(() => {
    return allCalendar.filter((c) => c.date === today);
  }, [allCalendar, today]);

  // Check sync status with existing tasks
  const plannedContentWithSync = useMemo(() => {
    const existingTitles = new Set(
      filteredTasks.map((t) => t.title.toLowerCase())
    );
    return todayPlannedContent.map((c) => {
      const match =
        existingTitles.has(`[publish] ${c.title}`.toLowerCase()) ||
        existingTitles.has(c.title.toLowerCase());
      return {
        ...c,
        isSynced: match
      };
    });
  }, [todayPlannedContent, filteredTasks]);

  const unsyncedPlannedCount = plannedContentWithSync.filter(
    (c) => !c.isSynced
  ).length;

  // Task Summary KPI Stats
  const taskSummary = useMemo(() => {
    const total = filteredTasks.length;
    const completed = filteredTasks.filter((t) => t.status === 'Completed').length;
    const inProgress = filteredTasks.filter((t) => t.status === 'In progress').length;
    const blocked = filteredTasks.filter((t) => t.status === 'Blocked').length;
    const hours = filteredTasks.reduce((s, t) => s + Number(t.actual || 0), 0);
    const outputs = filteredTasks.reduce((s, t) => s + Number(t.output || 0), 0);
    const spend = filteredTasks.reduce((s, t) => s + Number(t.spend || 0), 0);
    const completionPct = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, inProgress, blocked, hours, outputs, spend, completionPct };
  }, [filteredTasks]);

  useEffect(() => {
    if (editingTask) {
      setForm({
        id: editingTask.id,
        title: editingTask.title || '',
        brand: editingTask.brand || 'Time Global Tech',
        platform: editingTask.platform || 'Other',
        category: editingTask.category || 'Research & strategy',
        date: editingTask.date || periodDate || todayStr(),
        due: editingTask.due || '',
        priority: editingTask.priority || 'Medium',
        status: editingTask.status || 'Not started',
        start: editingTask.start || '11:00',
        end: editingTask.end || '12:00',
        estimate: editingTask.estimate ?? 1,
        actual: editingTask.actual ?? 0,
        output: editingTask.output ?? 0,
        spend: editingTask.spend ?? 0,
        notes: editingTask.notes || ''
      });
      setIsFormOpen(true);
    }
  }, [editingTask, periodDate]);

  const statusCounts = useMemo(() => {
    const counts = {
      All: filteredTasks.length,
      'Not started': 0,
      'In progress': 0,
      Completed: 0,
      Blocked: 0
    };
    filteredTasks.forEach((t) => {
      if (counts[t.status] !== undefined) counts[t.status]++;
    });
    return counts;
  }, [filteredTasks]);

  const displayedTasks = useMemo(() => {
    return [...filteredTasks]
      .filter((t) => {
        const matchStatus =
          statusFilter === 'All' || t.status === statusFilter;
        const matchPriority =
          priorityFilter === 'All' || t.priority === priorityFilter;
        const matchQuery =
          !searchQuery ||
          (t.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (t.notes || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (t.category || '')
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (t.platform || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (t.brand || '').toLowerCase().includes(searchQuery.toLowerCase());
        return matchStatus && matchPriority && matchQuery;
      })
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  }, [filteredTasks, statusFilter, priorityFilter, searchQuery]);

  const handleReset = () => {
    setForm(getInitialFormState(periodDate));
    if (onClearEditingTask) onClearEditingTask();
  };

  const handleAutoCalcHours = () => {
    const mins = Math.max(0, timeMinutes(form.end) - timeMinutes(form.start));
    const hrs = Math.round((mins / 60) * 4) / 4;
    setForm((prev) => ({ ...prev, estimate: hrs, actual: hrs }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const ok = onSaveTask({
      ...form,
      title: form.title.trim(),
      estimate: Number(form.estimate || 0),
      actual: Number(form.actual || 0),
      output: Number(form.output || 0),
      spend: Number(form.spend || 0),
      notes: form.notes.trim()
    });
    if (ok) {
      handleReset();
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-900';
      case 'High':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-900';
      case 'Medium':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-900';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800';
      case 'In progress':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800';
      case 'Blocked':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-800';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    }
  };

  return (
    <section className="space-y-6">
      {/* SECTION HEADER & QUICK METRICS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#172033] dark:text-white tracking-tight flex items-center gap-2">
            <span>Daily Tasks &amp; Deliverables</span>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
              {filteredTasks.length} Logged
            </span>
          </h2>
          <p className="text-xs text-[#667085] dark:text-slate-400 mt-0.5">
            Operational task registry with client categorization, time tracking, outputs, and status workflow.
          </p>
        </div>

        {/* View Mode Toggle & Primary Add Task */}
        <div className="flex items-center gap-2.5 no-print">
          <div className="flex items-center bg-white dark:bg-slate-900 border border-[#e5eaf2] dark:border-slate-800 rounded-xl p-1 shadow-xs">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === 'table'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Table view"
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === 'kanban'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Kanban Board view"
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
          </div>

          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-blue-500/20 transition hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>{isFormOpen ? 'Hide Form' : 'New Task'}</span>
          </button>
        </div>
      </div>

      {/* TOP SUMMARY KPI STATS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Tasks Completion */}
        <div className="bg-white dark:bg-[#162033] border border-[#e5eaf2] dark:border-slate-800 rounded-2xl p-4.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#667085] dark:text-slate-400">Completion</span>
            <span className="p-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <CheckSquare className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-[#172033] dark:text-white">
              {taskSummary.completed} / {taskSummary.total}
            </div>
            <div className="mt-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-600 to-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${taskSummary.completionPct}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
              {taskSummary.completionPct}% completed ({taskSummary.inProgress} in progress)
            </span>
          </div>
        </div>

        {/* Card 2: Logged Hours */}
        <div className="bg-white dark:bg-[#162033] border border-[#e5eaf2] dark:border-slate-800 rounded-2xl p-4.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#667085] dark:text-slate-400">Shift Hours</span>
            <span className="p-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {taskSummary.hours}h
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
              Target: 5.0h shift (11:00 – 17:00)
            </span>
          </div>
        </div>

        {/* Card 3: Deliverables Published */}
        <div className="bg-white dark:bg-[#162033] border border-[#e5eaf2] dark:border-slate-800 rounded-2xl p-4.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#667085] dark:text-slate-400">Outputs</span>
            <span className="p-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <Package className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
              {taskSummary.outputs}
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
              Posts, carousels, articles &amp; docs
            </span>
          </div>
        </div>

        {/* Card 4: Ad Spend */}
        <div className="bg-white dark:bg-[#162033] border border-[#e5eaf2] dark:border-slate-800 rounded-2xl p-4.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#667085] dark:text-slate-400">Ad Spend</span>
            <span className="p-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-[#172033] dark:text-white">
              {formatMoney(taskSummary.spend)}
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
              Across paid campaigns
            </span>
          </div>
        </div>
      </div>

      {/* TODAY'S PLANNED CONTENT QUEUE BANNER */}
      {todayPlannedContent.length > 0 && (
        <article className="bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-teal-50/80 dark:from-blue-950/30 dark:via-indigo-950/20 dark:to-teal-950/30 border border-blue-200/80 dark:border-blue-900/60 rounded-3xl p-5 shadow-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-blue-500/20">
                <Calendar className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#172033] dark:text-white flex items-center gap-1.5">
                  <span>Today&apos;s Planned Content Queue ({todayPlannedContent.length})</span>
                  {unsyncedPlannedCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                      {unsyncedPlannedCount} unsynced
                    </span>
                  )}
                </h3>
                <p className="text-[11px] text-[#667085] dark:text-slate-400">
                  Content scheduled for today in the Content Planner. Click to add them as tasks in your register.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {unsyncedPlannedCount > 0 && (
                <button
                  type="button"
                  onClick={() => onSyncTodayCalendarToTasks(today)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#3157d5] hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Sync All ({unsyncedPlannedCount})</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => onNavigate('planner')}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-[#e5eaf2] dark:border-slate-800 text-[#26324a] dark:text-slate-200 text-xs font-bold rounded-xl shadow-xs"
              >
                <span>Planner</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            {plannedContentWithSync.map((item) => {
              const brandColor = BRAND_COLORS[item.brand]?.hex || '#3157d5';
              return (
                <div
                  key={item.id}
                  style={{ borderLeftColor: brandColor }}
                  className="bg-white dark:bg-[#162033] border border-[#e5eaf2] dark:border-slate-800 border-l-4 rounded-2xl p-3.5 shadow-xs flex flex-col justify-between space-y-2 text-xs"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-[#667085] dark:text-slate-400 font-mono">
                      <span>{item.time || '14:30'} · {item.platform}</span>
                      <span className="font-sans px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-[#3157d5] dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800">
                        {item.status}
                      </span>
                    </div>
                    <div className="font-bold text-[#172033] dark:text-white mt-1.5 leading-snug truncate" title={item.title}>
                      {item.title}
                    </div>
                    <div className="text-[10px] text-[#667085] dark:text-slate-400 truncate mt-0.5">
                      {item.brand}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    {item.isSynced ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        <Check className="w-3 h-3" />
                        <span>In Tasks Register</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onConvertCalendarToTask(item)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold rounded-lg text-[10px] transition"
                      >
                        <ListPlus className="w-3 h-3" />
                        <span>+ Add to Tasks</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </article>
      )}

      {/* ADD / EDIT TASK FORM CARD */}
      {isFormOpen && (
        <article className="bg-white dark:bg-[#162033] border border-[#e5eaf2] dark:border-slate-800 rounded-3xl p-6 shadow-xs no-print animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-[#172033] dark:text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <span>{form.id ? 'Edit Task / Deliverable' : 'Log New Task / Deliverable'}</span>
            </h3>

            {/* Quick Time Helper Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <button
                type="button"
                onClick={handleAutoCalcHours}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-[#3157d5] dark:text-blue-300 font-bold rounded-lg transition"
                title="Calculate hours from Start and End time"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Auto-calc hours</span>
              </button>
              {[0.5, 1, 1.5, 2].map((hr) => (
                <button
                  key={hr}
                  type="button"
                  onClick={() =>
                    setForm((f) => ({ ...f, actual: hr, estimate: hr }))
                  }
                  className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#172033] dark:text-slate-200 font-bold rounded-lg transition"
                >
                  {hr}h
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              {/* Title */}
              <div className="sm:col-span-2 grid gap-1.5">
                <label
                  htmlFor="taskTitle"
                  className="text-[11px] text-[#667085] dark:text-slate-400 font-bold"
                >
                  Task title *
                </label>
                <input
                  id="taskTitle"
                  required
                  placeholder="e.g., Create LinkedIn carousel or campaign review"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-[#e5eaf2] dark:border-slate-700 rounded-xl p-2.5 bg-white dark:bg-slate-900 text-[#172033] dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>

              {/* Brand */}
              <div className="grid gap-1.5">
                <label
                  htmlFor="taskBrand"
                  className="text-[11px] text-[#667085] dark:text-slate-400 font-bold"
                >
                  Brand / client *
                </label>
                <select
                  id="taskBrand"
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  className="w-full border border-[#e5eaf2] dark:border-slate-700 rounded-xl p-2.5 bg-white dark:bg-slate-900 text-[#172033] dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                >
                  {BRANDS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              {/* Platform */}
              <div className="grid gap-1.5">
                <label
                  htmlFor="taskPlatform"
                  className="text-[11px] text-[#667085] dark:text-slate-400 font-bold"
                >
                  Platform
                </label>
                <select
                  id="taskPlatform"
                  value={form.platform}
                  onChange={(e) => setForm({ ...form, platform: e.target.value })}
                  className="w-full border border-[#e5eaf2] dark:border-slate-700 rounded-xl p-2.5 bg-white dark:bg-slate-900 text-[#172033] dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                >
                  {PLATFORMS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div className="grid gap-1.5">
                <label
                  htmlFor="taskCategory"
                  className="text-[11px] text-[#667085] dark:text-slate-400 font-bold"
                >
                  Category
                </label>
                <select
                  id="taskCategory"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-[#e5eaf2] dark:border-slate-700 rounded-xl p-2.5 bg-white dark:bg-slate-900 text-[#172033] dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                >
                  {WORK_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div className="grid gap-1.5">
                <label
                  htmlFor="taskDate"
                  className="text-[11px] text-[#667085] dark:text-slate-400 font-bold"
                >
                  Date *
                </label>
                <input
                  id="taskDate"
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full border border-[#e5eaf2] dark:border-slate-700 rounded-xl p-2.5 bg-white dark:bg-slate-900 text-[#172033] dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>

              {/* Priority */}
              <div className="grid gap-1.5">
                <label
                  htmlFor="taskPriority"
                  className="text-[11px] text-[#667085] dark:text-slate-400 font-bold"
                >
                  Priority
                </label>
                <select
                  id="taskPriority"
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  className="w-full border border-[#e5eaf2] dark:border-slate-700 rounded-xl p-2.5 bg-white dark:bg-slate-900 text-[#172033] dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                >
                  <option>Medium</option>
                  <option>High</option>
                  <option>Low</option>
                  <option>Urgent</option>
                </select>
              </div>

              {/* Status */}
              <div className="grid gap-1.5">
                <label
                  htmlFor="taskStatus"
                  className="text-[11px] text-[#667085] dark:text-slate-400 font-bold"
                >
                  Status
                </label>
                <select
                  id="taskStatus"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full border border-[#e5eaf2] dark:border-slate-700 rounded-xl p-2.5 bg-white dark:bg-slate-900 text-[#172033] dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                >
                  <option>Not started</option>
                  <option>In progress</option>
                  <option>Completed</option>
                  <option>Blocked</option>
                </select>
              </div>

              {/* Time Range */}
              <div className="grid gap-1.5">
                <label
                  htmlFor="taskStart"
                  className="text-[11px] text-[#667085] dark:text-slate-400 font-bold"
                >
                  Time range (Start – End)
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    id="taskStart"
                    type="time"
                    min="11:00"
                    max="17:00"
                    value={form.start}
                    onChange={(e) => setForm({ ...form, start: e.target.value })}
                    className="w-1/2 border border-[#e5eaf2] dark:border-slate-700 rounded-xl p-2 bg-white dark:bg-slate-900 text-[#172033] dark:text-white outline-none text-xs"
                  />
                  <span className="text-slate-400">–</span>
                  <input
                    id="taskEnd"
                    type="time"
                    min="11:00"
                    max="17:00"
                    value={form.end}
                    onChange={(e) => setForm({ ...form, end: e.target.value })}
                    className="w-1/2 border border-[#e5eaf2] dark:border-slate-700 rounded-xl p-2 bg-white dark:bg-slate-900 text-[#172033] dark:text-white outline-none text-xs"
                  />
                </div>
              </div>

              {/* Actual Hours */}
              <div className="grid gap-1.5">
                <label
                  htmlFor="taskActual"
                  className="text-[11px] text-[#667085] dark:text-slate-400 font-bold"
                >
                  Actual hours logged
                </label>
                <input
                  id="taskActual"
                  type="number"
                  min="0"
                  max="24"
                  step="0.25"
                  value={form.actual}
                  onChange={(e) => setForm({ ...form, actual: e.target.value })}
                  className="w-full border border-[#e5eaf2] dark:border-slate-700 rounded-xl p-2.5 bg-white dark:bg-slate-900 text-[#172033] dark:text-white outline-none"
                />
              </div>

              {/* Outputs */}
              <div className="grid gap-1.5">
                <label
                  htmlFor="taskOutput"
                  className="text-[11px] text-[#667085] dark:text-slate-400 font-bold"
                >
                  Deliverable count
                </label>
                <input
                  id="taskOutput"
                  type="number"
                  min="0"
                  step="1"
                  value={form.output}
                  onChange={(e) => setForm({ ...form, output: e.target.value })}
                  className="w-full border border-[#e5eaf2] dark:border-slate-700 rounded-xl p-2.5 bg-white dark:bg-slate-900 text-[#172033] dark:text-white outline-none"
                />
              </div>

              {/* Ad Spend */}
              <div className="grid gap-1.5">
                <label
                  htmlFor="taskSpend"
                  className="text-[11px] text-[#667085] dark:text-slate-400 font-bold"
                >
                  Ad spend (PKR)
                </label>
                <input
                  id="taskSpend"
                  type="number"
                  min="0"
                  step="1"
                  value={form.spend}
                  onChange={(e) => setForm({ ...form, spend: e.target.value })}
                  className="w-full border border-[#e5eaf2] dark:border-slate-700 rounded-xl p-2.5 bg-white dark:bg-slate-900 text-[#172033] dark:text-white outline-none"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="grid gap-1.5">
              <label
                htmlFor="taskNotes"
                className="text-[11px] text-[#667085] dark:text-slate-400 font-bold"
              >
                Notes, deliverables link &amp; details
              </label>
              <textarea
                id="taskNotes"
                rows={2}
                placeholder="Include deliverable details, copy links, or specific results..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full border border-[#e5eaf2] dark:border-slate-700 rounded-xl p-2.5 bg-white dark:bg-slate-900 text-[#172033] dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-xs"
              />
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 border border-[#e5eaf2] dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-[#26324a] dark:text-slate-300 font-bold text-xs rounded-xl transition"
              >
                Clear
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition hover:scale-[1.02]"
              >
                {form.id ? 'Save Changes' : '+ Add Task'}
              </button>
            </div>
          </form>
        </article>
      )}

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#162033] border border-[#e5eaf2] dark:border-slate-800 rounded-3xl p-4 shadow-xs no-print">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {['All', 'Not started', 'In progress', 'Completed', 'Blocked'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  statusFilter === st
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {st} <span className="opacity-75">({statusCounts[st] ?? 0})</span>
              </button>
            ))}
          </div>

          {/* Search & Priority Filter & Clear Completed */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 border border-[#e5eaf2] dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search tasks, clients, notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none text-[#172033] dark:text-white placeholder-slate-400 w-36 sm:w-48"
              />
            </div>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900 border border-[#e5eaf2] dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-bold text-[#172033] dark:text-white outline-none cursor-pointer"
            >
              <option value="All">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            {onClearCompleted && (
              <button
                type="button"
                onClick={() => onClearCompleted(filteredTasks)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 text-xs font-bold rounded-xl transition"
                title="Remove completed tasks"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear Completed</span>
              </button>
            )}
          </div>
        </div>

        {/* VIEW MODE: TABLE OR KANBAN */}
        {viewMode === 'table' ? (
          /* TABLE VIEW */
          <div className="bg-white dark:bg-[#162033] border border-[#e5eaf2] dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left min-w-[1020px]">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-slate-900/60 border-b border-[#e5eaf2] dark:border-slate-800 text-[10px] uppercase font-bold tracking-wider text-[#667085] dark:text-slate-400">
                    <th className="py-3.5 px-4">Task / Outcome</th>
                    <th className="py-3.5 px-4">Brand / Client</th>
                    <th className="py-3.5 px-4">Platform</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Priority</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Hours</th>
                    <th className="py-3.5 px-4">Outputs</th>
                    <th className="py-3.5 px-4">Spend (PKR)</th>
                    <th className="py-3.5 px-4 text-right no-print">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5eaf2] dark:divide-slate-800 text-xs">
                  {displayedTasks.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-12 text-center text-slate-400 dark:text-slate-500">
                        No tasks match these filters. Use the form above to log a new task.
                      </td>
                    </tr>
                  ) : (
                    displayedTasks.map((t) => {
                      const brandColor = BRAND_COLORS[t.brand]?.hex || '#3157d5';
                      return (
                        <tr key={t.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors">
                          {/* Title & Notes */}
                          <td className="py-3.5 px-4 max-w-xs">
                            <span className="font-extrabold text-[#172033] dark:text-white block">
                              {t.title}
                            </span>
                            {t.notes && (
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate" title={t.notes}>
                                {t.notes}
                              </p>
                            )}
                          </td>

                          {/* Brand with colored chip */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: brandColor }} />
                              <span className="truncate max-w-[140px]">{t.brand}</span>
                            </span>
                          </td>

                          {/* Platform */}
                          <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                            {t.platform || 'Other'}
                          </td>

                          {/* Category */}
                          <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 dark:text-slate-400">
                            {t.category}
                          </td>

                          {/* Date */}
                          <td className="py-3.5 px-4 font-mono whitespace-nowrap text-slate-600 dark:text-slate-300">
                            {t.date}
                          </td>

                          {/* Priority Badge */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${getPriorityBadgeClass(t.priority)}`}>
                              {t.priority}
                            </span>
                          </td>

                          {/* Interactive Status Switcher */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <select
                              value={t.status}
                              onChange={(e) => onUpdateStatus(t.id, e.target.value)}
                              className={`px-2 py-1 rounded-lg text-xs font-bold border outline-none cursor-pointer transition ${getStatusBadgeClass(t.status)}`}
                            >
                              <option value="Not started">Not started</option>
                              <option value="In progress">In progress</option>
                              <option value="Completed">Completed</option>
                              <option value="Blocked">Blocked</option>
                            </select>
                          </td>

                          {/* Hours */}
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-700 dark:text-slate-200">
                            {formatNum(t.actual)}h
                          </td>

                          {/* Output */}
                          <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300">
                            {formatNum(t.output)}
                          </td>

                          {/* Spend */}
                          <td className="py-3.5 px-4 font-mono whitespace-nowrap text-slate-600 dark:text-slate-300">
                            {formatMoney(t.spend)}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right whitespace-nowrap no-print">
                            <div className="inline-flex items-center gap-1.5">
                              {t.status !== 'Completed' && (
                                <button
                                  type="button"
                                  onClick={() => onUpdateStatus(t.id, 'Completed')}
                                  className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 transition"
                                  title="Mark Completed"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => onDuplicateTask(t)}
                                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
                                title="Duplicate Task"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  onEditTask(t);
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
                                title="Edit Task"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => onDeleteTask(t.id)}
                                className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 transition"
                                title="Delete Task"
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
        ) : (
          /* KANBAN BOARD VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {['Not started', 'In progress', 'Completed', 'Blocked'].map((lane) => {
              const laneTasks = displayedTasks.filter((t) => t.status === lane);
              return (
                <div
                  key={lane}
                  className="bg-slate-50/70 dark:bg-slate-900/40 border border-[#e5eaf2] dark:border-slate-800/80 rounded-3xl p-4 flex flex-col space-y-3 min-h-[400px]"
                >
                  {/* Lane Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        lane === 'Completed' ? 'bg-emerald-500' :
                        lane === 'In progress' ? 'bg-blue-500 animate-pulse' :
                        lane === 'Blocked' ? 'bg-rose-500' : 'bg-slate-400'
                      }`} />
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                        {lane}
                      </h4>
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {laneTasks.length}
                    </span>
                  </div>

                  {/* Task Cards in Lane */}
                  <div className="space-y-2.5 flex-1 overflow-y-auto">
                    {laneTasks.length === 0 ? (
                      <div className="h-32 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center text-xs text-slate-400 dark:text-slate-500">
                        No tasks in {lane}
                      </div>
                    ) : (
                      laneTasks.map((t) => {
                        const brandColor = BRAND_COLORS[t.brand]?.hex || '#3157d5';
                        return (
                          <div
                            key={t.id}
                            style={{ borderLeftColor: brandColor }}
                            className="bg-white dark:bg-[#162033] border border-slate-200/80 dark:border-slate-800 border-l-4 rounded-2xl p-3.5 shadow-xs hover:shadow-md transition space-y-2"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate max-w-[140px]">
                                {t.brand}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${getPriorityBadgeClass(t.priority)}`}>
                                {t.priority}
                              </span>
                            </div>

                            <h5 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                              {t.title}
                            </h5>

                            {t.notes && (
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                                {t.notes}
                              </p>
                            )}

                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                              <span className="flex items-center gap-1 font-mono font-bold text-slate-700 dark:text-slate-300">
                                <Clock className="w-3 h-3 text-blue-500" />
                                {formatNum(t.actual)}h logged
                              </span>

                              <div className="flex items-center gap-1">
                                {lane !== 'Completed' && (
                                  <button
                                    onClick={() => onUpdateStatus(t.id, 'Completed')}
                                    className="p-1 rounded bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-600 dark:text-emerald-400"
                                    title="Mark completed"
                                  >
                                    <Check className="w-3 h-3" />
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    onEditTask(t);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }}
                                  className="p-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300"
                                  title="Edit"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
