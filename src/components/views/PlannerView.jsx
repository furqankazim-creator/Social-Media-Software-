import React, { useState, useMemo } from 'react';
import {
  Download,
  Calendar as CalendarIcon,
  Plus,
  RotateCcw,
  Edit3,
  Trash2,
  Eye,
  Copy,
  ListPlus,
  ChevronLeft,
  ChevronRight,
  LayoutList,
  CalendarDays,
  Kanban,
  Sparkles,
  CheckSquare,
  ArrowRight
} from 'lucide-react';
import {
  BRANDS,
  BRAND_COLORS,
  PLANNER_PLATFORMS,
  CONTENT_FORMATS,
  WORKFLOW_STATUSES,
  PRE_PUBLISH_CHECKLIST
} from '../../constants/dashboardConfig';
import { localDate, todayStr } from '../../utils/helpers';
import PostPreviewModal from '../modals/PostPreviewModal';

const CONTENT_TEMPLATES = [
  {
    label: 'LinkedIn Carousel',
    title: 'Value-Led Industry Carousel: Key Insights',
    brand: 'Time Global Tech',
    platform: 'LinkedIn',
    type: 'Carousel',
    status: 'Drafting',
    copy: 'Slide 1 (Hook): Stop losing efficiency to manual handoffs.\nSlide 2-4: Core framework & measurable outcomes.\nSlide 5 (CTA): Follow our page & comment "GUIDE" for the full checklist.'
  },
  {
    label: 'Hiring / Job Post',
    title: 'We Are Hiring: Growth & Technical Roles',
    brand: 'MoneyMinds Technologies Inc.',
    platform: 'LinkedIn',
    type: 'Static post',
    status: 'Needs review',
    copy: 'Role overview, key responsibilities, tech stack requirements, and application link. CTA: Apply via LinkedIn Jobs or send your CV.'
  },
  {
    label: 'Short Video / Reel',
    title: '45s Product & Service Walkthrough Reel',
    brand: 'Legal Tech Pakistan',
    platform: 'Instagram',
    type: 'Short video / Reel',
    status: 'Idea',
    copy: '0-3s Hook: Need fast, reliable legal support?\n3-35s: Step-by-step walkthrough.\n35-45s CTA: Click the link in bio or message us on WhatsApp.'
  },
  {
    label: 'Data Governance Post',
    title: 'Enterprise Data Governance & Compliance Spotlight',
    brand: 'Orgpyur Technologies Inc.',
    platform: 'LinkedIn',
    type: 'Carousel',
    status: 'Drafting',
    copy: '4-slide breakdown on modern data quality, security protocols, and regulatory compliance for scaling enterprises.'
  }
];

const getInitialPlannerForm = (defaultDate) => ({
  id: null,
  title: '',
  brand: 'Time Global Tech',
  platform: 'LinkedIn',
  date: defaultDate || todayStr(),
  time: '14:30',
  type: 'Static post',
  status: 'Idea',
  owner: 'Akhtar Ali',
  copy: ''
});

export default function PlannerView({
  calendar,
  plannerChecks = {},
  onTogglePlannerCheck,
  onSetAllPlannerChecks,
  onSaveCalendarItem,
  onUpdateCalendarStatus,
  onDuplicateCalendarItem,
  onConvertCalendarToTask,
  onDeleteCalendarItem,
  onExportCalendar
}) {
  const [viewMode, setViewMode] = useState('week'); // 'week' | 'month' | 'board'
  const [calendarStart, setCalendarStart] = useState(todayStr());
  const [selectedDayFilter, setSelectedDayFilter] = useState(null);
  const [calendarBrand, setCalendarBrand] = useState('All');
  const [calendarPlatform, setCalendarPlatform] = useState('All');
  const [calendarStatusFilter, setCalendarStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [form, setForm] = useState(() => getInitialPlannerForm(todayStr()));
  const [previewItem, setPreviewItem] = useState(null);

  // 7-day week dates
  const weekDates = useMemo(() => {
    const d = new Date((calendarStart || todayStr()) + 'T12:00:00');
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    const list = [];
    for (let i = 0; i < 7; i++) {
      const cur = new Date(d);
      cur.setDate(d.getDate() + i);
      list.push({
        dateStr: localDate(cur),
        dayName: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
        dayNum: cur.getDate(),
        monthShort: cur.toLocaleDateString('en', { month: 'short' })
      });
    }
    return list;
  }, [calendarStart]);

  // Monthly calendar grid dates
  const monthGrid = useMemo(() => {
    const d = new Date((calendarStart || todayStr()) + 'T12:00:00');
    const year = d.getFullYear();
    const month = d.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = (firstDay.getDay() + 6) % 7; // Monday = 0
    const totalDays = lastDay.getDate();

    const cells = [];
    for (let i = 0; i < startOffset; i++) {
      cells.push(null);
    }
    for (let day = 1; day <= totalDays; day++) {
      const cur = new Date(year, month, day);
      cells.push({
        dateStr: localDate(cur),
        dayNum: day
      });
    }
    return {
      monthLabel: firstDay.toLocaleDateString('en', {
        month: 'long',
        year: 'numeric'
      }),
      startStr: localDate(firstDay),
      endStr: localDate(lastDay),
      cells
    };
  }, [calendarStart]);

  // Navigate Week / Month
  const shiftPeriod = (deltaDays) => {
    const d = new Date((calendarStart || todayStr()) + 'T12:00:00');
    if (viewMode === 'month') {
      d.setMonth(d.getMonth() + (deltaDays > 0 ? 1 : -1));
    } else {
      d.setDate(d.getDate() + deltaDays);
    }
    setCalendarStart(localDate(d));
    setSelectedDayFilter(null);
  };

  // Filtered items based on active viewMode & filters
  const filteredItems = useMemo(() => {
    const start =
      viewMode === 'month' ? monthGrid.startStr : weekDates[0].dateStr;
    const end = viewMode === 'month' ? monthGrid.endStr : weekDates[6].dateStr;

    return calendar
      .filter((x) => {
        const inDateRange =
          viewMode === 'board'
            ? true
            : selectedDayFilter
            ? x.date === selectedDayFilter
            : x.date >= start && x.date <= end;
        const matchBrand =
          calendarBrand === 'All' || x.brand === calendarBrand;
        const matchPlatform =
          calendarPlatform === 'All' || (x.platform || '') === calendarPlatform;
        const matchStatus =
          calendarStatusFilter === 'All' || x.status === calendarStatusFilter;
        const matchQuery =
          !searchQuery ||
          (x.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (x.copy || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (x.owner || '').toLowerCase().includes(searchQuery.toLowerCase());
        return (
          inDateRange &&
          matchBrand &&
          matchPlatform &&
          matchStatus &&
          matchQuery
        );
      })
      .sort((a, b) =>
        ((a.date || '') + (a.time || '')).localeCompare(
          (b.date || '') + (b.time || '')
        )
      );
  }, [
    calendar,
    viewMode,
    weekDates,
    monthGrid,
    selectedDayFilter,
    calendarBrand,
    calendarPlatform,
    calendarStatusFilter,
    searchQuery
  ]);

  // Summary counters for the planner
  const summaryStats = useMemo(() => {
    const total = filteredItems.length;
    const drafting = filteredItems.filter((i) =>
      ['Idea', 'Drafting', 'Needs review'].includes(i.status)
    ).length;
    const scheduled = filteredItems.filter((i) =>
      ['Approved', 'Scheduled'].includes(i.status)
    ).length;
    const published = filteredItems.filter(
      (i) => i.status === 'Published'
    ).length;
    return { total, drafting, scheduled, published };
  }, [filteredItems]);

  const handleResetForm = () => {
    setForm(getInitialPlannerForm(selectedDayFilter || calendarStart || todayStr()));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.date) return;
    onSaveCalendarItem({
      ...form,
      title: form.title.trim(),
      owner: form.owner.trim(),
      copy: form.copy.trim()
    });
    setCalendarStart(form.date);
    setForm(getInitialPlannerForm(form.date));
  };

  const handleEdit = (item) => {
    setForm({
      id: item.id,
      title: item.title || '',
      brand: item.brand || 'Time Global Tech',
      platform: item.platform || 'LinkedIn',
      date: item.date || todayStr(),
      time: item.time || '14:30',
      type: item.type || 'Static post',
      status: item.status || 'Idea',
      owner: item.owner || '',
      copy: item.copy || ''
    });
    const el = document.getElementById('plannerFormCard');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleApplyTemplate = (tpl) => {
    setForm((prev) => ({
      ...prev,
      title: tpl.title,
      brand: tpl.brand,
      platform: tpl.platform,
      type: tpl.type,
      status: tpl.status,
      copy: tpl.copy
    }));
  };

  const checkedCount = PRE_PUBLISH_CHECKLIST.filter(
    (i) => !!plannerChecks[i.id]
  ).length;

  return (
    <section className="space-y-6">
      {/* POST PREVIEW MODAL */}
      <PostPreviewModal
        item={previewItem}
        onClose={() => setPreviewItem(null)}
        onEdit={handleEdit}
        onUpdateStatus={onUpdateCalendarStatus}
        onConvertToTask={onConvertCalendarToTask}
      />

      {/* HEADER & VIEW SWITCHER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#172033] dark:text-white tracking-tight flex items-center gap-2">
            <span>Content Planning &amp; Publishing Calendar</span>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
              {summaryStats.total} Planned
            </span>
          </h2>
          <p className="text-xs text-[#667085] dark:text-slate-400 mt-0.5">
            Plan campaigns ahead, preview posts, sync to daily tasks, and manage publishing queues across all brands.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 no-print">
          {/* View Mode Switcher */}
          <div className="inline-flex bg-white dark:bg-slate-900 border border-[#e5eaf2] dark:border-slate-800 rounded-xl p-1 shadow-xs">
            <button
              onClick={() => setViewMode('week')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'week'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span>Weekly Queue</span>
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'month'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Monthly Grid</span>
            </button>
            <button
              onClick={() => setViewMode('board')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'board'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Workflow Board</span>
            </button>
          </div>

          <button
            onClick={() => {
              setCalendarStart(todayStr());
              setSelectedDayFilter(null);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-[#e5eaf2] dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl shadow-xs transition"
          >
            <CalendarIcon className="w-3.5 h-3.5 text-blue-500" />
            <span>Today</span>
          </button>

          <button
            onClick={onExportCalendar}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-[#e5eaf2] dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl shadow-xs transition"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* PLANNER KPI SUMMARY MINI-CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white dark:bg-[#162033] border border-[#e5eaf2] dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            Planned in View
          </span>
          <strong className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1 block">
            {summaryStats.total}
          </strong>
        </div>
        <div className="bg-white dark:bg-[#162033] border border-[#e5eaf2] dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
            Drafting / Review
          </span>
          <strong className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono mt-1 block">
            {summaryStats.drafting}
          </strong>
        </div>
        <div className="bg-white dark:bg-[#162033] border border-[#e5eaf2] dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
            Approved &amp; Scheduled
          </span>
          <strong className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono mt-1 block">
            {summaryStats.scheduled}
          </strong>
        </div>
        <div className="bg-white dark:bg-[#162033] border border-[#e5eaf2] dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
            Published Live
          </span>
          <strong className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1 block">
            {summaryStats.published}
          </strong>
        </div>
      </div>

      {/* CALENDAR STRIP OR MONTH GRID CARD */}
      <div className="bg-white border border-[#e5eaf2] rounded-2xl p-5 shadow-sm space-y-4">
        {/* Period Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => shiftPeriod(-7)}
              className="p-2 rounded-xl border border-[#e5eaf2] hover:bg-slate-50 text-[#172033]"
              title="Previous period"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-extrabold text-[#172033]">
              {viewMode === 'month'
                ? monthGrid.monthLabel
                : `Week of ${weekDates[0].dateStr} – ${weekDates[6].dateStr}`}
            </span>
            <button
              onClick={() => shiftPeriod(7)}
              className="p-2 rounded-xl border border-[#e5eaf2] hover:bg-slate-50 text-[#172033]"
              title="Next period"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {selectedDayFilter && (
              <button
                onClick={() => setSelectedDayFilter(null)}
                className="ml-2 px-2.5 py-1 rounded-lg bg-blue-50 text-[#3157d5] text-xs font-bold hover:bg-blue-100"
              >
                Showing {selectedDayFilter} ✕
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 no-print">
            <input
              type="text"
              placeholder="Search title, caption, owner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-[#e5eaf2] rounded-xl px-3 py-1.5 text-xs outline-none focus:border-[#3157d5]"
            />

            <select
              value={calendarBrand}
              onChange={(e) => setCalendarBrand(e.target.value)}
              className="border border-[#e5eaf2] rounded-xl px-2.5 py-1.5 text-xs font-semibold text-[#172033] bg-white outline-none cursor-pointer"
            >
              <option value="All">All brands</option>
              {BRANDS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>

            <select
              value={calendarPlatform}
              onChange={(e) => setCalendarPlatform(e.target.value)}
              className="border border-[#e5eaf2] rounded-xl px-2.5 py-1.5 text-xs font-semibold text-[#172033] bg-white outline-none cursor-pointer"
            >
              <option value="All">All platforms</option>
              {PLANNER_PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            <select
              value={calendarStatusFilter}
              onChange={(e) => setCalendarStatusFilter(e.target.value)}
              className="border border-[#e5eaf2] rounded-xl px-2.5 py-1.5 text-xs font-semibold text-[#172033] bg-white outline-none cursor-pointer"
            >
              <option value="All">All statuses</option>
              {WORKFLOW_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* WEEKLY 7-DAY STRIP */}
        {viewMode === 'week' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {weekDates.map((d) => {
              const isToday = d.dateStr === todayStr();
              const isSelected = selectedDayFilter === d.dateStr;
              const dayItems = calendar.filter((x) => x.date === d.dateStr);
              return (
                <div
                  key={d.dateStr}
                  onClick={() => {
                    setSelectedDayFilter((cur) =>
                      cur === d.dateStr ? null : d.dateStr
                    );
                    setForm((f) => ({ ...f, date: d.dateStr }));
                  }}
                  className={`border rounded-xl p-2.5 text-center text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#3157d5] ring-2 ring-[#3157d5]/20 bg-[#eef2ff]'
                      : isToday
                      ? 'border-[#3157d5] bg-[#eef2ff]/60'
                      : 'border-[#e5eaf2] bg-white hover:bg-slate-50'
                  }`}
                >
                  <span className="text-[11px] text-[#667085] block font-semibold">
                    {d.dayName} · {d.monthShort}
                  </span>
                  <strong className="block text-lg font-extrabold text-[#172033] my-0.5">
                    {d.dayNum}
                  </strong>
                  <span className="text-[11px] text-[#667085] font-medium">
                    {dayItems.length} item{dayItems.length === 1 ? '' : 's'}
                  </span>
                  {dayItems.length > 0 && (
                    <div className="flex justify-center gap-1 mt-1.5">
                      {dayItems.slice(0, 4).map((it) => (
                        <span
                          key={it.id}
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor:
                              BRAND_COLORS[it.brand]?.hex || '#3157d5'
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* MONTHLY CALENDAR GRID */}
        {viewMode === 'month' && (
          <div>
            <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-bold text-[#667085] mb-1.5">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                <div key={d} className="py-1">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {monthGrid.cells.map((cell, idx) => {
                if (!cell) {
                  return (
                    <div
                      key={`empty-${idx}`}
                      className="h-24 rounded-xl bg-slate-50/50 border border-transparent"
                    />
                  );
                }
                const isToday = cell.dateStr === todayStr();
                const isSelected = selectedDayFilter === cell.dateStr;
                const dayItems = calendar.filter(
                  (x) =>
                    x.date === cell.dateStr &&
                    (calendarBrand === 'All' || x.brand === calendarBrand) &&
                    (calendarPlatform === 'All' ||
                      x.platform === calendarPlatform)
                );

                return (
                  <div
                    key={cell.dateStr}
                    onClick={() => {
                      setSelectedDayFilter((cur) =>
                        cur === cell.dateStr ? null : cell.dateStr
                      );
                      setForm((f) => ({ ...f, date: cell.dateStr }));
                    }}
                    className={`min-h-[96px] border rounded-xl p-1.5 flex flex-col justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#3157d5] bg-[#eef2ff]/60 ring-2 ring-[#3157d5]/20'
                        : isToday
                        ? 'border-[#3157d5] bg-blue-50/30'
                        : 'border-[#e5eaf2] bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span
                        className={`font-bold px-1.5 py-0.5 rounded-md ${
                          isToday
                            ? 'bg-[#3157d5] text-white'
                            : 'text-[#172033]'
                        }`}
                      >
                        {cell.dayNum}
                      </span>
                      {dayItems.length > 0 && (
                        <span className="text-[10px] text-[#667085] font-mono">
                          {dayItems.length}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 mt-1 overflow-hidden">
                      {dayItems.slice(0, 2).map((it) => (
                        <div
                          key={it.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewItem(it);
                          }}
                          className="text-[10px] font-semibold px-1.5 py-0.5 rounded truncate text-white"
                          style={{
                            backgroundColor:
                              BRAND_COLORS[it.brand]?.hex || '#3157d5'
                          }}
                          title={`${it.title} (${it.platform})`}
                        >
                          {it.title}
                        </div>
                      ))}
                      {dayItems.length > 2 && (
                        <div className="text-[10px] text-[#3157d5] font-bold pl-1">
                          +{dayItems.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* WORKFLOW KANBAN BOARD VIEW */}
        {viewMode === 'board' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3 overflow-x-auto pt-1">
            {WORKFLOW_STATUSES.map((status, stIdx) => {
              const colItems = filteredItems.filter(
                (i) => i.status === status
              );
              const nextStatus =
                stIdx < WORKFLOW_STATUSES.length - 1
                  ? WORKFLOW_STATUSES[stIdx + 1]
                  : null;
              return (
                <div
                  key={status}
                  className="bg-[#f8fafc] border border-[#e5eaf2] rounded-xl p-3 flex flex-col justify-between min-w-[200px]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-[#e5eaf2]">
                      <span className="text-xs font-extrabold text-[#172033]">
                        {status}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-white border border-[#e5eaf2] text-[10px] font-bold text-[#667085]">
                        {colItems.length}
                      </span>
                    </div>

                    <div className="space-y-2 max-h-[360px] overflow-y-auto pr-0.5">
                      {colItems.length === 0 ? (
                        <div className="text-[11px] text-[#667085] text-center py-6">
                          Empty
                        </div>
                      ) : (
                        colItems.map((it) => (
                          <div
                            key={it.id}
                            className="bg-white border border-[#e5eaf2] border-l-4 rounded-lg p-2.5 shadow-sm space-y-1.5 text-xs"
                            style={{
                              borderLeftColor:
                                BRAND_COLORS[it.brand]?.hex || '#3157d5'
                            }}
                          >
                            <div className="text-[10px] font-mono text-[#667085]">
                              {it.date} · {it.platform}
                            </div>
                            <div className="font-bold text-[#172033] leading-snug">
                              {it.title}
                            </div>
                            <div className="text-[10px] text-[#667085] truncate">
                              {it.brand}
                            </div>
                            <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
                              <button
                                onClick={() => setPreviewItem(it)}
                                className="text-[10px] font-bold text-[#3157d5] hover:underline"
                              >
                                Preview
                              </button>
                              {nextStatus && (
                                <button
                                  onClick={() =>
                                    onUpdateCalendarStatus(it.id, nextStatus)
                                  }
                                  className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 hover:underline"
                                  title={`Move to ${nextStatus}`}
                                >
                                  <span>{nextStatus}</span>
                                  <ArrowRight className="w-2.5 h-2.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* PLANNER MAIN GRID: PUBLISHING QUEUE + SCHEDULE FORM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Publishing Queue List */}
        <article className="lg:col-span-7 bg-white border border-[#e5eaf2] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-base font-bold text-[#172033]">
                Publishing queue
              </h3>
              <p className="text-xs text-[#667085]">
                {selectedDayFilter
                  ? `Scheduled content for ${selectedDayFilter}`
                  : 'Upcoming content in the selected period — update status, preview or sync to tasks'}
              </p>
            </div>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#edf1ff] text-[#3157d5]">
              {filteredItems.length} item{filteredItems.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="space-y-3">
            {filteredItems.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#667085]">
                No planned content matches your filters. Use a quick template or
                schedule a post on the right.
              </div>
            ) : (
              filteredItems.map((item) => {
                const borderColor =
                  BRAND_COLORS[item.brand]?.hex || '#3157d5';
                return (
                  <div
                    key={item.id}
                    style={{ borderLeftColor: borderColor }}
                    className="border border-[#e5eaf2] border-l-4 rounded-xl p-4 bg-white hover:bg-slate-50/60 transition-all space-y-3"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 text-[11px] text-[#667085] font-mono">
                          <b className="text-[#172033]">{item.date}</b>
                          <span>•</span>
                          <span>{item.time || 'Time TBD'}</span>
                          <span>•</span>
                          <span className="font-sans font-bold text-[#3157d5]">
                            {item.platform}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-[#172033] mt-0.5">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-[#667085]">
                          {item.brand} · {item.type || 'Content'}
                          {item.owner ? ` · Owner: ${item.owner}` : ''}
                        </p>
                      </div>

                      {/* Inline Workflow Status Dropdown */}
                      <select
                        aria-label="Workflow status"
                        value={item.status}
                        onChange={(e) =>
                          onUpdateCalendarStatus(item.id, e.target.value)
                        }
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border outline-none cursor-pointer ${
                          item.status === 'Published'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : item.status === 'Approved' ||
                              item.status === 'Scheduled'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : item.status === 'Blocked'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {WORKFLOW_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    {item.copy && (
                      <p className="text-xs text-[#26324a] bg-[#f8fafc] border border-[#e5eaf2] rounded-lg p-2.5 whitespace-pre-line">
                        {item.copy}
                      </p>
                    )}

                    {/* Detailed Action Buttons Toolbar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 no-print">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          onClick={() => setPreviewItem(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#edf1ff] hover:bg-blue-100 text-[#3157d5] text-xs font-bold rounded-lg transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Preview Post</span>
                        </button>

                        <button
                          onClick={() => onConvertCalendarToTask(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg transition-colors"
                          title="Create a deliverable task in Daily Tasks from this planned content"
                        >
                          <ListPlus className="w-3.5 h-3.5" />
                          <span>Sync to Tasks</span>
                        </button>

                        <button
                          onClick={() => onDuplicateCalendarItem(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-[#e5eaf2] text-[#26324a] text-xs font-bold rounded-lg transition-colors"
                          title="Duplicate content item"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Duplicate</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleEdit(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-[#e5eaf2] text-[#26324a] text-xs font-bold rounded-lg"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => onDeleteCalendarItem(item.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-rose-50 border border-[#e5eaf2] text-rose-600 text-xs font-bold rounded-lg"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </article>

        {/* Plan Content Form + Quick Templates */}
        <article
          id="plannerFormCard"
          className="lg:col-span-5 bg-white border border-[#e5eaf2] rounded-2xl p-5 shadow-sm no-print h-fit space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#172033]">
              {form.id ? 'Edit planned content' : '＋ Plan & schedule content'}
            </h3>
            {form.id && (
              <button
                onClick={handleResetForm}
                className="text-xs font-bold text-rose-600 hover:underline"
              >
                Cancel edit
              </button>
            )}
          </div>

          {/* Quick Templates Bar */}
          <div className="bg-[#f8fafc] border border-[#e5eaf2] rounded-xl p-3 space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#3157d5]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Quick Campaign Templates:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {CONTENT_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.label}
                  type="button"
                  onClick={() => handleApplyTemplate(tpl)}
                  className="px-2.5 py-1 bg-white hover:bg-blue-50 border border-[#e5eaf2] hover:border-blue-300 rounded-lg text-[11px] font-semibold text-[#172033] transition-colors"
                >
                  {tpl.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="sm:col-span-2 grid gap-1">
                <label
                  htmlFor="calTitle"
                  className="text-[11px] text-[#667085] font-bold"
                >
                  Content / campaign title *
                </label>
                <input
                  id="calTitle"
                  required
                  placeholder="e.g. AI services carousel"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-[#e5eaf2] rounded-lg p-2.5 bg-white text-[#172033] outline-none focus:border-[#3157d5]"
                />
              </div>

              <div className="grid gap-1">
                <label
                  htmlFor="calBrand"
                  className="text-[11px] text-[#667085] font-bold"
                >
                  Brand *
                </label>
                <select
                  id="calBrand"
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  className="w-full border border-[#e5eaf2] rounded-lg p-2.5 bg-white text-[#172033] outline-none focus:border-[#3157d5]"
                >
                  {BRANDS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-1">
                <label
                  htmlFor="calPlatform"
                  className="text-[11px] text-[#667085] font-bold"
                >
                  Platform
                </label>
                <select
                  id="calPlatform"
                  value={form.platform}
                  onChange={(e) =>
                    setForm({ ...form, platform: e.target.value })
                  }
                  className="w-full border border-[#e5eaf2] rounded-lg p-2.5 bg-white text-[#172033] outline-none focus:border-[#3157d5]"
                >
                  {PLANNER_PLATFORMS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-1">
                <label
                  htmlFor="calDate"
                  className="text-[11px] text-[#667085] font-bold"
                >
                  Publish date *
                </label>
                <input
                  id="calDate"
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full border border-[#e5eaf2] rounded-lg p-2.5 bg-white text-[#172033] outline-none focus:border-[#3157d5]"
                />
              </div>

              <div className="grid gap-1">
                <label
                  htmlFor="calTime"
                  className="text-[11px] text-[#667085] font-bold"
                >
                  Publish time
                </label>
                <input
                  id="calTime"
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="w-full border border-[#e5eaf2] rounded-lg p-2.5 bg-white text-[#172033] outline-none focus:border-[#3157d5]"
                />
              </div>

              <div className="grid gap-1">
                <label
                  htmlFor="calType"
                  className="text-[11px] text-[#667085] font-bold"
                >
                  Format
                </label>
                <select
                  id="calType"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full border border-[#e5eaf2] rounded-lg p-2.5 bg-white text-[#172033] outline-none focus:border-[#3157d5]"
                >
                  {CONTENT_FORMATS.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-1">
                <label
                  htmlFor="calStatus"
                  className="text-[11px] text-[#667085] font-bold"
                >
                  Workflow status
                </label>
                <select
                  id="calStatus"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full border border-[#e5eaf2] rounded-lg p-2.5 bg-white text-[#172033] outline-none focus:border-[#3157d5]"
                >
                  {WORKFLOW_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2 grid gap-1">
                <label
                  htmlFor="calOwner"
                  className="text-[11px] text-[#667085] font-bold"
                >
                  Owner / reviewer
                </label>
                <input
                  id="calOwner"
                  placeholder="Name"
                  value={form.owner}
                  onChange={(e) => setForm({ ...form, owner: e.target.value })}
                  className="w-full border border-[#e5eaf2] rounded-lg p-2.5 bg-white text-[#172033] outline-none focus:border-[#3157d5]"
                />
              </div>

              <div className="sm:col-span-2 grid gap-1">
                <label
                  htmlFor="calCopy"
                  className="text-[11px] text-[#667085] font-bold"
                >
                  Caption, brief or asset link
                </label>
                <textarea
                  id="calCopy"
                  rows={4}
                  placeholder="Hook, CTA, key message, creative link, approval notes…"
                  value={form.copy}
                  onChange={(e) => setForm({ ...form, copy: e.target.value })}
                  className="w-full border border-[#e5eaf2] rounded-lg p-2.5 bg-white text-[#172033] outline-none focus:border-[#3157d5] resize-y"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-4">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#3157d5] hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>
                  {form.id ? 'Save changes' : 'Save calendar item'}
                </span>
              </button>

              <button
                type="button"
                onClick={handleResetForm}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-slate-50 border border-[#e5eaf2] text-[#26324a] text-xs font-bold rounded-xl shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Clear</span>
              </button>
            </div>
          </form>
        </article>
      </div>

      {/* PRE-PUBLISH QUALITY CHECKLIST WITH PERSISTENCE & ACTIONS */}
      <div>
        <div className="flex flex-wrap items-end justify-between gap-3 mb-3">
          <div>
            <h2 className="text-lg font-extrabold text-[#172033] tracking-tight">
              Pre-publish quality checklist ({checkedCount}/
              {PRE_PUBLISH_CHECKLIST.length})
            </h2>
            <p className="text-xs text-[#667085]">
              Verify quality standards before scheduling or publishing any
              client content.
            </p>
          </div>

          <div className="flex items-center gap-2 no-print">
            <button
              onClick={() =>
                onSetAllPlannerChecks(
                  PRE_PUBLISH_CHECKLIST.map((i) => i.id),
                  true
                )
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Check all</span>
            </button>
            <button
              onClick={() =>
                onSetAllPlannerChecks(
                  PRE_PUBLISH_CHECKLIST.map((i) => i.id),
                  false
                )
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-[#e5eaf2] text-[#667085] text-xs font-bold rounded-xl"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        <article className="bg-white border border-[#e5eaf2] rounded-2xl p-5 shadow-sm space-y-4">
          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{
                width: `${
                  (checkedCount / PRE_PUBLISH_CHECKLIST.length) * 100
                }%`
              }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {PRE_PUBLISH_CHECKLIST.map((item) => {
              const isChecked = !!plannerChecks[item.id];
              return (
                <label
                  key={item.id}
                  className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                    isChecked
                      ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                      : 'bg-[#f8fafc] border-[#e5eaf2] text-[#172033] hover:bg-white'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onTogglePlannerCheck(item.id)}
                    className="mt-0.5 rounded text-[#3157d5]"
                  />
                  <span
                    className={`font-medium ${
                      isChecked ? 'line-through text-[#667085]' : ''
                    }`}
                  >
                    {item.label}
                  </span>
                </label>
              );
            })}
          </div>
        </article>
      </div>
    </section>
  );
}
