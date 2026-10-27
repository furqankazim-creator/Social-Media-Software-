import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import FilterBar from './components/layout/FilterBar';
import Toast from './components/common/Toast';
import TaskModal from './components/modals/TaskModal';

import OverviewView from './components/views/OverviewView';
import DailyAssistantView from './components/views/DailyAssistantView';
import TasksView from './components/views/TasksView';
import ClientsView from './components/views/ClientsView';
import ProjectsView from './components/views/ProjectsView';
import PlannerView from './components/views/PlannerView';
import ReportsView from './components/views/ReportsView';
import SettingsView from './components/views/SettingsView';
import ClientPortalView from './components/portal/ClientPortalView';
import LoginView from './components/auth/LoginView';

import { useDashboardStore } from './hooks/useDashboardStore';
import { periodBounds, todayStr, exportCSV } from './utils/helpers';

export default function App() {
  const {
    state,
    toastMsg,
    isBackendConnected,
    notify,
    refreshFromBackend,
    saveTask,
    duplicateTask,
    updateTaskStatus,
    logTimeToTask,
    deleteTask,
    clearCompletedTasks,
    addProject,
    updateProject,
    deleteProject,
    convertProjectToTask,
    saveCalendarItem,
    updateCalendarStatus,
    duplicateCalendarItem,
    convertCalendarToTask,
    syncTodayCalendarToTasks,
    deleteCalendarItem,
    togglePlannerCheck,
    setAllPlannerChecks,
    toggleRecurringCheck,
    addMetric,
    deleteMetric,
    saveSettings,
    saveClient,
    deleteClient,
    sendSlackEod,
    testSlackWebhook,
    downloadBackup,
    restoreBackup,
    loadSampleData,
    clearAllToEmpty
  } = useDashboardStore();

  const [activeTab, setActiveTab] = useState('overview');
  const [periodDate, setPeriodDate] = useState(todayStr());
  const [periodMode, setPeriodMode] = useState('daily');
  const [brandFilter, setBrandFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTask, setEditingTask] = useState(null);

  // Client Portal State (URL param ?portal=BrandName or on click)
  const [portalClient, setPortalClient] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const portalParam = params.get('portal');
      if (portalParam) {
        return (
          (state.clients || []).find(
            (c) => c.name.toLowerCase() === portalParam.toLowerCase()
          ) || { name: portalParam, color: '#3157d5', portalEnabled: true }
        );
      }
    } catch {}
    return null;
  });

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const portalParam = params.get('portal');
      if (portalParam && state.clients) {
        const found = state.clients.find(
          (c) => c.name.toLowerCase() === portalParam.toLowerCase()
        );
        if (found) setPortalClient(found);
      }
    } catch {}
  }, [state.clients]);

  // User Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('workpulse_auth_user');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      name: 'Akhtar Ali',
      email: 'akhtar.ali@workpulse.io',
      role: 'Operations & Growth Specialist',
      avatar: 'AA',
      organization: 'Time Global Tech Lead'
    };
  });

  const handleLogin = useCallback((user) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('workpulse_auth_user', JSON.stringify(user));
    } catch {}
    notify(`Welcome back, ${user.name}!`);
  }, [notify]);

  const handleLogout = useCallback(() => {
    if (window.confirm('Are you sure you want to sign out of WorkPulse?')) {
      setCurrentUser(null);
      try {
        localStorage.removeItem('workpulse_auth_user');
      } catch {}
      notify('Signed out successfully');
    }
  }, [notify]);

  // Theme Mode (light / dark)
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('workpulse_theme') || 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    try {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('workpulse_theme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const handleToggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  // Quick Task Modal state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [modalTask, setModalTask] = useState(null);
  const [modalDefaultBrand, setModalDefaultBrand] = useState('All');

  const [startDate, endDate] = useMemo(
    () => periodBounds(periodMode, periodDate),
    [periodMode, periodDate]
  );

  const filteredTasks = useMemo(() => {
    return state.tasks.filter((t) => {
      const matchPeriod = t.date >= startDate && t.date <= endDate;
      const matchBrand = brandFilter === 'All' || t.brand === brandFilter;
      const matchSearch =
        !searchQuery ||
        (t.title && t.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (t.category && t.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (t.notes && t.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (t.brand && t.brand.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchPeriod && matchBrand && matchSearch;
    });
  }, [state.tasks, startDate, endDate, brandFilter, searchQuery]);

  const filteredMetrics = useMemo(() => {
    return state.metrics.filter(
      (m) =>
        m.date >= startDate &&
        m.date <= endDate &&
        (brandFilter === 'All' || m.brand === brandFilter)
    );
  }, [state.metrics, startDate, endDate, brandFilter]);

  const handleResetFilters = useCallback(() => {
    setPeriodDate(todayStr());
    setPeriodMode('daily');
    setBrandFilter('All');
    notify('Filters reset to default');
  }, [notify]);

  // Open Quick Add Task Modal
  const handleOpenAddTaskModal = useCallback(
    (forBrand = null) => {
      setModalTask(null);
      setModalDefaultBrand(forBrand || brandFilter);
      setIsTaskModalOpen(true);
    },
    [brandFilter]
  );

  const handleOpenEditTaskModal = useCallback((task) => {
    setModalTask(task);
    setIsTaskModalOpen(true);
  }, []);

  // CSV Exports
  const handleExportTasksCsv = useCallback(() => {
    const rows = [
      [
        'Title',
        'Brand',
        'Platform',
        'Category',
        'Date',
        'Due',
        'Priority',
        'Status',
        'Start',
        'End',
        'Estimated hours',
        'Actual hours',
        'Output count',
        'Ad spend PKR',
        'Notes'
      ],
      ...filteredTasks.map((t) => [
        t.title,
        t.brand,
        t.platform || 'Other',
        t.category,
        t.date,
        t.due,
        t.priority,
        t.status,
        t.start,
        t.end,
        t.estimate,
        t.actual,
        t.output,
        t.spend,
        t.notes
      ])
    ];
    exportCSV(`akhtar-tasks-${todayStr()}.csv`, rows);
    notify('Exported tasks CSV');
  }, [filteredTasks, notify]);

  const handleExportProjectsCsv = useCallback(() => {
    const rows = [
      ['Title', 'Brand', 'Stage', 'Owner', 'Due', 'Notes'],
      ...state.projects.map((p) => [
        p.title,
        p.brand,
        p.stage,
        p.owner,
        p.due,
        p.notes
      ])
    ];
    exportCSV('akhtar-project-pipeline.csv', rows);
    notify('Exported pipeline CSV');
  }, [state.projects, notify]);

  const handleExportCalendarCsv = useCallback(() => {
    const rows = [
      [
        'Title',
        'Brand',
        'Platform',
        'Date',
        'Time',
        'Format',
        'Status',
        'Owner',
        'Brief / link'
      ],
      ...state.calendar.map((x) => [
        x.title,
        x.brand,
        x.platform,
        x.date,
        x.time,
        x.type,
        x.status,
        x.owner,
        x.copy
      ])
    ];
    exportCSV('workpulse-content-calendar.csv', rows);
    notify('Exported calendar CSV');
  }, [state.calendar, notify]);

  const handleDownloadReportCsv = useCallback(
    (reportsList) => {
      const rows = [
        [
          'Report',
          'Period start',
          'Period end',
          'Brand filter',
          'Tasks',
          'Completed',
          'Completion %',
          'Hours',
          'Outputs',
          'Task spend PKR',
          'Reach',
          'Impressions',
          'Engagements',
          'Clicks',
          'Leads',
          'Conversions',
          'KPI spend PKR'
        ]
      ];
      reportsList.forEach((r) => {
        rows.push([
          r.mode,
          r.start,
          r.end,
          brandFilter,
          r.all,
          r.done,
          r.rate.toFixed(1),
          r.hours,
          r.outputs,
          r.taskSpend,
          r.reach,
          r.impressions,
          r.engagements,
          r.clicks,
          r.leads,
          r.conversions,
          r.metricSpend
        ]);
      });
      exportCSV(`akhtar-performance-report-${todayStr()}.csv`, rows);
      notify('Downloaded performance report CSV');
    },
    [brandFilter, notify]
  );

  // If not authenticated, render Login Screen
  if (!currentUser) {
    return (
      <>
        <LoginView onLogin={handleLogin} />
        <Toast message={toastMsg} />
      </>
    );
  }

  // If viewing a dedicated client portal
  if (portalClient) {
    return (
      <>
        <ClientPortalView
          client={portalClient}
          tasks={state.tasks}
          projects={state.projects}
          calendar={state.calendar}
          metrics={state.metrics}
          onExitPortal={() => {
            setPortalClient(null);
            window.history.replaceState({}, document.title, window.location.pathname);
          }}
          notify={notify}
        />
        <Toast message={toastMsg} />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8fafc] text-[#0f172a]">
      {/* QUICK TASK MODAL */}
      <TaskModal
        isOpen={isTaskModalOpen}
        task={modalTask}
        defaultDate={periodDate}
        defaultBrand={modalDefaultBrand}
        onClose={() => {
          setIsTaskModalOpen(false);
          setModalTask(null);
        }}
        onSave={saveTask}
      />

      {/* SIDEBAR */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        settings={state.settings}
        isBackendConnected={isBackendConnected}
        tasks={state.tasks}
        calendar={state.calendar}
        projects={state.projects}
        clients={state.clients}
        onQuickAddTask={() => handleOpenAddTaskModal()}
        onLogout={handleLogout}
      />

      {/* MAIN WORKSPACE */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-9">
        <Topbar
          theme={theme}
          onToggleTheme={handleToggleTheme}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          settings={state.settings}
          isBackendConnected={isBackendConnected}
          onExportCsv={handleExportTasksCsv}
          onDownloadBackup={downloadBackup}
          onPrint={() => window.print()}
          onAddTask={() => handleOpenAddTaskModal()}
          onPlanContent={() => setActiveTab('planner')}
          onNavigate={setActiveTab}
          onLogout={handleLogout}
          currentUser={currentUser}
        />

        <FilterBar
          periodDate={periodDate}
          setPeriodDate={setPeriodDate}
          periodMode={periodMode}
          setPeriodMode={setPeriodMode}
          brandFilter={brandFilter}
          setBrandFilter={setBrandFilter}
          onResetFilters={handleResetFilters}
        />

        {activeTab === 'overview' && (
          <OverviewView
            filteredTasks={filteredTasks}
            filteredMetrics={filteredMetrics}
            settings={state.settings}
            brandFilter={brandFilter}
            onSelectBrandFilter={setBrandFilter}
            onNavigate={setActiveTab}
            onQuickAddTaskForBrand={(b) => handleOpenAddTaskModal(b)}
            onEditTask={handleOpenEditTaskModal}
            onUpdateTaskStatus={updateTaskStatus}
          />
        )}

        {activeTab === 'assistant' && (
          <DailyAssistantView
            tasks={state.tasks}
            calendar={state.calendar}
            settings={state.settings}
            isBackendConnected={isBackendConnected}
            onRefreshBackend={refreshFromBackend}
            onSyncTodayCalendarToTasks={syncTodayCalendarToTasks}
            onLogTimeToTask={logTimeToTask}
            onUpdateTaskStatus={updateTaskStatus}
            onConvertCalendarToTask={convertCalendarToTask}
            onNavigate={setActiveTab}
            onSendSlackEod={sendSlackEod}
          />
        )}

        {activeTab === 'tasks' && (
          <TasksView
            filteredTasks={filteredTasks}
            allCalendar={state.calendar}
            periodDate={periodDate}
            editingTask={editingTask}
            onClearEditingTask={() => setEditingTask(null)}
            onSaveTask={saveTask}
            onDuplicateTask={duplicateTask}
            onUpdateStatus={updateTaskStatus}
            onConvertCalendarToTask={convertCalendarToTask}
            onSyncTodayCalendarToTasks={syncTodayCalendarToTasks}
            onEditTask={setEditingTask}
            onDeleteTask={deleteTask}
            onClearCompleted={clearCompletedTasks}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'clients' && (
          <ClientsView
            clients={state.clients}
            filteredTasks={filteredTasks}
            brandFilter={brandFilter}
            onSelectBrandFilter={setBrandFilter}
            onQuickAddTaskForBrand={(b) => handleOpenAddTaskModal(b)}
            onNavigate={setActiveTab}
            onSaveClient={saveClient}
            onDeleteClient={deleteClient}
            onOpenClientPortal={(c) => setPortalClient(c)}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectsView
            projects={state.projects}
            recurringChecks={state.checklists?.recurring || {}}
            onToggleRecurringCheck={toggleRecurringCheck}
            onAddProject={addProject}
            onUpdateProject={updateProject}
            onDeleteProject={deleteProject}
            onConvertProjectToTask={convertProjectToTask}
            onSaveTask={saveTask}
            onExportProjects={handleExportProjectsCsv}
          />
        )}

        {activeTab === 'planner' && (
          <PlannerView
            calendar={state.calendar}
            plannerChecks={state.checklists?.planner || {}}
            onTogglePlannerCheck={togglePlannerCheck}
            onSetAllPlannerChecks={setAllPlannerChecks}
            onSaveCalendarItem={saveCalendarItem}
            onUpdateCalendarStatus={updateCalendarStatus}
            onDuplicateCalendarItem={duplicateCalendarItem}
            onConvertCalendarToTask={convertCalendarToTask}
            onDeleteCalendarItem={deleteCalendarItem}
            onExportCalendar={handleExportCalendarCsv}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsView
            allTasks={state.tasks}
            allMetrics={state.metrics}
            filteredMetrics={filteredMetrics}
            periodDate={periodDate}
            brandFilter={brandFilter}
            settings={state.settings}
            onAddMetric={addMetric}
            onDeleteMetric={deleteMetric}
            onDownloadReport={handleDownloadReportCsv}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            settings={state.settings}
            clients={state.clients}
            onSaveSettings={saveSettings}
            onDownloadBackup={downloadBackup}
            onRestoreBackup={restoreBackup}
            onLoadSampleData={loadSampleData}
            onClearAllToEmpty={clearAllToEmpty}
            onTestSlackWebhook={testSlackWebhook}
          />
        )}

        {/* FOOTER */}
        <footer className="flex flex-wrap items-center justify-between gap-3 mt-8 pt-4 border-t border-[#e5eaf2] text-[11px] text-[#667085]">
          <div className="flex items-center gap-2">
            <span>WorkPulse · Akhtar Ali · Personal Performance Hub</span>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                isBackendConnected
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-amber-50 text-amber-700'
              }`}
            >
              {isBackendConnected ? '● Backend API Synced' : '○ Offline Mode'}
            </span>
          </div>
          <span>Local-first with Express Database Persistence</span>
        </footer>
      </main>

      {/* TOAST */}
      <Toast message={toastMsg} />
    </div>
  );
}
