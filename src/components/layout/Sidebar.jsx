import React, { useState, useMemo, useEffect } from 'react';
import {
  LayoutDashboard,
  Sparkles,
  CheckSquare,
  Briefcase,
  Kanban,
  Calendar,
  BarChart3,
  Settings,
  Clock,
  Coffee,
  Zap,
  Server,
  ChevronLeft,
  ChevronRight,
  Plus,
  Menu,
  X,
  Target,
  UserCheck,
  Activity,
  Layers,
  LogOut
} from 'lucide-react';
import { calculateProductiveHours, formatNum, todayStr } from '../../utils/helpers';
import { BRANDS, BRAND_COLORS } from '../../constants/dashboardConfig';
import BrandLogo from '../common/BrandLogo';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  {
    id: 'assistant',
    label: 'Daily Action Plan',
    icon: Sparkles,
    badge: 'Live',
    badgeClass: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white animate-pulse'
  },
  { id: 'tasks', label: 'Daily tasks', icon: CheckSquare, badgeKey: 'tasks' },
  { id: 'clients', label: 'Client portfolio', icon: Briefcase, badgeKey: 'clients' },
  { id: 'projects', label: 'Projects & deliverables', icon: Kanban, badgeKey: 'projects' },
  { id: 'planner', label: 'Content planner', icon: Calendar, badgeKey: 'planner' },
  { id: 'reports', label: 'Reports & KPIs', icon: BarChart3 },
  { id: 'settings', label: 'Settings & data', icon: Settings }
];

export default function Sidebar({
  activeTab,
  onSelectTab,
  settings,
  isBackendConnected,
  tasks = [],
  calendar = [],
  projects = [],
  clients = [],
  onQuickAddTask,
  onLogout
}) {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem('workpulse_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('workpulse_sidebar_collapsed', String(isCollapsed));
    } catch {
      // ignore
    }
  }, [isCollapsed]);

  const productiveHours = calculateProductiveHours(settings);

  // Compute dynamic badge counts
  const badgeCounts = useMemo(() => {
    const today = todayStr();
    const pendingTasks = tasks.filter(
      (t) => t.date === today && t.status !== 'Done'
    ).length;
    const activeProjects = projects.filter(
      (p) => p.stage !== 'Completed'
    ).length;
    const upcomingCalendar = calendar.filter(
      (c) => c.status === 'Draft' || c.status === 'Ready' || c.status === 'Scheduled'
    ).length;

    return {
      tasks: pendingTasks > 0 ? pendingTasks : null,
      clients: (clients && clients.length) || BRANDS.length,
      projects: activeProjects > 0 ? activeProjects : null,
      planner: upcomingCalendar > 0 ? upcomingCalendar : null
    };
  }, [tasks, calendar, projects, clients]);

  const handleTabClick = (id) => {
    onSelectTab(id);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* MOBILE TOP BAR (visible on screens < md) */}
      <div className="md:hidden bg-[#0c1322] text-white px-4 py-3 flex items-center justify-between border-b border-slate-800 sticky top-0 z-40 shadow-md">
        <BrandLogo
          size="sm"
          showText={true}
          subtitle="Akhtar Ali Hub"
          isOnline={isBackendConnected}
          forceWhiteText={true}
        />

        <div className="flex items-center gap-2">
          {onQuickAddTask && (
            <button
              onClick={onQuickAddTask}
              className="p-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1 shadow-xs"
              title="Add Task"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 rounded-xl bg-[#1a253d] text-slate-300 hover:text-white transition"
            aria-label="Toggle navigation menu"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER OVERLAY */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 md:hidden animate-fade-in"
          onClick={() => setIsMobileOpen(false)}
        >
          <div
            className="w-72 max-w-[85vw] h-full bg-[#0c1322] text-slate-300 p-5 flex flex-col justify-between overflow-y-auto shadow-2xl border-r border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {/* Mobile Drawer Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                <BrandLogo
                  size="md"
                  showText={true}
                  subtitle="Akhtar Ali Hub"
                  isOnline={isBackendConnected}
                  forceWhiteText={true}
                />
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Task Action */}
              {onQuickAddTask && (
                <button
                  onClick={() => {
                    onQuickAddTask();
                    setIsMobileOpen(false);
                  }}
                  className="w-full mb-4 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Quick Add Task</span>
                </button>
              )}

              {/* Mobile Nav Links */}
              <nav className="flex flex-col gap-1.5">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  const count = item.badgeKey ? badgeCounts[item.badgeKey] : null;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabClick(item.id)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-[#1e2a44] text-white shadow-xs'
                          : 'text-[#c4cde2] hover:bg-[#1e2a44]/60 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isActive ? 'text-blue-400' : 'text-slate-400'
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-md ${
                            item.badgeClass || 'bg-blue-500 text-white'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      {count !== null && count !== undefined && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Mobile Footer Info & Sign out */}
            <div className="mt-6 pt-4 border-t border-slate-800 space-y-3 text-xs text-slate-400">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-300">Working Target</span>
                <span className="text-emerald-400 font-bold">
                  {formatNum(productiveHours, 1)}h planned
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Express API</span>
                <span className={isBackendConnected ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                  {isBackendConnected ? 'Port 5000' : 'Offline'}
                </span>
              </div>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="w-full mt-2 py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 text-rose-400 hover:text-rose-300 hover:bg-slate-800 font-bold flex items-center justify-center gap-2 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DESKTOP SIDEBAR (FIXED STICKY, NO SCROLLBAR) */}
      <aside
        className={`hidden md:flex flex-col justify-between shrink-0 no-print transition-all duration-300 ease-in-out border-r border-slate-800/80 bg-[#0c1322] text-slate-300 sticky top-0 h-screen overflow-y-auto no-scrollbar self-start z-40 ${
          isCollapsed ? 'w-20 p-3' : 'w-64 p-5'
        }`}
      >
        <div>
          {/* Header & Logo with Toggle Button */}
          <div
            className={`flex items-center mb-6 ${
              isCollapsed ? 'flex-col gap-3 justify-center' : 'justify-between px-1'
            }`}
          >
            <BrandLogo
              size={isCollapsed ? 'sm' : 'md'}
              showText={!isCollapsed}
              subtitle="Akhtar Ali Hub"
              isOnline={isBackendConnected}
              forceWhiteText={true}
            />

            {/* Collapse Toggle Button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#1a253d] transition-colors"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Quick Task Action Button */}
          {onQuickAddTask && (
            <div className="mb-4">
              {isCollapsed ? (
                <button
                  onClick={onQuickAddTask}
                  className="w-full flex items-center justify-center p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-900/30 transition group cursor-pointer"
                  title="Quick Add Task"
                >
                  <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
              ) : (
                <button
                  onClick={onQuickAddTask}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-900/30 transition group cursor-pointer"
                >
                  <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>+ Quick Add Task</span>
                </button>
              )}
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const count = item.badgeKey ? badgeCounts[item.badgeKey] : null;

              if (isCollapsed) {
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className={`relative w-full flex items-center justify-center p-3 rounded-xl font-semibold transition-all group cursor-pointer ${
                      isActive
                        ? 'bg-[#1e2a44] text-white shadow-xs'
                        : 'text-[#c4cde2] hover:bg-[#1e2a44]/60 hover:text-white'
                    }`}
                    title={item.label}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    {/* Badge notification dot in collapsed mode */}
                    {(item.badge || count !== null) && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-[#0c1322]" />
                    )}
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#1e2a44] text-white shadow-xs'
                      : 'text-[#c4cde2] hover:bg-[#1e2a44]/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-blue-400' : 'text-slate-400'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {item.badge && (
                      <span
                        className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-md ${
                          item.badgeClass || 'bg-blue-500 text-white'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {count !== null && count !== undefined && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          item.badgeKey === 'tasks' && count > 0
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Managed Client Brands Quick Badges (Expanded Mode Only) */}
          {!isCollapsed && (
            <div className="mt-6 pt-4 border-t border-slate-800/80 px-1">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                <span>Managed Portfolios</span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {(clients && clients.length) || BRANDS.length} Orgs
                </span>
              </div>
              <div className="space-y-1.5">
                {((clients && clients.length > 0) ? clients : BRANDS.map(b => ({ name: b, color: BRAND_COLORS[b]?.hex }))).map((clientItem) => {
                  const brandName = typeof clientItem === 'string' ? clientItem : clientItem.name;
                  const colorHex = (typeof clientItem === 'object' && clientItem.color) || BRAND_COLORS[brandName]?.hex || '#3b82f6';
                  const isTimeGlobal = brandName === 'Time Global Tech';
                  return (
                    <div
                      key={brandName}
                      className="flex items-center justify-between text-[11px] text-slate-400 hover:text-slate-200 transition py-0.5"
                      title={
                        isTimeGlobal
                          ? `${brandName} (Primary - Case Studies/Profiles)`
                          : brandName
                      }
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: colorHex }}
                        />
                        <span className="truncate">{brandName}</span>
                      </div>
                      {isTimeGlobal && (
                        <span className="text-[9px] font-bold text-blue-400 uppercase tracking-tighter shrink-0">
                          Main
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Section with User Profile */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          {/* User Profile Card with Log Out */}
          {!isCollapsed ? (
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-black text-xs shrink-0 shadow">
                  AA
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                    <span>Akhtar Ali</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Online" />
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    Operations Lead
                  </div>
                </div>
              </div>

              {onLogout && (
                <button
                  onClick={onLogout}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition cursor-pointer"
                  title="Sign out of WorkPulse"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-xs relative shadow"
                title="Akhtar Ali · Operations Lead"
              >
                AA
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0c1322]" />
              </div>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="p-1.5 text-slate-500 hover:text-rose-400 rounded-xl hover:bg-slate-800 transition cursor-pointer"
                  title="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
