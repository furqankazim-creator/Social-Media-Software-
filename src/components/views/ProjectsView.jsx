import React, { useState, useMemo } from 'react';
import {
  Plus,
  Download,
  Trash2,
  ListPlus,
  ArrowRight,
  Table,
  Kanban,
  CheckSquare,
  Sparkles,
  Layers,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import {
  BRANDS,
  BRAND_COLORS,
  PIPELINE_STAGES
} from '../../constants/dashboardConfig';
import { todayStr } from '../../utils/helpers';

const RECURRING_WORK = [
  {
    period: 'Daily Operations',
    items: [
      {
        id: 'd1',
        label: 'Review priority tasks, deadlines & blocker clearing',
        category: 'Meeting / admin'
      },
      {
        id: 'd2',
        label: 'Schedule and publish approved LinkedIn & Meta content',
        category: 'Publishing & scheduling'
      },
      {
        id: 'd3',
        label: 'Log productive shift hours, outputs and EOD summary',
        category: 'Reporting & analytics'
      },
      {
        id: 'd4',
        label: 'Monitor active paid campaigns delivery & spend pacing',
        category: 'Paid media management'
      }
    ]
  },
  {
    period: 'Weekly Strategic Duties',
    items: [
      {
        id: 'w1',
        label: 'Compare cross-channel post output & viral reach analytics',
        category: 'Reporting & analytics'
      },
      {
        id: 'w2',
        label: 'Review Meta Ads CPC, CTR, CPA & lead acquisition metrics',
        category: 'Paid media management'
      },
      {
        id: 'w3',
        label: 'Prepare client-wise progress update for stakeholder portals',
        category: 'Client account management'
      },
      {
        id: 'w4',
        label: "Plan and draft upcoming week's multi-brand content calendar",
        category: 'Research & strategy'
      }
    ]
  },
  {
    period: 'Monthly Impact Milestones',
    items: [
      {
        id: 'm1',
        label: 'Summarize aggregate monthly impressions & engagement surge',
        category: 'Reporting & analytics'
      },
      {
        id: 'm2',
        label: 'Audit conversion funnel & consultation booking outcomes',
        category: 'Paid media management'
      },
      {
        id: 'm3',
        label: 'Publish enterprise case study & portfolio proofs (TGT Only)',
        category: 'Case study / company profile (TGT only)'
      },
      {
        id: 'm4',
        label: 'Set next-month growth benchmarks & client delivery goals',
        category: 'Research & strategy'
      }
    ]
  }
];

export default function ProjectsView({
  projects,
  recurringChecks = {},
  onToggleRecurringCheck,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  onConvertProjectToTask,
  onSaveTask,
  onExportProjects
}) {
  const [viewMode, setViewMode] = useState('board'); // default to visual 'board'

  const stageCounts = useMemo(() => {
    const counts = {};
    PIPELINE_STAGES.forEach((s) => (counts[s] = 0));
    projects.forEach((p) => {
      if (counts[p.stage] !== undefined) counts[p.stage]++;
    });
    return counts;
  }, [projects]);

  const handleAdvanceStage = (proj) => {
    const idx = PIPELINE_STAGES.indexOf(proj.stage);
    if (idx >= 0 && idx < PIPELINE_STAGES.length - 1) {
      onUpdateProject(proj.id, 'stage', PIPELINE_STAGES[idx + 1]);
    }
  };

  const handleLogRecurringAsTask = (item) => {
    onSaveTask({
      id: null,
      title: item.label,
      brand: 'Time Global Tech',
      platform: 'LinkedIn — shared account',
      category: item.category,
      date: todayStr(),
      due: todayStr(),
      priority: 'Medium',
      status: 'In progress',
      start: '11:00',
      end: '12:00',
      estimate: 1,
      actual: 0.5,
      output: 1,
      spend: 0,
      notes: 'Logged from recurring operational workflow checklist'
    });
  };

  const getStageColor = (stage) => {
    switch (stage) {
      case 'Backlog':
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
      case 'Drafting':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300';
      case 'In review':
      case 'Needs review':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300';
      case 'Approved':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300';
      case 'Published':
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <section className="space-y-6">
      {/* HEADER & VIEW TOGGLES */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#172033] dark:text-white tracking-tight flex items-center gap-2">
            <span>Projects &amp; Deliverables Pipeline</span>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
              {projects.length} Active Items
            </span>
          </h2>
          <p className="text-xs text-[#667085] dark:text-slate-400 mt-0.5">
            Manage multi-stage strategic deliverables from Drafting to Final Client Sign-off.
          </p>
        </div>

        <div className="flex items-center gap-2.5 no-print">
          <div className="flex items-center bg-white dark:bg-slate-900 border border-[#e5eaf2] dark:border-slate-800 rounded-xl p-1 shadow-xs">
            <button
              onClick={() => setViewMode('board')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === 'board'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Pipeline Board</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === 'table'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Checklist Table</span>
            </button>
          </div>

          <button
            onClick={() => onAddProject()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-blue-500/20 transition hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Deliverable</span>
          </button>

          <button
            onClick={onExportProjects}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-[#e5eaf2] dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl shadow-xs transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* PIPELINE STAGE SUMMARY PILLS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {PIPELINE_STAGES.map((st) => (
          <div
            key={st}
            className="bg-white dark:bg-[#162033] border border-[#e5eaf2] dark:border-slate-800 rounded-2xl p-3 shadow-xs flex items-center justify-between"
          >
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
              {st}
            </span>
            <span className={`text-xs font-black px-2 py-0.5 rounded-full ${getStageColor(st)}`}>
              {stageCounts[st] || 0}
            </span>
          </div>
        ))}
      </div>

      {/* MAIN VIEW: BOARD OR TABLE */}
      <article className="bg-white dark:bg-[#162033] border border-[#e5eaf2] dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-[#172033] dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-500" />
            <span>Active Deliverables Pipeline</span>
          </h3>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            Click &ldquo;+ To Task&rdquo; on any deliverable to send it to Daily Tasks
          </span>
        </div>

        {viewMode === 'table' ? (
          /* TABLE VIEW */
          <div className="border border-[#e5eaf2] dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left min-w-[920px]">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-slate-900/60 border-b border-[#e5eaf2] dark:border-slate-800 text-[10px] uppercase font-bold tracking-wider text-[#667085] dark:text-slate-400">
                    <th className="py-3 px-4">Deliverable Title</th>
                    <th className="py-3 px-4">Brand / Client</th>
                    <th className="py-3 px-4">Pipeline Stage</th>
                    <th className="py-3 px-4">Owner</th>
                    <th className="py-3 px-4">Target Date</th>
                    <th className="py-3 px-4">Notes</th>
                    <th className="py-3 px-4 text-right no-print">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5eaf2] dark:divide-slate-800 text-xs">
                  {projects.map((p) => {
                    const brandColor = BRAND_COLORS[p.brand]?.hex || '#3157d5';
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                        <td className="py-2.5 px-4 min-w-[200px]">
                          <input
                            value={p.title}
                            onChange={(e) => onUpdateProject(p.id, 'title', e.target.value)}
                            className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 bg-white dark:bg-slate-900 text-[#172033] dark:text-white font-bold outline-none focus:ring-2 focus:ring-blue-500/20"
                          />
                        </td>
                        <td className="py-2.5 px-4 min-w-[160px]">
                          <select
                            value={p.brand}
                            onChange={(e) => onUpdateProject(p.id, 'brand', e.target.value)}
                            className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 bg-white dark:bg-slate-900 text-[#172033] dark:text-white font-semibold outline-none"
                          >
                            {BRANDS.map((b) => (
                              <option key={b} value={b}>{b}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-2.5 px-4 min-w-[130px]">
                          <select
                            value={p.stage}
                            onChange={(e) => onUpdateProject(p.id, 'stage', e.target.value)}
                            className={`w-full border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 font-bold outline-none ${getStageColor(p.stage)}`}
                          >
                            {PIPELINE_STAGES.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-2.5 px-4 min-w-[120px]">
                          <input
                            value={p.owner || ''}
                            placeholder="Assignee"
                            onChange={(e) => onUpdateProject(p.id, 'owner', e.target.value)}
                            className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 bg-white dark:bg-slate-900 text-[#172033] dark:text-white outline-none"
                          />
                        </td>
                        <td className="py-2.5 px-4 min-w-[130px]">
                          <input
                            type="date"
                            value={p.due || ''}
                            onChange={(e) => onUpdateProject(p.id, 'due', e.target.value)}
                            className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-1.5 bg-white dark:bg-slate-900 text-[#172033] dark:text-white outline-none font-mono"
                          />
                        </td>
                        <td className="py-2.5 px-4 min-w-[180px]">
                          <input
                            value={p.notes || ''}
                            placeholder="Add brief notes..."
                            onChange={(e) => onUpdateProject(p.id, 'notes', e.target.value)}
                            className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 bg-white dark:bg-slate-900 text-[#172033] dark:text-white outline-none"
                          />
                        </td>
                        <td className="py-2.5 px-4 text-right whitespace-nowrap no-print">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => onConvertProjectToTask(p)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 font-bold rounded-lg text-xs transition"
                              title="Sync to Daily Tasks register"
                            >
                              <ListPlus className="w-3.5 h-3.5" />
                              <span>To Task</span>
                            </button>
                            <button
                              onClick={() => handleAdvanceStage(p)}
                              className="p-1.5 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-700 dark:text-blue-300 rounded-lg transition"
                              title="Advance to next stage"
                            >
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteProject(p.id)}
                              className="p-1.5 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-600 dark:text-rose-400 rounded-lg transition"
                              title="Delete deliverable"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* PIPELINE KANBAN BOARD */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
            {PIPELINE_STAGES.map((stage) => {
              const stageItems = projects.filter((p) => p.stage === stage);
              return (
                <div
                  key={stage}
                  className="bg-slate-50/70 dark:bg-slate-900/40 border border-[#e5eaf2] dark:border-slate-800 rounded-2xl p-3.5 space-y-3 min-h-[360px] flex flex-col"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-xs font-black text-[#172033] dark:text-white uppercase tracking-wider">
                      {stage}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                      {stageItems.length}
                    </span>
                  </div>

                  <div className="space-y-2.5 flex-1 overflow-y-auto">
                    {stageItems.length === 0 ? (
                      <div className="h-28 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-[11px] text-slate-400 dark:text-slate-500">
                        Empty stage
                      </div>
                    ) : (
                      stageItems.map((p) => {
                        const brandColor = BRAND_COLORS[p.brand]?.hex || '#3157d5';
                        return (
                          <div
                            key={p.id}
                            style={{ borderLeftColor: brandColor }}
                            className="bg-white dark:bg-[#162033] border border-slate-200/90 dark:border-slate-800 border-l-4 rounded-xl p-3 shadow-xs hover:shadow-md transition space-y-2 text-xs"
                          >
                            <div className="font-bold text-slate-900 dark:text-white leading-snug">
                              {p.title}
                            </div>
                            <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate">
                              {p.brand}
                            </div>
                            {p.notes && (
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 p-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                                {p.notes}
                              </p>
                            )}
                            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                              <button
                                onClick={() => onConvertProjectToTask(p)}
                                className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                              >
                                + To Task
                              </button>
                              <button
                                onClick={() => handleAdvanceStage(p)}
                                className="inline-flex items-center gap-0.5 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                              >
                                <span>Next</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
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
      </article>

      {/* INTERACTIVE SUGGESTED RECURRING WORK */}
      <div className="space-y-3">
        <div>
          <h2 className="text-lg font-extrabold text-[#172033] dark:text-white tracking-tight flex items-center gap-2">
            <span>Operational Cadence &amp; Checklist</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              Standard Operating Procedures (SOP)
            </span>
          </h2>
          <p className="text-xs text-[#667085] dark:text-slate-400">
            Check off routine operational tasks or click &ldquo;+ Log&rdquo; to send them straight into today&apos;s active tasks register.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {RECURRING_WORK.map((group) => (
            <article
              key={group.period}
              className="bg-white dark:bg-[#162033] border border-[#e5eaf2] dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3"
            >
              <h3 className="text-sm font-bold text-[#172033] dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <CheckSquare className="w-4 h-4 text-blue-500" />
                <span>{group.period}</span>
              </h3>
              <ul className="space-y-2.5 text-xs">
                {group.items.map((item) => {
                  const checked = !!recurringChecks[item.id];
                  return (
                    <li
                      key={item.id}
                      className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 transition hover:border-blue-300 dark:hover:border-blue-800"
                    >
                      <label className="flex items-start gap-2.5 cursor-pointer flex-1 min-w-0">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => onToggleRecurringCheck(item.id)}
                          className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span
                          className={`text-xs leading-snug truncate ${
                            checked
                              ? 'line-through text-slate-400 dark:text-slate-500'
                              : 'text-slate-800 dark:text-slate-200 font-semibold'
                          }`}
                        >
                          {item.label}
                        </span>
                      </label>
                      <button
                        onClick={() => handleLogRecurringAsTask(item)}
                        className="px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/80 border border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded-lg shrink-0 transition"
                        title="Log this recurring item into today's tasks"
                      >
                        + Log
                      </button>
                    </li>
                  );
                })}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
