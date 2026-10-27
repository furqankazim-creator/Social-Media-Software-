import { LINKEDIN_SHARED_CLIENTS, DEFAULT_CLIENTS } from '../constants/dashboardConfig';

export const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

export const localDate = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;

export const todayStr = () => localDate(new Date());

export const formatMoney = (n) =>
  'PKR ' +
  Number(n || 0).toLocaleString('en-PK', { maximumFractionDigits: 0 });

export const formatNum = (n, maxDec = 2) =>
  Number(n || 0).toLocaleString('en-PK', { maximumFractionDigits: maxDec });

export const pct = (a, b) => (b ? (Number(a || 0) / Number(b || 0)) * 100 : 0);

export const timeMinutes = (v) => {
  if (!v || !v.includes(':')) return 0;
  const [h, m] = v.split(':').map(Number);
  return h * 60 + m;
};

export const periodBounds = (mode, dateStr) => {
  const d = new Date((dateStr || todayStr()) + 'T12:00:00');
  let start, end;
  if (mode === 'daily') {
    start = new Date(d);
    end = new Date(d);
  } else if (mode === 'weekly') {
    start = new Date(d);
    const day = (start.getDay() + 6) % 7;
    start.setDate(start.getDate() - day);
    end = new Date(start);
    end.setDate(start.getDate() + 6);
  } else {
    start = new Date(d.getFullYear(), d.getMonth(), 1);
    end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  }
  return [localDate(start), localDate(end)];
};

export const calculateProductiveHours = (settings) => {
  if (!settings) return 5;
  const workStart = timeMinutes(settings.start || '11:00');
  const workEnd = timeMinutes(settings.end || '17:00');
  const breakStart = timeMinutes(settings.breakStart || '13:30');
  const breakEnd = timeMinutes(settings.breakEnd || '14:30');

  const totalWork = Math.max(0, workEnd - workStart);
  const overlapBreak = Math.max(
    0,
    Math.min(workEnd, breakEnd) - Math.max(workStart, breakStart)
  );
  return Math.max(0, (totalWork - overlapBreak) / 60);
};

export const exportCSV = (filename, rows) => {
  const csvCell = (v) => '"' + String(v ?? '').replace(/"/g, '""') + '"';
  const content = rows.map((r) => r.map(csvCell).join(',')).join('\r\n');
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const downloadJSON = (filename, data) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const getDefaultDashboardState = () => ({
  tasks: [],
  metrics: [],
  calendar: [],
  clients: [...DEFAULT_CLIENTS],
  projects: [
    {
      id: uid(),
      title: 'Company profile development',
      brand: 'Time Global Tech',
      stage: 'Drafting',
      owner: 'Akhtar Ali',
      due: '',
      notes: 'Update services, positioning and proof points'
    },
    {
      id: uid(),
      title: 'Case study pipeline',
      brand: 'Time Global Tech',
      stage: 'Backlog',
      owner: 'Akhtar Ali',
      due: '',
      notes: 'Collect outcomes, screenshots and client approval'
    },
    {
      id: uid(),
      title: 'Women’s family legal support campaign review',
      brand: 'Legal Tech Pakistan',
      stage: 'In review',
      owner: 'Akhtar Ali',
      due: '',
      notes: 'Track qualified leads and client conversions'
    },
    {
      id: uid(),
      title: 'Data governance content carousel',
      brand: 'Orgpyur Technologies Inc.',
      stage: 'Drafting',
      owner: 'Akhtar Ali',
      due: '',
      notes: 'Four-slide carousel; check brand style'
    },
    {
      id: uid(),
      title: 'LinkedIn job-growth content plan',
      brand: 'MoneyMinds Technologies Inc.',
      stage: 'Backlog',
      owner: 'Akhtar Ali',
      due: '',
      notes: 'Plan weekly content and page-follow CTA'
    },
    {
      id: uid(),
      title: 'LinkedIn hiring workflow',
      brand: 'Orgpyur Technologies Inc.',
      stage: 'Backlog',
      owner: 'Akhtar Ali',
      due: '',
      notes: 'Job post, applicant review, screening status and follow-up'
    }
  ],
  settings: {
    start: '11:00',
    end: '17:00',
    breakStart: '13:30',
    breakEnd: '14:30',
    weeklyGoal: 25,
    monthlyOutputGoal: 80,
    slackWebhookUrl: '',
    notificationEmail: 'proposal.tgi@gmail.com',
    clientPortalsEnabled: true
  }
});

export const getSampleDemoData = () => {
  const d = todayStr();
  const y = new Date();
  y.setDate(y.getDate() - 1);
  const yd = localDate(y);
  const base = getDefaultDashboardState();

  return {
    ...base,
    calendar: [
      {
        id: uid(),
        title: 'Weekly value-led carousel: Enterprise AI Roadmaps',
        brand: 'Time Global Tech',
        platform: 'LinkedIn',
        date: d,
        time: '14:30',
        type: 'Carousel',
        status: 'Approved',
        owner: 'Akhtar Ali',
        copy: 'Sample item — Hook: Most AI rollouts stall after 90 days. Here is the blueprint.'
      },
      {
        id: uid(),
        title: 'Short-form product explainer reel',
        brand: 'MoneyMinds Technologies Inc.',
        platform: 'LinkedIn',
        date: yd,
        time: '16:00',
        type: 'Short video / Reel',
        status: 'Drafting',
        owner: 'Akhtar Ali',
        copy: 'Sample item — 45s screen walkthrough highlighting recruitment velocity.'
      }
    ],
    tasks: [
      {
        id: uid(),
        title: 'Research competitor content and trends',
        brand: 'Time Global Tech',
        platform: 'LinkedIn — shared account',
        category: 'Research & strategy',
        date: d,
        due: d,
        priority: 'High',
        status: 'Completed',
        start: '11:00',
        end: '12:00',
        estimate: 1,
        actual: 1,
        output: 0,
        spend: 0,
        notes: 'Reviewed competitor posts and content gaps'
      },
      {
        id: uid(),
        title: 'Create and schedule social posts',
        brand: 'Time Global Tech',
        platform: 'LinkedIn — shared account',
        category: 'Content creation & design',
        date: d,
        due: d,
        priority: 'High',
        status: 'In progress',
        start: '12:00',
        end: '14:00',
        estimate: 2,
        actual: 1.5,
        output: 3,
        spend: 0,
        notes: 'Drafted captions and creative assets'
      },
      {
        id: uid(),
        title: 'Review family-law campaign leads',
        brand: 'Legal Tech Pakistan',
        platform: 'Facebook',
        category: 'Paid media management',
        date: d,
        due: d,
        priority: 'Urgent',
        status: 'In progress',
        start: '14:00',
        end: '15:00',
        estimate: 1,
        actual: 1,
        output: 0,
        spend: 2500,
        notes: 'Review qualified inquiries and follow-up process'
      },
      {
        id: uid(),
        title: 'Draft data governance carousel',
        brand: 'Orgpyur Technologies Inc.',
        platform: 'LinkedIn — shared account',
        category: 'Content creation & design',
        date: yd,
        due: d,
        priority: 'Medium',
        status: 'Completed',
        start: '13:00',
        end: '14:30',
        estimate: 1.5,
        actual: 1.5,
        output: 1,
        spend: 0,
        notes: 'Four-slide carousel draft ready for review'
      },
      {
        id: uid(),
        title: 'Prepare job post variants',
        brand: 'MoneyMinds Technologies Inc.',
        platform: 'LinkedIn — shared account',
        category: 'Publishing & scheduling',
        date: d,
        due: d,
        priority: 'Medium',
        status: 'Not started',
        start: '15:00',
        end: '16:00',
        estimate: 1,
        actual: 0,
        output: 0,
        spend: 0,
        notes: 'Plan three distinct job-post versions'
      }
    ],
    metrics: [
      {
        id: uid(),
        date: d,
        brand: 'Time Global Tech',
        platform: 'LinkedIn — shared account',
        reach: 1200,
        impressions: 1800,
        engagements: 95,
        clicks: 32,
        leads: 2,
        conversions: 1,
        spend: 0,
        cpc: '',
        ctr: '',
        notes: 'Organic enterprise carousel performance'
      },
      {
        id: uid(),
        date: d,
        brand: 'Legal Tech Pakistan',
        platform: 'Meta Ads',
        reach: 950,
        impressions: 1400,
        engagements: 50,
        clicks: 44,
        leads: 8,
        conversions: 1,
        spend: 2500,
        cpc: '',
        ctr: '',
        notes: 'Targeted family legal consultation campaign'
      }
    ],
    clients: [...DEFAULT_CLIENTS]
  };
};

export const normalizeState = (raw) => {
  const fallback = getDefaultDashboardState();
  if (!raw || typeof raw !== 'object') return fallback;

  const brandAliases = {
    Orgpyur: 'Orgpyur Technologies Inc.',
    MoneyMinds: 'MoneyMinds Technologies Inc.'
  };

  const clients = Array.isArray(raw.clients) && raw.clients.length > 0
    ? raw.clients
    : [...DEFAULT_CLIENTS];

  const tasks = Array.isArray(raw.tasks)
    ? raw.tasks.map((t) => {
        const brand = brandAliases[t.brand] || t.brand;
        const platform =
          t.platform ||
          (LINKEDIN_SHARED_CLIENTS.includes(brand)
            ? 'LinkedIn — shared account'
            : 'Other');
        let category = t.category || 'Research & strategy';
        let notes = t.notes || '';
        if (/case study/i.test(category) && brand !== 'Time Global Tech') {
          category = 'Research & strategy';
          notes =
            (notes ? notes + ' | ' : '') +
            'Case study work is restricted to Time Global Tech.';
        }
        return { ...t, brand, platform, category, notes };
      })
    : fallback.tasks;

  const metrics = Array.isArray(raw.metrics)
    ? raw.metrics.map((m) => ({
        ...m,
        brand: brandAliases[m.brand] || m.brand
      }))
    : fallback.metrics;

  const projects = Array.isArray(raw.projects)
    ? raw.projects.map((p) => {
        let brand = brandAliases[p.brand] || p.brand;
        if (/case study/i.test(p.title || '') && brand !== 'Time Global Tech') {
          brand = 'Time Global Tech';
        }
        return { ...p, brand };
      })
    : fallback.projects;

  const calendar = Array.isArray(raw.calendar) ? raw.calendar : fallback.calendar;
  const settings = raw.settings
    ? { ...fallback.settings, ...raw.settings }
    : fallback.settings;

  return { tasks, metrics, projects, calendar, settings, clients };
};

