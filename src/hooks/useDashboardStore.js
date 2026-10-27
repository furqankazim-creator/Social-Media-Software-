import { useState, useEffect, useCallback } from 'react';
import {
  uid,
  todayStr,
  getDefaultDashboardState,
  getSampleDemoData,
  normalizeState,
  downloadJSON
} from '../utils/helpers';

const STORAGE_KEY = 'workpulse-akhtar-v1';
const API_BASE = '/api';

export function useDashboardStore() {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...normalizeState(parsed),
          checklists: parsed.checklists || {
            planner: {},
            recurring: {}
          }
        };
      }
    } catch (err) {
      console.error('Failed to read localStorage:', err);
    }
    return {
      ...getSampleDemoData(),
      checklists: {
        planner: {},
        recurring: {}
      }
    };
  });

  const [toastMsg, setToastMsg] = useState(null);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  const notify = useCallback((msg) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((cur) => (cur === msg ? null : cur));
    }, 3200);
  }, []);

  // Fetch initial state from backend on mount
  useEffect(() => {
    let isMounted = true;
    async function initFromBackend() {
      try {
        const res = await fetch(`${API_BASE}/state`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data && Array.isArray(data.tasks)) {
            const normalized = {
              ...normalizeState(data),
              checklists: data.checklists || { planner: {}, recurring: {} }
            };
            setState(normalized);
            setIsBackendConnected(true);
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
            } catch (e) {}
          }
        } else {
          if (isMounted) setIsBackendConnected(false);
        }
      } catch (err) {
        if (isMounted) setIsBackendConnected(false);
      }
    }
    initFromBackend();
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync state changes to localStorage and Backend API
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {}

    // Send update to backend in background
    fetch(`${API_BASE}/state`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state)
    })
      .then((res) => {
        if (res.ok) setIsBackendConnected(true);
      })
      .catch(() => {
        setIsBackendConnected(false);
      });
  }, [state]);

  // Force manual sync with backend
  const refreshFromBackend = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/state`);
      if (res.ok) {
        const data = await res.json();
        const normalized = {
          ...normalizeState(data),
          checklists: data.checklists || { planner: {}, recurring: {} }
        };
        setState(normalized);
        setIsBackendConnected(true);
        notify('Synced successfully with Backend Database');
      }
    } catch (e) {
      notify('Backend is currently offline, using local data');
      setIsBackendConnected(false);
    }
  }, [notify]);

  // --- TASKS CRUD ---
  const saveTask = useCallback(
    (task) => {
      if (
        task.start &&
        task.end &&
        task.end < task.start &&
        Number(task.actual || 0) === 0
      ) {
        notify('⚠️ End time is earlier than start time. Check the time range.');
        return false;
      }

      if (
        /case study/i.test(task.category || '') &&
        task.brand !== 'Time Global Tech'
      ) {
        notify('⚠️ Case studies can only be assigned to Time Global Tech.');
        return false;
      }

      const cleanTask = {
        id: task.id || uid(),
        title: task.title.trim(),
        brand: task.brand || 'Time Global Tech',
        platform: task.platform || 'LinkedIn — shared account',
        category: task.category || 'Research & strategy',
        date: task.date || todayStr(),
        due: task.due || '',
        priority: task.priority || 'Medium',
        status: task.status || 'Not started',
        start: task.start || '11:00',
        end: task.end || '12:00',
        estimate: Number(task.estimate || 0),
        actual: Number(task.actual || 0),
        output: Number(task.output || 0),
        spend: Number(task.spend || 0),
        notes: (task.notes || '').trim()
      };

      setState((prev) => {
        if (task.id) {
          return {
            ...prev,
            tasks: prev.tasks.map((t) => (t.id === task.id ? cleanTask : t))
          };
        }
        return {
          ...prev,
          tasks: [cleanTask, ...prev.tasks]
        };
      });

      notify(task.id ? 'Task updated' : 'Task saved');
      return true;
    },
    [notify]
  );

  const duplicateTask = useCallback(
    (task) => {
      const copy = {
        ...task,
        id: uid(),
        title: `${task.title} (Copy)`,
        date: todayStr(),
        status: 'Not started'
      };
      setState((prev) => ({
        ...prev,
        tasks: [copy, ...prev.tasks]
      }));
      notify('Task duplicated');
    },
    [notify]
  );

  const updateTaskStatus = useCallback(
    (id, status) => {
      setState((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) => (t.id === id ? { ...t, status } : t))
      }));
      notify(`Task status: "${status}"`);
    },
    [notify]
  );

  const logTimeToTask = useCallback(
    (id, hoursToAdd) => {
      setState((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) =>
          t.id === id
            ? {
                ...t,
                actual: Math.round((Number(t.actual || 0) + Number(hoursToAdd)) * 100) / 100,
                status: t.status === 'Not started' ? 'In progress' : t.status
              }
            : t
        )
      }));
      notify(`Logged +${hoursToAdd}h to task`);
    },
    [notify]
  );

  const deleteTask = useCallback(
    (id) => {
      if (!window.confirm('Delete this task?')) return;
      setState((prev) => ({
        ...prev,
        tasks: prev.tasks.filter((t) => t.id !== id)
      }));
      notify('Task deleted');
    },
    [notify]
  );

  const clearCompletedTasks = useCallback(
    (filteredTasksList) => {
      const completedIds = new Set(
        filteredTasksList
          .filter((t) => t.status === 'Completed')
          .map((t) => t.id)
      );
      if (completedIds.size === 0) {
        notify('No completed tasks in this filter');
        return;
      }
      if (
        window.confirm(
          `Delete ${completedIds.size} completed task(s) in the selected period and brand filter?`
        )
      ) {
        setState((prev) => ({
          ...prev,
          tasks: prev.tasks.filter((t) => !completedIds.has(t.id))
        }));
        notify(`Cleared ${completedIds.size} completed task(s)`);
      }
    },
    [notify]
  );

  // --- PROJECTS / PIPELINE CRUD ---
  const addProject = useCallback(
    (customItem = {}) => {
      const newItem = {
        id: uid(),
        title: customItem.title || 'New deliverable',
        brand: customItem.brand || 'Time Global Tech',
        stage: customItem.stage || 'Backlog',
        owner: customItem.owner || 'Akhtar Ali',
        due: customItem.due || todayStr(),
        notes: customItem.notes || ''
      };
      setState((prev) => ({
        ...prev,
        projects: [...prev.projects, newItem]
      }));
      notify('Pipeline deliverable added');
    },
    [notify]
  );

  const updateProject = useCallback(
    (id, prop, value) => {
      let blocked = false;
      setState((prev) => {
        const current = prev.projects.find((p) => p.id === id);
        if (!current) return prev;
        const nextTitle = prop === 'title' ? value : current.title;
        const nextBrand = prop === 'brand' ? value : current.brand;
        if (
          /case study/i.test(nextTitle || '') &&
          nextBrand !== 'Time Global Tech'
        ) {
          blocked = true;
          return prev;
        }
        return {
          ...prev,
          projects: prev.projects.map((p) =>
            p.id === id ? { ...p, [prop]: value } : p
          )
        };
      });
      if (blocked) {
        notify('⚠️ Case studies are reserved for Time Global Tech.');
      }
    },
    [notify]
  );

  const deleteProject = useCallback(
    (id) => {
      if (!window.confirm('Delete this pipeline item?')) return;
      setState((prev) => ({
        ...prev,
        projects: prev.projects.filter((p) => p.id !== id)
      }));
      notify('Pipeline item deleted');
    },
    [notify]
  );

  const convertProjectToTask = useCallback(
    (project) => {
      const newTask = {
        id: uid(),
        title: project.title,
        brand: project.brand || 'Time Global Tech',
        platform: 'LinkedIn — shared account',
        category:
          /case study/i.test(project.title || '') &&
          project.brand === 'Time Global Tech'
            ? 'Case study / company profile (TGT only)'
            : 'Content creation & design',
        date: todayStr(),
        due: project.due || todayStr(),
        priority: 'High',
        status: project.stage === 'Published' ? 'Completed' : 'In progress',
        start: '11:00',
        end: '12:30',
        estimate: 1.5,
        actual: 0,
        output: 1,
        spend: 0,
        notes: `Pipeline stage: ${project.stage}${
          project.notes ? ' — ' + project.notes : ''
        }`
      };
      setState((prev) => ({
        ...prev,
        tasks: [newTask, ...prev.tasks]
      }));
      notify(`Converted "${project.title}" into a Daily Task`);
    },
    [notify]
  );

  // --- CALENDAR / PLANNER CRUD ---
  const saveCalendarItem = useCallback(
    (item) => {
      setState((prev) => {
        if (item.id) {
          return {
            ...prev,
            calendar: prev.calendar.map((c) => (c.id === item.id ? item : c))
          };
        }
        return {
          ...prev,
          calendar: [{ ...item, id: uid() }, ...prev.calendar]
        };
      });
      notify(item.id ? 'Calendar item updated' : 'Calendar item scheduled');
    },
    [notify]
  );

  const updateCalendarStatus = useCallback(
    (id, status) => {
      setState((prev) => ({
        ...prev,
        calendar: prev.calendar.map((c) =>
          c.id === id ? { ...c, status } : c
        )
      }));
      notify(`Content status: "${status}"`);
    },
    [notify]
  );

  const duplicateCalendarItem = useCallback(
    (item) => {
      const copy = {
        ...item,
        id: uid(),
        title: `${item.title} (Copy)`,
        status: 'Drafting'
      };
      setState((prev) => ({
        ...prev,
        calendar: [copy, ...prev.calendar]
      }));
      notify('Content item duplicated');
    },
    [notify]
  );

  // Single planned item -> Task sync
  const convertCalendarToTask = useCallback(
    (calItem) => {
      const platformMap =
        calItem.platform === 'LinkedIn'
          ? 'LinkedIn — shared account'
          : calItem.platform || 'Other';

      const newTask = {
        id: uid(),
        title: `[Publish] ${calItem.title}`,
        brand: calItem.brand || 'Time Global Tech',
        platform: platformMap,
        category:
          calItem.platform === 'LinkedIn'
            ? 'LinkedIn post scheduling & publishing'
            : 'Publishing & scheduling',
        date: calItem.date || todayStr(),
        due: calItem.date || todayStr(),
        priority: 'High',
        status: calItem.status === 'Published' ? 'Completed' : 'In progress',
        start: calItem.time || '14:30',
        end: '15:30',
        estimate: 1,
        actual: calItem.status === 'Published' ? 1 : 0,
        output: 1,
        spend: 0,
        notes: `Format: ${calItem.type || 'Post'} | Status: ${calItem.status}${
          calItem.copy ? ' | Copy: ' + calItem.copy : ''
        }`
      };

      setState((prev) => ({
        ...prev,
        tasks: [newTask, ...prev.tasks]
      }));
      notify(`Synced "${calItem.title}" to Daily Tasks`);
    },
    [notify]
  );

  // Batch sync ALL of today's planned calendar items to daily tasks!
  const syncTodayCalendarToTasks = useCallback(
    (targetDate = todayStr()) => {
      const todayCalendar = state.calendar.filter((c) => c.date === targetDate);
      if (todayCalendar.length === 0) {
        notify('No planned content found for today in the Content Planner');
        return 0;
      }

      const existingTitles = new Set(
        state.tasks
          .filter((t) => t.date === targetDate)
          .map((t) => t.title.toLowerCase())
      );
      const newTasks = [];

      for (const item of todayCalendar) {
        const title = `[Publish] ${item.title}`;
        if (!existingTitles.has(title.toLowerCase())) {
          const platformMap =
            item.platform === 'LinkedIn'
              ? 'LinkedIn — shared account'
              : item.platform || 'Other';
          newTasks.push({
            id: uid(),
            title,
            brand: item.brand || 'Time Global Tech',
            platform: platformMap,
            category:
              item.platform === 'LinkedIn'
                ? 'LinkedIn post scheduling & publishing'
                : 'Publishing & scheduling',
            date: targetDate,
            due: targetDate,
            priority: 'High',
            status: item.status === 'Published' ? 'Completed' : 'In progress',
            start: item.time || '14:30',
            end: '15:30',
            estimate: 1,
            actual: item.status === 'Published' ? 1 : 0,
            output: 1,
            spend: 0,
            notes: `Format: ${item.type || 'Post'} | Workflow: ${item.status}${
              item.copy ? ' | Copy: ' + item.copy : ''
            }`
          });
        }
      }

      if (newTasks.length > 0) {
        setState((prev) => ({
          ...prev,
          tasks: [...newTasks, ...prev.tasks]
        }));
        notify(`⚡ Added ${newTasks.length} planned post(s) to today's Daily Tasks!`);
      } else {
        notify("All today's planned posts are already in your Daily Tasks!");
      }
      return newTasks.length;
    },
    [state.calendar, state.tasks, notify]
  );

  const deleteCalendarItem = useCallback(
    (id) => {
      if (!window.confirm('Delete this planned content item?')) return;
      setState((prev) => ({
        ...prev,
        calendar: prev.calendar.filter((c) => c.id !== id)
      }));
      notify('Calendar item deleted');
    },
    [notify]
  );

  // --- CHECKLISTS PERSISTENCE ---
  const togglePlannerCheck = useCallback((checkId) => {
    setState((prev) => {
      const cur = prev.checklists?.planner || {};
      return {
        ...prev,
        checklists: {
          ...prev.checklists,
          planner: { ...cur, [checkId]: !cur[checkId] }
        }
      };
    });
  }, []);

  const setAllPlannerChecks = useCallback(
    (ids, val) => {
      const next = {};
      ids.forEach((id) => {
        next[id] = val;
      });
      setState((prev) => ({
        ...prev,
        checklists: {
          ...prev.checklists,
          planner: next
        }
      }));
      notify(
        val
          ? 'All pre-publish checks verified'
          : 'Pre-publish checklist reset'
      );
    },
    [notify]
  );

  const toggleRecurringCheck = useCallback((checkId) => {
    setState((prev) => {
      const cur = prev.checklists?.recurring || {};
      return {
        ...prev,
        checklists: {
          ...prev.checklists,
          recurring: { ...cur, [checkId]: !cur[checkId] }
        }
      };
    });
  }, []);

  // --- METRICS / KPIS CRUD ---
  const saveMetric = useCallback(
    (metric) => {
      setState((prev) => {
        if (metric.id) {
          return {
            ...prev,
            metrics: prev.metrics.map((m) => (m.id === metric.id ? metric : m))
          };
        }
        return {
          ...prev,
          metrics: [{ ...metric, id: uid() }, ...prev.metrics]
        };
      });
      notify(metric.id ? 'KPI record updated' : 'KPI record saved');
    },
    [notify]
  );

  const deleteMetric = useCallback(
    (id) => {
      if (!window.confirm('Delete this KPI record?')) return;
      setState((prev) => ({
        ...prev,
        metrics: prev.metrics.filter((m) => m.id !== id)
      }));
      notify('KPI record deleted');
    },
    [notify]
  );

  // --- SETTINGS & DATA BACKUP ---
  const saveSettings = useCallback(
    (newSettings) => {
      const { start, end, breakStart, breakEnd } = newSettings;
      if (!start || !end || end <= start) {
        notify('⚠️ Please enter a valid work time range');
        return false;
      }
      if (
        (breakStart && !breakEnd) ||
        (!breakStart && breakEnd) ||
        (breakStart && breakEnd && breakEnd <= breakStart)
      ) {
        notify('⚠️ Please enter a valid break time range');
        return false;
      }
      setState((prev) => ({
        ...prev,
        settings: {
          ...newSettings,
          weeklyGoal: Number(newSettings.weeklyGoal) || 25,
          monthlyOutputGoal: Number(newSettings.monthlyOutputGoal) || 80
        }
      }));
      notify('Settings saved');
      return true;
    },
    [notify]
  );

  // --- CLIENTS MANAGEMENT ---
  const saveClient = useCallback(
    (clientData) => {
      const isEdit = Boolean(clientData.id);
      const clientId = clientData.id || uid();
      const updatedClient = {
        ...clientData,
        id: clientId,
        name: clientData.name?.trim() || 'Untitled Client',
        color: clientData.color || '#3157d5',
        platforms: clientData.platforms || ['LinkedIn — shared account'],
        portalEnabled: clientData.portalEnabled !== false,
        portalPassword: clientData.portalPassword || ''
      };

      setState((prev) => {
        const existing = prev.clients || [];
        const filtered = existing.filter((c) => c.id !== clientId);
        return {
          ...prev,
          clients: [...filtered, updatedClient]
        };
      });

      notify(
        isEdit
          ? `Client '${updatedClient.name}' updated`
          : `New client '${updatedClient.name}' added`
      );
      return updatedClient;
    },
    [notify]
  );

  const deleteClient = useCallback(
    (clientId) => {
      const client = (state.clients || []).find((c) => c.id === clientId);
      if (!client) return;
      if (
        !window.confirm(
          `Are you sure you want to delete client '${client.name}'? Existing tasks and projects for this client will be preserved.`
        )
      ) {
        return;
      }
      setState((prev) => ({
        ...prev,
        clients: (prev.clients || []).filter((c) => c.id !== clientId)
      }));
      notify(`Client '${client.name}' removed`);
    },
    [state.clients, notify]
  );

  // --- SLACK EOD & INTEGRATIONS ---
  const sendSlackEod = useCallback(
    async ({ webhookUrl, reportText }) => {
      try {
        const targetUrl = webhookUrl || state.settings?.slackWebhookUrl;
        if (!targetUrl) {
          notify('⚠️ Please configure a Slack Webhook URL in Settings first');
          return { success: false, error: 'No webhook URL' };
        }
        notify('Sending EOD Report to Slack...');
        const res = await fetch(`${API_BASE}/eod/slack`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            webhookUrl: targetUrl,
            reportText,
            date: todayStr()
          })
        });
        const data = await res.json();
        if (data.success) {
          notify('🚀 EOD report dispatched to Slack channel!');
          return { success: true };
        } else {
          notify(`⚠️ Slack dispatch failed: ${data.error}`);
          return { success: false, error: data.error };
        }
      } catch (err) {
        notify(`⚠️ Could not reach Slack API: ${err.message}`);
        return { success: false, error: err.message };
      }
    },
    [state.settings, notify]
  );

  const testSlackWebhook = useCallback(
    async (testUrl) => {
      try {
        const url = testUrl || state.settings?.slackWebhookUrl;
        if (!url) {
          notify('⚠️ Enter a Slack Webhook URL to test');
          return { success: false };
        }
        notify('Testing Slack Webhook connection...');
        const res = await fetch(`${API_BASE}/slack/test`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ webhookUrl: url })
        });
        const data = await res.json();
        if (data.success) {
          notify('✅ Slack Webhook test successful! Message delivered.');
          return { success: true };
        } else {
          notify(`❌ Slack test failed: ${data.error}`);
          return { success: false, error: data.error };
        }
      } catch (err) {
        notify(`❌ Slack connection error: ${err.message}`);
        return { success: false, error: err.message };
      }
    },
    [state.settings, notify]
  );

  const downloadBackup = useCallback(() => {
    downloadJSON(`workpulse-backup-${todayStr()}.json`, state);
    notify('Full JSON backup downloaded');
  }, [state, notify]);

  const restoreBackup = useCallback(
    async (file) => {
      if (!file) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        if (
          !Array.isArray(data.tasks) ||
          !Array.isArray(data.metrics) ||
          !Array.isArray(data.projects)
        ) {
          throw new Error('This does not look like a WorkPulse backup.');
        }
        if (window.confirm('Replace current dashboard data with this backup?')) {
          const normalized = {
            ...normalizeState(data),
            checklists: data.checklists || { planner: {}, recurring: {} }
          };
          setState(normalized);
          notify('Backup restored successfully');
        }
      } catch (err) {
        window.alert('Could not import backup: ' + err.message);
      }
    },
    [notify]
  );

  const loadSampleData = useCallback(() => {
    if (
      !window.confirm(
        'Load sample tasks and metrics? This replaces current data. Download a backup first if needed.'
      )
    )
      return;
    const sample = {
      ...getSampleDemoData(),
      checklists: { planner: {}, recurring: {} }
    };
    setState(sample);
    notify('Sample data loaded');
  }, [notify]);

  const clearAllToEmpty = useCallback(() => {
    if (
      !window.confirm(
        'Clear all tasks and metrics to start fresh with an empty register?'
      )
    )
      return;
    const empty = {
      ...getDefaultDashboardState(),
      checklists: { planner: {}, recurring: {} }
    };
    setState(empty);
    notify('Workspace reset to clean starter state');
  }, [notify]);

  return {
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
    addMetric: saveMetric,
    saveMetric,
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
  };
}
