# WorkPulse Operations Hub (Social Media & Client Operations)

WorkPulse is a high-performance operations platform built for social media specialists, agency operators, and client growth managers. It provides unified daily task execution, multi-brand content planning, automated Slack & Email End-of-Day (EOD) dispatching, AI screenshot analytics extraction, and shareable client stakeholder portals.

---

## 🚀 Core Features

- **Daily Tasks & Deliverables Register**:
  - Dual Table and Kanban Board views.
  - Multi-brand categorization (Time Global Tech, MoneyMinds, Orgpyur, Legal Tech).
  - Shift time logging (11:00 – 17:00), deliverable counting, and paid ad spend tracking.

- **Content Planning & Publishing Calendar**:
  - Weekly queue, monthly calendar grid, and kanban workflow board.
  - 1-click sync from planned calendar items to active daily tasks.
  - Pre-publish validation checklists.

- **Automated 5:00 PM Daily Dispatch**:
  - Auto-compiles daily completed work, hours, and published deliverables at shift end (17:00).
  - Automatically posts formatted Slack blocks to your channel via Incoming Webhooks.
  - 1-click management email digest generation.

- **AI Analytics Screenshot Extractor (Vision OCR)**:
  - Drag-and-drop or paste (`Ctrl + V`) screenshots from Meta Business Suite, Instagram Insights, or LinkedIn.
  - Automatically extracts total views, surge growth %, non-follower reach %, and top posts.
  - Generates strategic AI growth recommendations.

- **Shareable Client Stakeholder Portals**:
  - Read-only stakeholder portals for clients (e.g. `/?portal=Time%20Global%20Tech`).
  - Real-time deliverable tracking, verified KPIs, and optional password protection.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Tesseract.js (Vision OCR)
- **Backend**: Node.js, Express, Persistent JSON Database, Nodemailer

---

## 💻 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start the Express API server (port 5000)
node server/index.js

# 3. Start the Vite React development server (port 3000)
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to access the operations hub.

---

## 🌐 Deployment on Vercel

1. Push your repository to GitHub.
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import `Social-Media-Software-`.
4. Deploy!
