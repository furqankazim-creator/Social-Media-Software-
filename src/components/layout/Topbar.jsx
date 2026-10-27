import React, { useState, useEffect, useRef } from 'react';
import {
  Sun,
  Moon,
  Bell,
  Search,
  Plus,
  Download,
  Save,
  Printer,
  CalendarPlus,
  ChevronDown,
  Clock,
  Sparkles,
  CheckCircle2,
  Activity,
  X,
  Settings as SettingsIcon,
  BarChart3,
  CheckSquare,
  ShieldCheck,
  Zap,
  LogOut
} from 'lucide-react';
import { todayStr } from '../../utils/helpers';
import BrandLogo from '../common/BrandLogo';

export default function Topbar({
  theme = 'light',
  onToggleTheme,
  searchQuery = '',
  onSearchChange,
  settings,
  isBackendConnected,
  onExportCsv,
  onDownloadBackup,
  onPrint,
  onAddTask,
  onPlanContent,
  onNavigate,
  onLogout,
  currentUser
}) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  // Live real-time clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const formattedDate = currentTime.toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <header className="sticky top-0 z-30 mb-6 bg-white/95 dark:bg-[#111a2e]/95 backdrop-blur-md rounded-2xl border border-[#e5eaf2] dark:border-slate-800 shadow-sm px-4 sm:px-6 py-3.5 transition-colors">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        
        {/* LEFT: BRAND LOGO + NAME + SUBTITLE */}
        <BrandLogo
          size="md"
          showText={true}
          subtitle="Social & Client Operations"
          isOnline={isBackendConnected}
        />

        {/* CENTER: SEARCH BAR + LIVE TIME */}
        <div className="flex-1 max-w-xl flex items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              placeholder="Search tasks, clients, deliverables..."
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#162238] border border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange && onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Real-time Clock Widget */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#162238] border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-600 dark:text-slate-300 shrink-0">
            <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <div className="flex flex-col leading-none">
              <span className="font-mono font-bold text-slate-800 dark:text-slate-100 text-[11px]">
                {formattedTime}
              </span>
              <span className="text-[9px] text-slate-400 dark:text-slate-500">
                {formattedDate}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT: THEME TOGGLE + NOTIFICATIONS + ACTIONS + PROFILE */}
        <div className="flex items-center justify-between sm:justify-end gap-2.5 no-print">
          
          {/* Quick Primary Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onPlanContent}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl shadow-xs transition"
              title="Plan Content Calendar"
            >
              <CalendarPlus className="w-3.5 h-3.5 text-blue-500" />
              <span>Plan</span>
            </button>

            <button
              onClick={onAddTask}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 transition group"
            >
              <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Add Task</span>
            </button>
          </div>

          <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

          {/* LIGHT / DARK MODE TOGGLE */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-amber-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 transition-transform hover:-rotate-12" />
            )}
          </button>

          {/* NOTIFICATION BELL */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition relative"
              title="Notifications & Updates"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-white dark:ring-slate-900" />
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#162033] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-3 px-3 z-50 animate-fade-in">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800 px-1">
                  <span className="font-extrabold text-xs text-slate-800 dark:text-slate-100">
                    Notifications &amp; Activity
                  </span>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">
                    3 New
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded-xl bg-blue-50/70 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/40">
                    <div className="flex items-center gap-1.5 font-bold text-blue-700 dark:text-blue-300 text-[11px]">
                      <Clock className="w-3 h-3" />
                      <span>Workday Shift Active</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                      {settings?.start || '11:00'} – {settings?.end || '17:00'} (Break {settings?.breakStart || '13:30'} – {settings?.breakEnd || '14:30'})
                    </p>
                  </div>

                  <div className="p-2 rounded-xl bg-emerald-50/70 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/40">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-300 text-[11px]">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Backend Synchronization</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                      {isBackendConnected
                        ? 'REST Express server connected on port 5000'
                        : 'Offline mode active (Local storage fallback)'}
                    </p>
                  </div>

                  <div className="p-2 rounded-xl bg-purple-50/70 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-900/40">
                    <div className="flex items-center gap-1.5 font-bold text-purple-700 dark:text-purple-300 text-[11px]">
                      <Sparkles className="w-3 h-3" />
                      <span>Daily Content Planner</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                      Social calendar queues are synced with daily deliverables.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* USER PROFILE DROPDOWN */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
              title="Akhtar Ali Profile Menu"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xs relative shadow-xs">
                AA
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-slate-900" />
              </div>
              <div className="hidden md:flex flex-col text-left leading-tight">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  Akhtar Ali
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  Operations Lead
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#162033] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-3 z-50 animate-fade-in">
                {/* User Info Header */}
                <div className="px-4 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-sm shadow">
                    AA
                  </div>
                  <div className="min-w-0">
                    <strong className="block text-sm font-bold text-slate-900 dark:text-white truncate">
                      Akhtar Ali
                    </strong>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate block">
                      akhtar.ali@workpulse.io
                    </span>
                    <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
                      Time Global Tech Lead
                    </span>
                  </div>
                </div>

                {/* Shift Details */}
                <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300">
                  <div className="flex items-center justify-between">
                    <span>Active Shift:</span>
                    <b className="text-slate-800 dark:text-slate-100">
                      {settings?.start || '11:00'} – {settings?.end || '17:00'}
                    </b>
                  </div>
                  <div className="flex items-center justify-between mt-0.5 text-slate-400">
                    <span>Break:</span>
                    <span>
                      {settings?.breakStart || '13:30'} – {settings?.breakEnd || '14:30'}
                    </span>
                  </div>
                </div>

                {/* Navigation & Quick Actions */}
                <div className="py-1 px-2 text-xs space-y-0.5">
                  <button
                    onClick={() => {
                      onNavigate && onNavigate('assistant');
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left"
                  >
                    <Sparkles className="w-4 h-4 text-blue-500" />
                    <span>Daily Action Plan</span>
                  </button>

                  <button
                    onClick={() => {
                      onNavigate && onNavigate('reports');
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left"
                  >
                    <BarChart3 className="w-4 h-4 text-emerald-500" />
                    <span>Reports &amp; KPIs</span>
                  </button>

                  <button
                    onClick={() => {
                      onNavigate && onNavigate('settings');
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left"
                  >
                    <SettingsIcon className="w-4 h-4 text-slate-400" />
                    <span>Settings &amp; Data</span>
                  </button>

                  <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                  <button
                    onClick={() => {
                      onExportCsv && onExportCsv();
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left"
                  >
                    <Download className="w-4 h-4 text-slate-400" />
                    <span>Export Tasks CSV</span>
                  </button>

                  <button
                    onClick={() => {
                      onDownloadBackup && onDownloadBackup();
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left"
                  >
                    <Save className="w-4 h-4 text-emerald-600" />
                    <span>Download Backup JSON</span>
                  </button>

                  <button
                    onClick={() => {
                      onPrint && onPrint();
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-slate-400" />
                    <span>Print Performance Report</span>
                  </button>

                  <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                  {onLogout && (
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition text-left font-bold cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out (Akhtar Ali)</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
}
