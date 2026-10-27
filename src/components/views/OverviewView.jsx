import React, { useMemo } from 'react';
import {
  CheckCircle,
  Clock,
  FileCheck2,
  TrendingUp,
  ArrowRight,
  Plus,
  Play,
  Check,
  Edit3,
  Filter
} from 'lucide-react';
import { BRANDS, BRAND_COLORS } from '../../constants/dashboardConfig';
import {
  formatMoney,
  formatNum,
  pct,
  calculateProductiveHours
} from '../../utils/helpers';

export default function OverviewView({
  filteredTasks,
  filteredMetrics,
  settings,
  brandFilter,
  onSelectBrandFilter,
  onNavigate,
  onQuickAddTaskForBrand,
  onEditTask,
  onUpdateTaskStatus
}) {
  const stats = useMemo(() => {
    const all = filteredTasks.length;
    const done = filteredTasks.filter((t) => t.status === 'Completed').length;
    const hours = filteredTasks.reduce(
      (sum, t) => sum + Number(t.actual || 0),
      0
    );
    const outputs = filteredTasks.reduce(
      (sum, t) => sum + Number(t.output || 0),
      0
    );
    const taskSpend = filteredTasks.reduce(
      (sum, t) => sum + Number(t.spend || 0),
      0
    );
    const metricSpend = filteredMetrics.reduce(
      (sum, m) => sum + Number(m.spend || 0),
      0
    );
    return {
      all,
      done,
      rate: pct(done, all),
      hours,
      outputs,
      totalSpend: taskSpend + metricSpend
    };
  }, [filteredTasks, filteredMetrics]);

  const plannedHours = useMemo(
    () => calculateProductiveHours(settings),
    [settings]
  );

  const brandStatsList = useMemo(() => {
    return BRANDS.map((brand) => {
      const list = filteredTasks.filter((t) => t.brand === brand);
      const all = list.length;
      const done = list.filter((t) => t.status === 'Completed').length;
      const hours = list.reduce((sum, t) => sum + Number(t.actual || 0), 0);
      const outputs = list.reduce((sum, t) => sum + Number(t.output || 0), 0);
      const rate = pct(done, all);
      return { brand, all, done, hours, outputs, rate };
    });
  }, [filteredTasks]);

  const categoryBreakdown = useMemo(() => {
    const map = {};
    filteredTasks.forEach((t) => {
      const cat = t.category || 'Other';
      map[cat] = (map[cat] || 0) + Number(t.actual || 0);
    });
    const entries = Object.entries(map).sort((a, b) => b[1] - a[1]);
    return entries.length > 0 ? entries.slice(0, 6) : [['No hours logged', 0]];
  }, [filteredTasks]);

  const priorityOpenTasks = useMemo(() => {
    return filteredTasks
      .filter((t) => t.status !== 'Completed')
      .sort((a, b) => (a.due || '9999').localeCompare(b.due || '9999'))
      .slice(0, 8);
  }, [filteredTasks]);

  const getStatusPillClass = (status) => {
    if (status === 'Completed') return 'bg-[#e3f7ef] text-[#087c61]';
    if (status === 'In progress') return 'bg-[#fff3dd] text-[#996016]';
    if (status === 'Blocked') return 'bg-[#ffeaec] text-[#b22f42]';
    return 'bg-[#edf1ff] text-[#3157d5]';
  };

  return (
    <section className="space-y-6">
      {/* INTERACTIVE KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <article
          onClick={() => onNavigate('tasks')}
          className="bg-white border border-[#e5eaf2] hover:border-blue-300 rounded-2xl p-5 shadow-sm cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-[#667085] text-xs font-bold">
            <span>Tasks completed</span>
            <span className="w-9 h-9 rounded-xl bg-[#edf1ff] text-[#3157d5] group-hover:bg-[#3157d5] group-hover:text-white transition-colors grid place-items-center">
              <CheckCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-extrabold text-[#172033] tracking-tight my-3">
            {stats.done}/{stats.all}
          </div>
          <div className="text-xs text-[#667085] flex items-center justify-between">
            <span>
              Completion rate:{' '}
              <strong className="text-[#0f9d8a]">
                {stats.rate.toFixed(0)}%
              </strong>
            </span>
            <span className="text-[#3157d5] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              Open →
            </span>
          </div>
        </article>

        <article
          onClick={() => onNavigate('tasks')}
          className="bg-white border border-[#e5eaf2] hover:border-blue-300 rounded-2xl p-5 shadow-sm cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-[#667085] text-xs font-bold">
            <span>Hours logged</span>
            <span className="w-9 h-9 rounded-xl bg-[#edf1ff] text-[#3157d5] group-hover:bg-[#3157d5] group-hover:text-white transition-colors grid place-items-center">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-extrabold text-[#172033] tracking-tight my-3">
            {formatNum(stats.hours)}h
          </div>
          <div className="text-xs text-[#667085] flex items-center justify-between">
            <span>
              Planned:{' '}
              <strong className="text-[#0f9d8a]">
                {formatNum(plannedHours)}h/day
              </strong>
            </span>
            <span className="text-[#3157d5] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              Log →
            </span>
          </div>
        </article>

        <article
          onClick={() => onNavigate('planner')}
          className="bg-white border border-[#e5eaf2] hover:border-blue-300 rounded-2xl p-5 shadow-sm cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-[#667085] text-xs font-bold">
            <span>Content published</span>
            <span className="w-9 h-9 rounded-xl bg-[#edf1ff] text-[#3157d5] group-hover:bg-[#3157d5] group-hover:text-white transition-colors grid place-items-center">
              <FileCheck2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-extrabold text-[#172033] tracking-tight my-3">
            {stats.outputs.toLocaleString()}
          </div>
          <div className="text-xs text-[#667085] flex items-center justify-between">
            <span>Deliverables in period</span>
            <span className="text-[#3157d5] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              Planner →
            </span>
          </div>
        </article>

        <article
          onClick={() => onNavigate('reports')}
          className="bg-white border border-[#e5eaf2] hover:border-blue-300 rounded-2xl p-5 shadow-sm cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-[#667085] text-xs font-bold">
            <span>Ad spend logged</span>
            <span className="w-9 h-9 rounded-xl bg-[#edf1ff] text-[#3157d5] group-hover:bg-[#3157d5] group-hover:text-white transition-colors grid place-items-center">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-extrabold text-[#172033] tracking-tight my-3">
            {formatMoney(stats.totalSpend)}
          </div>
          <div className="text-xs text-[#667085] flex items-center justify-between">
            <span>Tasks &amp; campaign KPIs</span>
            <span className="text-[#3157d5] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              KPIs →
            </span>
          </div>
        </article>
      </div>

      {/* PERFORMANCE SNAPSHOT */}
      <div>
        <div className="mb-3">
          <h2 className="text-lg font-extrabold text-[#172033] tracking-tight">
            Performance snapshot
          </h2>
          <p className="text-xs text-[#667085]">
            Calculated from your saved task and deliverable entries.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Tasks by Client */}
          <article className="lg:col-span-7 bg-white border border-[#e5eaf2] rounded-2xl p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#172033]">
                  Tasks by client
                </h3>
                <p className="text-xs text-[#667085]">
                  Click any brand row to filter the dashboard by that client
                </p>
              </div>
              {brandFilter !== 'All' && (
                <button
                  onClick={() => onSelectBrandFilter('All')}
                  className="text-xs font-bold text-[#3157d5] hover:underline"
                >
                  Show all brands
                </button>
              )}
            </div>

            <div className="space-y-3.5">
              {brandStatsList.map((item) => {
                const color = BRAND_COLORS[item.brand]?.hex || '#3157d5';
                const isSelected = brandFilter === item.brand;
                return (
                  <div
                    key={item.brand}
                    onClick={() =>
                      onSelectBrandFilter(isSelected ? 'All' : item.brand)
                    }
                    className={`grid grid-cols-[140px_1fr_45px] sm:grid-cols-[175px_1fr_50px] gap-3 items-center text-xs p-1.5 rounded-xl cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-50/70' : 'hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate font-semibold text-[#172033]">
                      {item.brand}
                    </span>
                    <div className="h-2.5 bg-[#edf0f6] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(100, item.rate)}%`,
                          backgroundColor: color
                        }}
                      />
                    </div>
                    <b className="text-right font-mono text-[#172033]">
                      {item.done}/{item.all}
                    </b>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-4 text-[11px] text-[#667085] mt-5 pt-3 border-t border-[#e5eaf2]">
              <span className="flex items-center gap-1.5">
                <i className="w-2.5 h-2.5 rounded-full bg-[#3157d5] inline-block" />
                Completed
              </span>
              <span className="flex items-center gap-1.5">
                <i className="w-2.5 h-2.5 rounded-full bg-[#e8edf5] inline-block" />
                Remaining
              </span>
            </div>
          </article>

          {/* Daily Time Allocation */}
          <article className="lg:col-span-5 bg-white border border-[#e5eaf2] rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="mb-3">
                <h3 className="text-base font-bold text-[#172033]">
                  Daily time allocation
                </h3>
                <p className="text-xs text-[#667085]">
                  Hours recorded against your {formatNum(plannedHours)}-hour
                  productive workday after break
                </p>
              </div>

              <div className="divide-y divide-[#e5eaf2] text-xs">
                {categoryBreakdown.map(([name, hrs]) => (
                  <div
                    key={name}
                    className="flex items-center justify-between py-2.5"
                  >
                    <span className="text-[#667085]">{name}</span>
                    <b className="font-mono text-[#172033]">{formatNum(hrs)}h</b>
                  </div>
                ))}
                <div className="flex items-center justify-between py-2.5 font-bold text-[#172033]">
                  <span>Total actual hours</span>
                  <b className="font-mono">{formatNum(stats.hours)}h</b>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-[#667085] mt-3 pt-2 border-t border-slate-100">
              Tip: Enter estimated hours and actual hours on each task to
              compare planned vs. actual time.
            </div>
          </article>
        </div>
      </div>

      {/* CLIENT PORTFOLIO AT A GLANCE */}
      <div>
        <div className="flex items-end justify-between gap-3 mb-3">
          <div>
            <h2 className="text-lg font-extrabold text-[#172033] tracking-tight">
              Client portfolio at a glance
            </h2>
            <p className="text-xs text-[#667085]">
              Activity summary and quick actions for each organization.
            </p>
          </div>
          <button
            onClick={() => onNavigate('clients')}
            className="inline-flex items-center gap-1 px-3 py-2 bg-white hover:bg-slate-50 border border-[#e5eaf2] text-[#26324a] text-xs font-bold rounded-xl shadow-sm"
          >
            <span>View portfolio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {brandStatsList.map((item) => {
            const color = BRAND_COLORS[item.brand]?.hex || '#3157d5';
            const isFiltered = brandFilter === item.brand;
            return (
              <article
                key={item.brand}
                className="bg-white border border-[#e5eaf2] rounded-2xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div
                    className="absolute top-0 left-0 w-full h-1"
                    style={{ backgroundColor: color }}
                  />
                  <h3 className="text-sm font-bold text-[#172033] mt-1 mb-1.5">
                    {item.brand}
                  </h3>
                  <div className="text-2xl font-extrabold text-[#172033] tracking-tight">
                    {item.done}/{item.all}
                  </div>
                  <small className="text-xs text-[#667085]">
                    tasks completed · {item.rate.toFixed(0)}% completion
                  </small>
                  <div className="h-2 rounded-full bg-[#eef1f6] mt-3 overflow-hidden">
                    <span
                      className="block h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, item.rate)}%`,
                        backgroundColor: color
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-3.5 pt-3 border-t border-[#e5eaf2] text-[11px] text-[#667085]">
                    <span>{formatNum(item.hours)} hours</span>
                    <span>{item.outputs} outputs</span>
                  </div>
                </div>

                {/* Quick Brand Action Buttons */}
                <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-slate-100 no-print">
                  <button
                    onClick={() => onQuickAddTaskForBrand(item.brand)}
                    className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2 bg-[#edf1ff] hover:bg-blue-100 text-[#3157d5] text-[11px] font-bold rounded-lg transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Task</span>
                  </button>
                  <button
                    onClick={() =>
                      onSelectBrandFilter(isFiltered ? 'All' : item.brand)
                    }
                    className={`inline-flex items-center justify-center gap-1 py-1.5 px-2.5 border text-[11px] font-bold rounded-lg transition-colors ${
                      isFiltered
                        ? 'bg-[#3157d5] text-white border-[#3157d5]'
                        : 'bg-white hover:bg-slate-50 text-[#26324a] border-[#e5eaf2]'
                    }`}
                  >
                    <Filter className="w-3 h-3" />
                    <span>{isFiltered ? 'Filtered' : 'Filter'}</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* PRIORITY TASK LIST */}
      <div>
        <div className="flex items-end justify-between gap-3 mb-3">
          <div>
            <h2 className="text-lg font-extrabold text-[#172033] tracking-tight">
              Priority task list
            </h2>
            <p className="text-xs text-[#667085]">
              Open tasks with the nearest due dates — start, complete or edit
              directly.
            </p>
          </div>
          <button
            onClick={() => onNavigate('tasks')}
            className="inline-flex items-center gap-1 px-3 py-2 bg-white hover:bg-slate-50 border border-[#e5eaf2] text-[#26324a] text-xs font-bold rounded-xl shadow-sm"
          >
            <span>Manage tasks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white border border-[#e5eaf2] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left min-w-[740px]">
              <thead>
                <tr className="bg-[#fafbfe] border-b border-[#e5eaf2] text-[10px] uppercase tracking-wider text-[#667085]">
                  <th className="py-3 px-4">Task</th>
                  <th className="py-3 px-4">Brand</th>
                  <th className="py-3 px-4">Due</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Hours</th>
                  <th className="py-3 px-4 text-right no-print">
                    Quick Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5eaf2] text-xs">
                {priorityOpenTasks.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-8 text-center text-[#667085]"
                    >
                      No open tasks for this period. Add tasks to get started.
                    </td>
                  </tr>
                ) : (
                  priorityOpenTasks.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 font-bold text-[#172033]">
                        {t.title}
                        {t.notes && (
                          <div className="text-[11px] font-normal text-[#667085] truncate max-w-xs">
                            {t.notes}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-[#667085]">{t.brand}</td>
                      <td className="py-3 px-4 font-mono text-[#172033]">
                        {t.due || '—'}
                      </td>
                      <td className="py-3 px-4">{t.priority}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusPillClass(
                            t.status
                          )}`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono">
                        {formatNum(t.actual)}h
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap no-print">
                        <div className="inline-flex items-center gap-1.5">
                          {t.status === 'Not started' && (
                            <button
                              onClick={() =>
                                onUpdateTaskStatus(t.id, 'In progress')
                              }
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-bold rounded-lg"
                              title="Mark In Progress"
                            >
                              <Play className="w-3 h-3" />
                              <span>Start</span>
                            </button>
                          )}
                          <button
                            onClick={() =>
                              onUpdateTaskStatus(t.id, 'Completed')
                            }
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold rounded-lg"
                            title="Mark Completed"
                          >
                            <Check className="w-3 h-3" />
                            <span>Done</span>
                          </button>
                          <button
                            onClick={() => onEditTask(t)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 border border-[#e5eaf2] text-[#26324a] text-[11px] font-bold rounded-lg"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
