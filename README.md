# Credex AI Spend Auditor

A free, lead-generating web application designed to help startups audit their AI infrastructure stack. By analyzing current tool usage against live pricing data, it identifies seat mismatches, redundant tools, and retail markups to instantly surface actionable savings.

## Visuals
![Audit Form Interface](./assets/Screenshot(155).png)
![Savings Analysis Dashboard](./assets/Screenshot(157).png)
![Public Sharing View](./assets/Screenshot(159).png)

## Quick Start
**Prerequisites:** Node.js (v18+)

1. Clone the repository.
2. Install backend dependencies: `cd server && npm install`
3. Install frontend dependencies: `cd client && npm install`
4. Create a `.env` in the `server` folder with:
   `GEMINI_API_KEY=your_key`
   `SUPABASE_URL=your_url`
   `SUPABASE_ANON_KEY=your_key`
   `RESEND_API_KEY=your_key`
5. Run the backend: `npm run dev` (from `server` folder)
6. Run the frontend: `npm run dev` (from `client` folder)

## 5 Key Decisions & Trade-offs
1. **MERN-style Stack over Next.js:** Chose a decoupled React (Vite) frontend and Express backend instead of a monolithic Next.js app. *Why:* It strictly separates the frontend UI from the backend lead-capture and LLM logic, making it easier to swap databases or move the API to a microservice later if Credex integrates this into their main dashboard.
2. **Hardcoded Engine vs LLM Math:** Chose to hardcode the pricing logic and only use the LLM for the text summary. *Why:* LLMs hallucinate math. A deterministic engine is 100% accurate and defensible to a CFO.
3. **Supabase over Custom Postgres:** Chose Supabase for rapid backend deployment. *Why:* It provides out-of-the-box API endpoints and fast setup, saving hours of database boilerplate during a 7-day sprint.
4. **Local Storage for Form State:** Used `localStorage` for form persistence instead of a backend session. *Why:* Keeps the tool completely anonymous and frictionless until the user explicitly opts in to save their report.
5. **No Login Required:** Gated the report breakdown behind an email capture rather than forcing a full account creation. *Why:* Maximizes top-of-funnel conversion for Credex's lead generation goals.

## Deployed Application
**Live URL:** [https://ai-spend-auditor-one.vercel.app/]

# Credex AI Spend Auditor

**Live Frontend:** [https://ai-spend-auditor-one.vercel.app/]
**Live Backend:** [https://ai-spend-auditor.onrender.com]

## Overview
A full-stack B2B SaaS application designed to audit a company's AI tool stack, identify retail API overspending, and generate personalized savings reports using LLMs.

## Tech Stack
* **Frontend:** React, Vite, Tailwind CSS, React Router, React Helmet
* **Backend:** Node.js, Express, CORS
* **Database:** Supabase (PostgreSQL)
* **Email:** Resend
* **AI:** Google Gemini 1.5 Flash (via Generative AI SDK)

## How to Run Locally
1. Clone the repository.
2. `cd server` -> `npm install` -> Create `.env` -> `node index.js`
3. `cd client` -> `npm install` -> `npm run dev`