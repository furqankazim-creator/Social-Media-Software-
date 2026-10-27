export const DEFAULT_CLIENTS = [
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
];

export const BRANDS = DEFAULT_CLIENTS.map((c) => c.name);

export const LINKEDIN_SHARED_CLIENTS = [
  'MoneyMinds Technologies Inc.',
  'Orgpyur Technologies Inc.'
];

export const BRAND_COLORS = {
  'Time Global Tech': {
    bg: 'bg-blue-600',
    text: 'text-blue-600',
    border: 'border-blue-500',
    hex: '#3157d5',
    light: 'bg-blue-50',
    badge: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  'Legal Tech Pakistan': {
    bg: 'bg-teal-600',
    text: 'text-teal-600',
    border: 'border-teal-500',
    hex: '#0f9d8a',
    light: 'bg-teal-50',
    badge: 'bg-teal-50 text-teal-700 border-teal-200'
  },
  'MoneyMinds Technologies Inc.': {
    bg: 'bg-amber-600',
    text: 'text-amber-600',
    border: 'border-amber-500',
    hex: '#e58b32',
    light: 'bg-amber-50',
    badge: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  'Orgpyur Technologies Inc.': {
    bg: 'bg-purple-600',
    text: 'text-purple-600',
    border: 'border-purple-500',
    hex: '#7756c8',
    light: 'bg-purple-50',
    badge: 'bg-purple-50 text-purple-700 border-purple-200'
  }
};

export const getClientColorHex = (clientName, customClients = []) => {
  if (BRAND_COLORS[clientName]) {
    return BRAND_COLORS[clientName].hex;
  }
  const match = customClients.find((c) => c.name === clientName);
  if (match && match.color) {
    return match.color;
  }
  return '#3157d5';
};

export const PLATFORMS = [
  'LinkedIn — shared account',
  'Instagram',
  'Facebook',
  'Pinterest',
  'YouTube',
  'X',
  'TikTok',
  'Threads',
  'Meta Ads',
  'Website',
  'Internal / offline',
  'Other'
];

export const TASK_CATEGORIES = [
  'Research & strategy',
  'Content creation & design',
  'Publishing & scheduling',
  'Community & engagement',
  'Paid media management',
  'Analytics & reporting',
  'Client communication & ops',
  'Admin & miscellaneous'
];

export const CONTENT_FORMATS = [
  'Single image',
  'Carousel / PDF',
  'Short video / Reel',
  'Text / Story post',
  'Article / Newsletter',
  'Ad creative',
  'Poll / Interactive',
  'Job post / hiring'
];

export const PROJECT_STAGES = [
  'Backlog',
  'Researching',
  'Drafting',
  'In review',
  'Scheduled',
  'Completed'
];

export const TASK_STATUSES = ['Not started', 'In progress', 'Completed'];
export const CALENDAR_STATUSES = ['Draft', 'Ready', 'Scheduled', 'Published'];
export const PRIORITIES = ['Normal', 'High', 'Urgent'];

export const WORK_CATEGORIES = TASK_CATEGORIES;
export const PIPELINE_STAGES = PROJECT_STAGES;
export const WORKFLOW_STATUSES = CALENDAR_STATUSES;
export const PLANNER_PLATFORMS = [
  'LinkedIn',
  'Instagram',
  'Facebook',
  'Pinterest',
  'YouTube',
  'Twitter / X',
  'TikTok',
  'Threads',
  'Meta Ads',
  'Website'
];
export const PRE_PUBLISH_CHECKLIST = [
  'Headline & hook verified for target audience',
  'Brand tone aligned (professional, authoritative)',
  'Creative asset dimension & compression checked',
  'Hashtags & link tags tested and verified',
  'Clear Call-to-Action (CTA) included',
  'For MoneyMinds & Orgpyur: Verified shared LinkedIn protocol'
];
