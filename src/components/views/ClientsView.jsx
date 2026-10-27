import React, { useState, useMemo } from 'react';
import {
  Plus,
  Calendar,
  BarChart3,
  Filter,
  Globe,
  Lock,
  Edit2,
  Trash2,
  ExternalLink,
  ShieldCheck,
  User,
  Mail,
  Building
} from 'lucide-react';
import { DEFAULT_CLIENTS, BRAND_COLORS, getClientColorHex } from '../../constants/dashboardConfig';
import { formatMoney, formatNum, pct } from '../../utils/helpers';
import ClientModal from '../modals/ClientModal';

export default function ClientsView({
  clients = DEFAULT_CLIENTS,
  filteredTasks,
  brandFilter,
  onSelectBrandFilter,
  onQuickAddTaskForBrand,
  onNavigate,
  onSaveClient,
  onDeleteClient,
  onOpenClientPortal
}) {
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const activeClients = useMemo(() => {
    return Array.isArray(clients) && clients.length > 0 ? clients : DEFAULT_CLIENTS;
  }, [clients]);

  const brandStatsList = useMemo(() => {
    return activeClients.map((client) => {
      const list = filteredTasks.filter((t) => t.brand === client.name);
      const all = list.length;
      const done = list.filter((t) => t.status === 'Completed').length;
      const hours = list.reduce((sum, t) => sum + Number(t.actual || 0), 0);
      const outputs = list.reduce((sum, t) => sum + Number(t.output || 0), 0);
      const spend = list.reduce((sum, t) => sum + Number(t.spend || 0), 0);
      const rate = pct(done, all);
      return {
        client,
        brand: client.name,
        color: client.color || getClientColorHex(client.name, activeClients),
        all,
        done,
        hours,
        outputs,
        spend,
        rate
      };
    });
  }, [activeClients, filteredTasks]);

  const handleOpenAddModal = () => {
    setEditingClient(null);
    setIsClientModalOpen(true);
  };

  const handleOpenEditModal = (client) => {
    setEditingClient(client);
    setIsClientModalOpen(true);
  };

  return (
    <section className="space-y-6">
      {/* Client Modal */}
      <ClientModal
        isOpen={isClientModalOpen}
        client={editingClient}
        onClose={() => setIsClientModalOpen(false)}
        onSave={onSaveClient}
      />

      {/* Top Header & Add Client Action */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-[#172033] dark:text-white tracking-tight">
              Client Portfolio &amp; Portals
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {activeClients.length} Active Accounts
            </span>
          </div>
          <p className="text-xs text-[#667085] dark:text-slate-400 mt-1">
            Manage organization profiles, contact channels, and view-only stakeholder portals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {brandFilter !== 'All' && (
            <button
              onClick={() => onSelectBrandFilter('All')}
              className="px-3 py-2 bg-blue-50 dark:bg-blue-900/30 text-[#3157d5] dark:text-blue-300 text-xs font-bold rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/50 transition"
            >
              Filtered by: {brandFilter} (Clear ✕)
            </button>
          )}

          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Client</span>
          </button>
        </div>
      </div>

      {/* CLIENT CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {brandStatsList.map((item) => {
          const client = item.client;
          const color = item.color;
          const isFiltered = brandFilter === item.brand;
          const isCaseRestricted = Boolean(client.caseStudyRestricted);
          const hasPassword = Boolean(client.portalPassword && client.portalPassword.trim() !== '');

          return (
            <article
              key={client.id || item.brand}
              className="bg-white dark:bg-[#162033] border border-[#e5eaf2] dark:border-slate-800 rounded-3xl p-5 shadow-xs relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow group"
            >
              <div>
                {/* Brand Color Bar */}
                <div
                  className="absolute top-0 left-0 w-full h-1.5"
                  style={{ backgroundColor: color }}
                />

                {/* Card Header */}
                <div className="flex items-start justify-between gap-2 mt-1 mb-2">
                  <div className="min-w-0">
                    <span
                      className="text-[9px] uppercase font-black tracking-widest px-1.5 py-0.5 rounded text-white inline-block mb-1"
                      style={{ backgroundColor: color }}
                    >
                      {client.category || 'Operations'}
                    </span>
                    <h3 className="text-sm font-bold text-[#172033] dark:text-white truncate" title={item.brand}>
                      {item.brand}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleOpenEditModal(client)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="Edit Client"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {onDeleteClient && activeClients.length > 1 && (
                      <button
                        onClick={() => onDeleteClient(client.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 transition"
                        title="Delete Client"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Metrics Numbers */}
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-[#172033] dark:text-white tracking-tight">
                    {item.all}
                  </span>
                  <span className="text-xs text-[#667085] dark:text-slate-400">
                    tasks in period
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 mt-2.5 overflow-hidden">
                  <span
                    className="block h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, item.rate)}%`,
                      backgroundColor: color
                    }}
                  />
                </div>

                {/* Stat pills */}
                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px] text-[#667085] dark:text-slate-400">
                  <span>{item.done} done ({item.rate.toFixed(0)}%)</span>
                  <span>{formatNum(item.hours)}h logged</span>
                  <span>{item.outputs} outputs</span>
                </div>

                {/* Stakeholder / Contact Preview */}
                {(client.contactPerson || client.contactEmail) && (
                  <div className="mt-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 text-[11px] space-y-0.5">
                    {client.contactPerson && (
                      <div className="text-slate-700 dark:text-slate-300 font-semibold truncate flex items-center gap-1.5">
                        <User className="w-3 h-3 text-slate-400" />
                        <span>{client.contactPerson}</span>
                      </div>
                    )}
                    {client.contactEmail && (
                      <div className="text-slate-400 text-[10px] truncate">
                        {client.contactEmail}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons & Portal Trigger */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 no-print">
                {/* Shareable Client Portal Button */}
                <button
                  onClick={() => onOpenClientPortal && onOpenClientPortal(client)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs shadow-xs transition group"
                  title="Open stakeholder view-only portal"
                >
                  <Globe className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-45 transition-transform" />
                  <span>View Client Portal</span>
                  {hasPassword ? (
                    <Lock className="w-3 h-3 text-amber-400 ml-1" title="Passcode Protected" />
                  ) : (
                    <span className="text-[9px] text-slate-400 ml-1">(Public)</span>
                  )}
                </button>

                {/* Sub Action Grid */}
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => onQuickAddTaskForBrand(item.brand)}
                    className="inline-flex items-center justify-center gap-1 py-1.5 px-2 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 text-[#3157d5] dark:text-blue-300 text-[11px] font-bold rounded-lg transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Task</span>
                  </button>

                  <button
                    onClick={() => {
                      onSelectBrandFilter(item.brand);
                      onNavigate('planner');
                    }}
                    className="inline-flex items-center justify-center gap-1 py-1.5 px-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-[#26324a] dark:text-slate-200 text-[11px] font-bold rounded-lg transition-colors"
                  >
                    <Calendar className="w-3 h-3 text-[#3157d5]" />
                    <span>Planner</span>
                  </button>

                  <button
                    onClick={() => {
                      onSelectBrandFilter(item.brand);
                      onNavigate('reports');
                    }}
                    className="inline-flex items-center justify-center gap-1 py-1.5 px-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-[#26324a] dark:text-slate-200 text-[11px] font-bold rounded-lg transition-colors"
                  >
                    <BarChart3 className="w-3 h-3 text-emerald-600" />
                    <span>Log KPIs</span>
                  </button>

                  <button
                    onClick={() =>
                      onSelectBrandFilter(isFiltered ? 'All' : item.brand)
                    }
                    className={`inline-flex items-center justify-center gap-1 py-1.5 px-2 border text-[11px] font-bold rounded-lg transition-colors ${
                      isFiltered
                        ? 'bg-[#3157d5] text-white border-[#3157d5]'
                        : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-[#26324a] dark:text-slate-200 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <Filter className="w-3 h-3" />
                    <span>{isFiltered ? 'Filtered' : 'Filter'}</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* BRAND PERFORMANCE BREAKDOWN TABLE */}
      <div>
        <div className="mb-3">
          <h2 className="text-lg font-extrabold text-[#172033] dark:text-white tracking-tight">
            Brand performance breakdown
          </h2>
          <p className="text-xs text-[#667085] dark:text-slate-400">
            Audit deliverables, billable hours and marketing spend across all managed accounts.
          </p>
        </div>

        <div className="bg-white dark:bg-[#162033] border border-[#e5eaf2] dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left min-w-[740px]">
              <thead>
                <tr className="bg-[#fafbfe] dark:bg-[#111a2e] border-b border-[#e5eaf2] dark:border-slate-800 text-[10px] uppercase tracking-wider text-[#667085] dark:text-slate-400">
                  <th className="py-3 px-4">Client / Brand</th>
                  <th className="py-3 px-4">Tasks</th>
                  <th className="py-3 px-4">Completed</th>
                  <th className="py-3 px-4">Completion %</th>
                  <th className="py-3 px-4">Hours</th>
                  <th className="py-3 px-4">Outputs</th>
                  <th className="py-3 px-4">Ad spend</th>
                  <th className="py-3 px-4 text-right no-print">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5eaf2] dark:divide-slate-800 text-xs">
                {brandStatsList.map((item) => (
                  <tr key={item.brand} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition">
                    <td className="py-3 px-4 font-bold text-[#172033] dark:text-white flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.brand}</span>
                    </td>
                    <td className="py-3 px-4 font-mono">{item.all}</td>
                    <td className="py-3 px-4 font-mono">{item.done}</td>
                    <td className="py-3 px-4 font-mono">
                      {item.rate.toFixed(1)}%
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {formatNum(item.hours)}h
                    </td>
                    <td className="py-3 px-4 font-mono">{item.outputs}</td>
                    <td className="py-3 px-4 font-mono">
                      {formatMoney(item.spend)}
                    </td>
                    <td className="py-3 px-4 text-right no-print space-x-2">
                      <button
                        onClick={() => onOpenClientPortal && onOpenClientPortal(item.client)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg"
                        title="Open Portal"
                      >
                        <Globe className="w-3 h-3 text-blue-500" />
                        <span>Portal</span>
                      </button>
                      <button
                        onClick={() => onQuickAddTaskForBrand(item.brand)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#edf1ff] dark:bg-blue-900/30 hover:bg-blue-100 text-[#3157d5] dark:text-blue-300 text-xs font-bold rounded-lg"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Task</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
