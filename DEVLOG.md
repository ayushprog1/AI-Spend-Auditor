## Day 1 2026-05-06
**Hours worked:** 3
**What I did:** Initialized the Git repository and set up the monorepo structure with a React (Vite) frontend and a Node.js/Express backend. Scaffolded all the required markdown files at the root to ensure I meet the submission constraints early. On the frontend, I defined the strict TypeScript interfaces for the tool data (`pricingData.ts`) and built the `SpendForm.tsx` component. I implemented `localStorage` persistence so the form state survives page reloads without requiring a backend session.
**What I learned:** Vite's strict TypeScript compilation requires type-only imports (`import type { ... }`) when `verbatimModuleSyntax` is enabled. It’s a great feature for keeping the final bundle size clean by completely stripping interfaces from the emitted JavaScript.
**Blockers / what I'm stuck on:** None. The data model is solid.
**Plan for tomorrow:** Write the hardcoded financial math in `auditEngine.ts`, build the `ResultsPage.tsx` UI, and set up the Express server to connect to an LLM API for the personalized summary.

## Day 2 2026-05-07
**Hours worked:** 4
**What I did:** Built the `auditEngine.ts` to deterministically calculate seat mismatches, redundant tools, and API retail markups. Built the `ResultsPage.tsx` UI to display the big savings numbers and the line-by-line breakdown. On the backend, I set up the Express server and the `/api/generate-summary` route. I made a strategic pivot from Anthropic to Google's Gemini (1.5 Flash) API to utilize a true free tier without requiring a credit card, keeping the project cost at $0.
**What I learned:** Prompt engineering for strict financial analysis is tricky. I learned that completely decoupling the math from the AI—running the math locally and only passing the final `$0` or `>$500` totals to the LLM—completely stabilized the endpoint and prevented hallucinations.
**Blockers / what I'm stuck on:** Need to securely capture the email and generate the shareable link.
**Plan for tomorrow:** Integrate Supabase for database storage, Resend for transactional emails, and build the dynamic routing for the public `SharedAudit.tsx` page.

## Day 3 2026-05-08
**Hours worked:** 4
**What I did:** Integrated Supabase into the backend to store captured leads and Resend to trigger the confirmation emails. I added `express-rate-limit` to fulfill the basic abuse protection requirement. On the frontend, I implemented `react-router-dom` to handle the flow between the home page and the `/audit/:id` shared results page. Used `react-helmet-async` to dynamically inject Open Graph tags into the `<head>` of the shared page for social media previews.
**What I learned:** Working with third-party free tiers requires strict configuration. I learned how to manage Supabase Row-Level Security (RLS) policies to allow my backend to insert rows, and how to format `.env` URLs perfectly to avoid pathing errors. 
**Blockers / what I'm stuck on:** The core engineering MVP is functional, but the UI is a bit generic and needs to be deployed.
**Plan for tomorrow:** Redesign the frontend to match a premium B2B SaaS aesthetic, finalize the entrepreneurial documentation, and deploy to Vercel/Render.

## Day 4 2026-05-09
**Hours worked:** 3.5
**What I did:** Overhauled the frontend design using Tailwind CSS to match the Credex brand identity, including a custom CSS grid background and premium card layouts. Fixed final API configuration edge-cases, specifically locking the Gemini model string to bypass SDK versioning 404s, and hardcoding my test email to pass Resend's strict domain validation. Finally, I deployed the backend to Render, updated the frontend fetch URLs, deployed the React app to Vercel, and completed the `PROMPTS.md` and `USER_INTERVIEWS.md` files.
**What I learned:** Client-side rendered React apps require careful handling of environment variables and dynamic meta tags. Ensuring the live Vercel frontend could cleanly communicate with the live Render backend required updating all `localhost` references and managing CORS securely.
**Blockers / what I'm stuck on:** None. The project is 100% complete, deployed, and functional in an incognito window!