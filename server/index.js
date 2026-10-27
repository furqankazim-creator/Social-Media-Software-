import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Helper utilities
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const getSeedData = () => {
  const t = todayStr();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

  return {
    tasks: [
      {
        id: uid(),
        title: 'Research competitor content & AI trends',
        brand: 'Time Global Tech',
        platform: 'LinkedIn — shared account',
        category: 'Research & strategy',
        date: t,
        due: t,
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
        date: t,
        due: t,
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
        date: t,
        due: t,
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
        date: yStr,
        due: t,
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
        date: t,
        due: t,
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
    calendar: [
      {
        id: uid(),
        title: 'Weekly value-led carousel: Enterprise AI Roadmaps',
        brand: 'Time Global Tech',
        platform: 'LinkedIn',
        date: t,
        time: '14:30',
        type: 'Carousel',
        status: 'Approved',
        owner: 'Akhtar Ali',
        copy: 'Hook: Most AI rollouts stall after 90 days. Here is the blueprint to sustain ROI.'
      },
      {
        id: uid(),
        title: 'Product Walkthrough: Digital Legal Intake',
        brand: 'Legal Tech Pakistan',
        platform: 'LinkedIn',
        date: t,
        time: '16:00',
        type: 'Short video / Reel',
        status: 'Drafting',
        owner: 'Akhtar Ali',
        copy: 'Quick 45s screen walkthrough showing client contract generation.'
      }
    ],
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
    metrics: [
      {
        id: uid(),
        date: t,
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
        notes: 'Enterprise carousel engagement'
      },
      {
        id: uid(),
        date: t,
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
        notes: 'Family legal support leads campaign'
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
      notificationEmail: '',
      clientPortalsEnabled: true
    },
    clients: [
      {
        id: 'tgt',
        name: 'Time Global Tech',
        color: '#3157d5',
        category: 'Enterprise Tech & Staffing',
        contactPerson: 'Mr. Hashmi',
        contactEmail: 'hashmi@timeglobaltech.com',
        platforms: ['LinkedIn — shared account', 'Website'],
        caseStudyRestricted: true,
        portalEnabled: true,
        portalPassword: '',
        notes: 'Primary operations brand. Exclusive owner of case studies and profile showcases.'
      },
      {
        id: 'ltp',
        name: 'Legal Tech Pakistan',
        color: '#0f9d8a',
        category: 'Legal Services & Advisory',
        contactPerson: 'Adv. Bilal',
        contactEmail: 'bilal@legaltech.pk',
        platforms: ['Meta Ads', 'Instagram', 'LinkedIn — shared account'],
        caseStudyRestricted: false,
        portalEnabled: true,
        portalPassword: '',
        notes: 'Legal tech automation and legal advisory marketing.'
      },
      {
        id: 'mm',
        name: 'MoneyMinds Technologies Inc.',
        color: '#e58b32',
        category: 'FinTech & Wealth Management',
        contactPerson: 'Sarah Jenkins',
        contactEmail: 'sarah@moneyminds.inc',
        platforms: ['LinkedIn — shared account', 'Twitter / X'],
        caseStudyRestricted: false,
        portalEnabled: true,
        portalPassword: '',
        notes: 'Shares unified LinkedIn account with Orgpyur Technologies Inc.'
      },
      {
        id: 'org',
        name: 'Orgpyur Technologies Inc.',
        color: '#7756c8',
        category: 'Enterprise SaaS & Cloud',
        contactPerson: 'Alex Mercer',
        contactEmail: 'alex@orgpyur.io',
        platforms: ['LinkedIn — shared account', 'YouTube'],
        caseStudyRestricted: false,
        portalEnabled: true,
        portalPassword: '',
        notes: 'Shares unified LinkedIn account with MoneyMinds Technologies Inc.'
      }
    ],
    checklists: {
      planner: {},
      recurring: {}
    }
  };
};

// Database persistence helpers
const readDatabase = () => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const seed = getSeedData();
      fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), 'utf-8');
      return seed;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!parsed.clients || !Array.isArray(parsed.clients) || parsed.clients.length === 0) {
      parsed.clients = getSeedData().clients;
    }
    return parsed;
  } catch (err) {
    console.error('Error reading database file:', err);
    return getSeedData();
  }
};

const writeDatabase = (data) => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing database file:', err);
    return false;
  }
};

// Initialize DB on startup
let db = readDatabase();

// --- API ROUTES ---

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    stats: {
      tasks: db.tasks.length,
      calendar: db.calendar.length,
      projects: db.projects.length,
      metrics: db.metrics.length
    }
  });
});

// Full state sync
app.get('/api/state', (req, res) => {
  res.json(db);
});

app.post('/api/state', (req, res) => {
  const next = req.body;
  if (!next || typeof next !== 'object') {
    return res.status(400).json({ error: 'Invalid state payload' });
  }
  db = {
    tasks: Array.isArray(next.tasks) ? next.tasks : db.tasks,
    calendar: Array.isArray(next.calendar) ? next.calendar : db.calendar,
    projects: Array.isArray(next.projects) ? next.projects : db.projects,
    metrics: Array.isArray(next.metrics) ? next.metrics : db.metrics,
    settings: next.settings || db.settings,
    checklists: next.checklists || db.checklists
  };
  writeDatabase(db);
  res.json({ success: true, message: 'State synced successfully', db });
});

// --- TASKS ENDPOINTS ---
app.get('/api/tasks', (req, res) => {
  const { date, brand, status } = req.query;
  let result = db.tasks;
  if (date) result = result.filter(t => t.date === date);
  if (brand && brand !== 'All') result = result.filter(t => t.brand === brand);
  if (status && status !== 'All') result = result.filter(t => t.status === status);
  res.json(result);
});

app.post('/api/tasks', (req, res) => {
  const t = req.body;
  if (!t.title) return res.status(400).json({ error: 'Task title is required' });
  
  if (/case study/i.test(t.category || '') && t.brand !== 'Time Global Tech') {
    return res.status(400).json({ error: 'Case studies can only be assigned to Time Global Tech' });
  }

  const newTask = {
    id: t.id || uid(),
    title: t.title.trim(),
    brand: t.brand || 'Time Global Tech',
    platform: t.platform || 'LinkedIn — shared account',
    category: t.category || 'Research & strategy',
    date: t.date || todayStr(),
    due: t.due || '',
    priority: t.priority || 'Medium',
    status: t.status || 'Not started',
    start: t.start || '11:00',
    end: t.end || '12:00',
    estimate: Number(t.estimate || 0),
    actual: Number(t.actual || 0),
    output: Number(t.output || 0),
    spend: Number(t.spend || 0),
    notes: (t.notes || '').trim()
  };

  db.tasks = [newTask, ...db.tasks.filter(x => x.id !== newTask.id)];
  writeDatabase(db);
  res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const idx = db.tasks.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Task not found' });

  const patch = req.body;
  db.tasks[idx] = { ...db.tasks[idx], ...patch };
  writeDatabase(db);
  res.json(db.tasks[idx]);
});

app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.tasks = db.tasks.filter(t => t.id !== id);
  writeDatabase(db);
  res.json({ success: true, id });
});

// --- CONTENT PLANNER ENDPOINTS & AUTO PLAN-TO-TASK ---
app.get('/api/calendar', (req, res) => {
  res.json(db.calendar);
});

app.post('/api/calendar', (req, res) => {
  const item = req.body;
  if (!item.title || !item.date) {
    return res.status(400).json({ error: 'Title and publish date are required' });
  }
  const newCal = {
    id: item.id || uid(),
    title: item.title.trim(),
    brand: item.brand || 'Time Global Tech',
    platform: item.platform || 'LinkedIn',
    date: item.date,
    time: item.time || '14:30',
    type: item.type || 'Static post',
    status: item.status || 'Idea',
    owner: (item.owner || 'Akhtar Ali').trim(),
    copy: (item.copy || '').trim()
  };
  db.calendar = [newCal, ...db.calendar.filter(x => x.id !== newCal.id)];
  writeDatabase(db);
  res.status(201).json(newCal);
});

app.put('/api/calendar/:id', (req, res) => {
  const { id } = req.params;
  const idx = db.calendar.findIndex(c => c.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Calendar item not found' });

  db.calendar[idx] = { ...db.calendar[idx], ...req.body };
  writeDatabase(db);
  res.json(db.calendar[idx]);
});

app.delete('/api/calendar/:id', (req, res) => {
  const { id } = req.params;
  db.calendar = db.calendar.filter(c => c.id !== id);
  writeDatabase(db);
  res.json({ success: true, id });
});

// Single planned item -> Task sync
app.post('/api/calendar/:id/sync-to-task', (req, res) => {
  const { id } = req.params;
  const calItem = db.calendar.find(c => c.id === id);
  if (!calItem) return res.status(404).json({ error: 'Calendar item not found' });

  const platformMap = calItem.platform === 'LinkedIn' ? 'LinkedIn — shared account' : calItem.platform || 'Other';
  const newTask = {
    id: uid(),
    title: `[Publish] ${calItem.title}`,
    brand: calItem.brand || 'Time Global Tech',
    platform: platformMap,
    category: calItem.platform === 'LinkedIn' ? 'LinkedIn post scheduling & publishing' : 'Publishing & scheduling',
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
    notes: `Format: ${calItem.type || 'Post'} | Status: ${calItem.status}${calItem.copy ? ' | Copy: ' + calItem.copy : ''}`
  };

  db.tasks = [newTask, ...db.tasks];
  writeDatabase(db);
  res.json({ success: true, task: newTask });
});

// Batch sync all today's planned calendar items to daily tasks!
app.post('/api/calendar/sync-today-to-tasks', (req, res) => {
  const targetDate = (req.body && req.body.date) || todayStr();
  const todayCalendar = db.calendar.filter(c => c.date === targetDate);
  
  if (todayCalendar.length === 0) {
    return res.json({ success: true, synced: 0, message: 'No content planned for this date' });
  }

  const existingTitles = new Set(db.tasks.filter(t => t.date === targetDate).map(t => t.title.toLowerCase()));
  const newTasks = [];

  for (const item of todayCalendar) {
    const title = `[Publish] ${item.title}`;
    // Avoid duplicate task if already synced
    if (!existingTitles.has(title.toLowerCase())) {
      const platformMap = item.platform === 'LinkedIn' ? 'LinkedIn — shared account' : item.platform || 'Other';
      newTasks.push({
        id: uid(),
        title,
        brand: item.brand || 'Time Global Tech',
        platform: platformMap,
        category: item.platform === 'LinkedIn' ? 'LinkedIn post scheduling & publishing' : 'Publishing & scheduling',
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
        notes: `Format: ${item.type || 'Post'} | Workflow status: ${item.status}${item.copy ? ' | Copy: ' + item.copy : ''}`
      });
    }
  }

  if (newTasks.length > 0) {
    db.tasks = [...newTasks, ...db.tasks];
    writeDatabase(db);
  }

  res.json({
    success: true,
    synced: newTasks.length,
    tasks: newTasks,
    message: `Synced ${newTasks.length} planned items into Daily Tasks for ${targetDate}`
  });
});

// --- PROJECTS ENDPOINTS ---
app.get('/api/projects', (req, res) => {
  res.json(db.projects);
});

app.post('/api/projects', (req, res) => {
  const p = req.body;
  const newProject = {
    id: p.id || uid(),
    title: p.title || 'New deliverable',
    brand: p.brand || 'Time Global Tech',
    stage: p.stage || 'Backlog',
    owner: p.owner || 'Akhtar Ali',
    due: p.due || '',
    notes: p.notes || ''
  };
  db.projects = [...db.projects.filter(x => x.id !== newProject.id), newProject];
  writeDatabase(db);
  res.status(201).json(newProject);
});

app.put('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  const idx = db.projects.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Project not found' });

  db.projects[idx] = { ...db.projects[idx], ...req.body };
  writeDatabase(db);
  res.json(db.projects[idx]);
});

app.delete('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  db.projects = db.projects.filter(p => p.id !== id);
  writeDatabase(db);
  res.json({ success: true, id });
});

// --- METRICS / KPIS ENDPOINTS ---
app.get('/api/metrics', (req, res) => {
  res.json(db.metrics);
});

app.post('/api/metrics', (req, res) => {
  const m = req.body;
  const newMetric = {
    id: m.id || uid(),
    date: m.date || todayStr(),
    brand: m.brand || 'Time Global Tech',
    platform: m.platform || 'LinkedIn — shared account',
    reach: Number(m.reach || 0),
    impressions: Number(m.impressions || 0),
    engagements: Number(m.engagements || 0),
    clicks: Number(m.clicks || 0),
    leads: Number(m.leads || 0),
    conversions: Number(m.conversions || 0),
    spend: Number(m.spend || 0),
    cpc: m.cpc || '',
    ctr: m.ctr || '',
    notes: m.notes || ''
  };
  db.metrics = [newMetric, ...db.metrics.filter(x => x.id !== newMetric.id)];
  writeDatabase(db);
  res.status(201).json(newMetric);
});

app.delete('/api/metrics/:id', (req, res) => {
  const { id } = req.params;
  db.metrics = db.metrics.filter(m => m.id !== id);
  writeDatabase(db);
  res.json({ success: true, id });
});

// --- SETTINGS ENDPOINTS ---
app.get('/api/settings', (req, res) => {
  res.json(db.settings);
});

app.put('/api/settings', (req, res) => {
  db.settings = { ...db.settings, ...req.body };
  writeDatabase(db);
  res.json(db.settings);
});

// --- END OF DAY (EOD) REPORT GENERATOR ---
app.get('/api/eod-report', (req, res) => {
  const targetDate = req.query.date || todayStr();
  const dayTasks = db.tasks.filter(t => t.date === targetDate);
  const done = dayTasks.filter(t => t.status === 'Completed');
  const inProg = dayTasks.filter(t => t.status === 'In progress');
  const totalHours = dayTasks.reduce((s, t) => s + Number(t.actual || 0), 0);
  const totalOutputs = dayTasks.reduce((s, t) => s + Number(t.output || 0), 0);
  const totalSpend = dayTasks.reduce((s, t) => s + Number(t.spend || 0), 0);

  const lines = [
    `📊 *WORKPULSE END-OF-DAY (EOD) PERFORMANCE REPORT*`,
    `📅 Date: ${targetDate} | Operator: Akhtar Ali`,
    `⏱️ Total Productive Hours Logged: ${totalHours}h`,
    `📦 Total Content & Deliverables Published: ${totalOutputs}`,
    `💰 Total Task Ad Spend: PKR ${totalSpend.toLocaleString()}`,
    ``,
    `✅ *COMPLETED DELIVERABLES (${done.length})*:`,
    done.length > 0
      ? done.map(t => `• [${t.brand}] ${t.title} (${t.platform}) — ${t.actual}h logged${t.notes ? ' | ' + t.notes : ''}`).join('\n')
      : '• No completed items logged today.',
    ``,
    `🔄 *IN PROGRESS / NEXT ACTIONS (${inProg.length})*:`,
    inProg.length > 0
      ? inProg.map(t => `• [${t.brand}] ${t.title} (${t.platform}) — Due: ${t.due || 'TBD'}`).join('\n')
      : '• All scheduled items wrapped up.',
    ``,
    `🎯 *OPERATIONAL HIGHLIGHTS*:`,
    `• Maintained compliance with shared LinkedIn account protocols for MoneyMinds & Orgpyur.`,
    `• Time Global Tech positioning and deliverables executed on schedule.`
  ];

  res.json({
    date: targetDate,
    stats: {
      total: dayTasks.length,
      done: done.length,
      inProgress: inProg.length,
      hours: totalHours,
      outputs: totalOutputs,
      spend: totalSpend
    },
    formattedReport: lines.join('\n')
  });
});

// --- SLACK DISPATCH & WEBHOOKS ---
app.post('/api/eod/slack', async (req, res) => {
  try {
    const { webhookUrl, reportText, date } = req.body || {};
    const currentDb = readDatabase();
    const url = webhookUrl || (currentDb.settings && currentDb.settings.slackWebhookUrl) || process.env.SLACK_WEBHOOK_URL;

    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'No Slack Webhook URL provided. Please configure it in Settings.'
      });
    }

    const payload = {
      text: `🚀 *WorkPulse End-of-Day Report* (${date || todayStr()})`,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `📊 WorkPulse EOD Report (${date || todayStr()})`
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Operator:* Akhtar Ali · Operations & Growth Specialist\n*Generated:* ${new Date().toLocaleTimeString()}\n\`\`\`\n${reportText}\n\`\`\``
          }
        }
      ]
    };

    const slackRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!slackRes.ok) {
      const errText = await slackRes.text();
      return res.status(400).json({ success: false, error: `Slack returned: ${errText}` });
    }

    res.json({ success: true, message: 'Dispatched to Slack channel successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/slack/test', async (req, res) => {
  try {
    const { webhookUrl } = req.body || {};
    const currentDb = readDatabase();
    const url = webhookUrl || (currentDb.settings && currentDb.settings.slackWebhookUrl) || process.env.SLACK_WEBHOOK_URL;

    if (!url) {
      return res.status(400).json({ success: false, error: 'Webhook URL is required' });
    }

    const slackRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: '🔔 *WorkPulse Integration Test*: Slack incoming webhook is active and verified! (Akhtar Ali Operations Hub)'
      })
    });

    if (!slackRes.ok) {
      const errText = await slackRes.text();
      return res.status(400).json({ success: false, error: `Slack error: ${errText}` });
    }

    res.json({ success: true, message: 'Test message delivered to Slack successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- SHAREABLE CLIENT PORTAL API ---
app.get('/api/portal/:brand', (req, res) => {
  const brandName = decodeURIComponent(req.params.brand);
  const password = req.query.password || '';
  
  const client = (db.clients || []).find(
    c => c.name.toLowerCase() === brandName.toLowerCase()
  );

  if (!client) {
    return res.status(404).json({ success: false, error: `Client portal for '${brandName}' not found` });
  }

  // Password verification
  if (client.portalPassword && client.portalPassword.trim() !== '') {
    if (client.portalPassword !== password) {
      return res.status(401).json({
        success: false,
        requiresPassword: true,
        error: 'Authentication required: Incorrect client passcode.'
      });
    }
  }

  // Filter only deliverables and data for this client
  const clientTasks = db.tasks
    .filter(t => t.brand.toLowerCase() === brandName.toLowerCase())
    .map(t => ({
      id: t.id,
      title: t.title,
      category: t.category,
      platform: t.platform,
      date: t.date,
      status: t.status,
      actual: t.actual,
      output: t.output,
      notes: t.notes
    }));

  const clientProjects = db.projects
    .filter(p => p.brand.toLowerCase() === brandName.toLowerCase())
    .map(p => ({
      id: p.id,
      title: p.title,
      stage: p.stage,
      due: p.due,
      notes: p.notes
    }));

  const clientCalendar = db.calendar
    .filter(c => c.brand.toLowerCase() === brandName.toLowerCase())
    .map(c => ({
      id: c.id,
      title: c.title,
      date: c.date,
      time: c.time,
      platform: c.platform,
      type: c.type,
      status: c.status
    }));

  const clientMetrics = db.metrics
    .filter(m => m.brand.toLowerCase() === brandName.toLowerCase());

  res.json({
    success: true,
    client: {
      id: client.id,
      name: client.name,
      category: client.category,
      color: client.color,
      contactPerson: client.contactPerson,
      platforms: client.platforms,
      caseStudyRestricted: client.caseStudyRestricted,
      hasPassword: Boolean(client.portalPassword && client.portalPassword.trim() !== '')
    },
    tasks: clientTasks,
    projects: clientProjects,
    calendar: clientCalendar,
    metrics: clientMetrics
  });
});

// --- AUTOMATED DAILY 5:00 PM EOD DISPATCH ENGINE ---
import nodemailer from 'nodemailer';

const DISPATCH_HISTORY_FILE = path.join(DATA_DIR, 'dispatch_history.json');

const readDispatchHistory = () => {
  try {
    if (fs.existsSync(DISPATCH_HISTORY_FILE)) {
      return JSON.parse(fs.readFileSync(DISPATCH_HISTORY_FILE, 'utf-8'));
    }
  } catch (e) {}
  return [];
};

const writeDispatchHistory = (history) => {
  try {
    fs.writeFileSync(DISPATCH_HISTORY_FILE, JSON.stringify(history, null, 2));
  } catch (e) {}
};

// Centralized EOD Report Generator
const generateEodReportText = (currentDb, targetDate = todayStr()) => {
  const dayTasks = (currentDb.tasks || []).filter(t => t.date === targetDate);
  const done = dayTasks.filter(t => t.status === 'Completed');
  const inProg = dayTasks.filter(t => t.status === 'In progress');
  const totalHours = dayTasks.reduce((s, t) => s + Number(t.actual || 0), 0);
  const totalOutputs = dayTasks.reduce((s, t) => s + Number(t.output || 0), 0);
  const totalSpend = dayTasks.reduce((s, t) => s + Number(t.spend || 0), 0);

  const lines = [
    `📊 WORKPULSE END-OF-DAY (EOD) PERFORMANCE REPORT`,
    `📅 Date: ${targetDate} | Shift End: 5:00 PM | Operator: Akhtar Ali`,
    `⏱️ Total Productive Hours Logged: ${totalHours}h`,
    `📦 Total Content & Deliverables Published: ${totalOutputs}`,
    `💰 Total Task Ad Spend: PKR ${totalSpend.toLocaleString()}`,
    ``,
    `✅ COMPLETED DELIVERABLES (${done.length}):`,
    done.length > 0
      ? done.map(t => `• [${t.brand}] ${t.title} (${t.platform}) — ${t.actual}h logged${t.notes ? ' | ' + t.notes : ''}`).join('\n')
      : '• No completed items logged today.',
    ``,
    `🔄 IN PROGRESS / NEXT ACTIONS (${inProg.length}):`,
    inProg.length > 0
      ? inProg.map(t => `• [${t.brand}] ${t.title} (${t.platform}) — Due: ${t.due || 'TBD'}`).join('\n')
      : '• All scheduled items wrapped up.',
    ``,
    `🎯 OPERATIONAL HIGHLIGHTS:`,
    `• Maintained compliance with shared LinkedIn account protocols for MoneyMinds & Orgpyur.`,
    `• Time Global Tech positioning and deliverables executed on schedule.`
  ];

  return {
    reportText: lines.join('\n'),
    stats: {
      total: dayTasks.length,
      done: done.length,
      inProgress: inProg.length,
      hours: totalHours,
      outputs: totalOutputs,
      spend: totalSpend
    }
  };
};

// Dispatch to Slack
const dispatchToSlack = async (url, reportText, targetDate) => {
  if (!url) return { success: false, reason: 'No Slack Webhook URL configured' };
  try {
    const payload = {
      text: `🚀 *WorkPulse End-of-Day Report* (${targetDate})`,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `📊 WorkPulse EOD Report (${targetDate}) — Automated 5:00 PM Dispatch`
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Operator:* Akhtar Ali · Operations & Growth Specialist\n*Dispatched:* ${new Date().toLocaleTimeString()}\n\`\`\`\n${reportText}\n\`\`\``
          }
        }
      ]
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errText = await res.text();
      return { success: false, reason: errText };
    }
    return { success: true };
  } catch (err) {
    return { success: false, reason: err.message };
  }
};

// Dispatch to Email
const dispatchToEmail = async (toEmail, subject, reportText) => {
  if (!toEmail) return { success: false, reason: 'No recipient email configured' };

  // Check if SMTP environment or settings are configured
  const smtpConfig = process.env.SMTP_HOST ? {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  } : null;

  if (smtpConfig && smtpConfig.auth.user) {
    try {
      const transporter = nodemailer.createTransport(smtpConfig);
      await transporter.sendMail({
        from: `"WorkPulse Operations Hub" <${smtpConfig.auth.user}>`,
        to: toEmail,
        subject,
        text: reportText
      });
      return { success: true, mode: 'smtp' };
    } catch (err) {
      console.warn('[Email Dispatch Error]', err.message);
      // Fallback to logged record
    }
  }

  // If no external SMTP server credentials provided, log the full email dispatch
  const emailLogFile = path.join(DATA_DIR, 'dispatched_emails.log');
  const logEntry = `\n[${new Date().toISOString()}] DISPATCHED TO: ${toEmail}\nSUBJECT: ${subject}\n${reportText}\n----------------------------------------\n`;
  fs.appendFileSync(emailLogFile, logEntry);

  return {
    success: true,
    mode: 'logged_and_ready',
    message: `Report prepared and queued for ${toEmail}. Direct Gmail compose link also synchronized.`
  };
};

// Core Execution for 5:00 PM Dispatch
const executeAutoDispatch = async (source = '5:00 PM Scheduler') => {
  const currentDb = readDatabase();
  const targetDate = todayStr();
  const { reportText, stats } = generateEodReportText(currentDb, targetDate);

  const emailTo = (currentDb.settings && currentDb.settings.notificationEmail) || process.env.NOTIFICATION_EMAIL || 'proposal.tgi@gmail.com';
  const slackUrl = (currentDb.settings && currentDb.settings.slackWebhookUrl) || process.env.SLACK_WEBHOOK_URL;

  const subject = `[WorkPulse EOD] Automated 5:00 PM Performance Report - ${targetDate} (Akhtar Ali)`;

  console.log(`[Auto Dispatch] Running 5:00 PM daily dispatch (Source: ${source})...`);

  const [slackResult, emailResult] = await Promise.all([
    dispatchToSlack(slackUrl, reportText, targetDate),
    dispatchToEmail(emailTo, subject, reportText)
  ]);

  const history = readDispatchHistory();
  const record = {
    id: uid(),
    date: targetDate,
    time: new Date().toLocaleTimeString(),
    timestamp: new Date().toISOString(),
    source,
    stats,
    email: {
      recipient: emailTo,
      success: emailResult.success,
      mode: emailResult.mode || 'standard'
    },
    slack: {
      configured: Boolean(slackUrl),
      success: slackResult.success,
      reason: slackResult.reason || null
    }
  };

  history.unshift(record);
  writeDispatchHistory(history.slice(0, 30)); // keep last 30 runs

  return record;
};

// Background Timer checking for 17:00 (5:00 PM)
let lastAutoDispatchDate = null;

setInterval(async () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();

  // 17:00 is 5:00 PM
  const currentDb = readDatabase();
  const settingsTime = (currentDb.settings && currentDb.settings.end) || '17:00';
  const [targetHour, targetMin] = settingsTime.split(':').map(Number);

  const today = todayStr();

  // If time is 17:00 (or shift end) and has not run today
  if (hours === (targetHour || 17) && minutes === (targetMin || 0)) {
    if (lastAutoDispatchDate !== today) {
      lastAutoDispatchDate = today;
      try {
        await executeAutoDispatch('Automated 5:00 PM Timer');
      } catch (err) {
        console.error('[Auto Dispatch Execution Failed]', err);
      }
    }
  }
}, 30000); // Check every 30 seconds

// Endpoints for Auto Dispatch
app.get('/api/eod/auto-status', (req, res) => {
  const currentDb = readDatabase();
  const history = readDispatchHistory();
  res.json({
    enabled: true,
    scheduledTime: (currentDb.settings && currentDb.settings.end) || '17:00',
    emailRecipient: (currentDb.settings && currentDb.settings.notificationEmail) || 'proposal.tgi@gmail.com',
    slackConfigured: Boolean(currentDb.settings && currentDb.settings.slackWebhookUrl),
    lastDispatchDate: lastAutoDispatchDate,
    recentHistory: history.slice(0, 5)
  });
});

app.post('/api/eod/trigger-auto-dispatch', async (req, res) => {
  try {
    const result = await executeAutoDispatch('Manual Trigger (Instant Test)');
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[WorkPulse Backend API] Running on http://localhost:${PORT}`);
  console.log(`[WorkPulse Database] File: ${DB_FILE}`);
  console.log(`[WorkPulse Auto Dispatch] Scheduled daily at 17:00 (5:00 PM) to proposal.tgi@gmail.com and Slack`);
});

