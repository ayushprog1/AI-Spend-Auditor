# Personal Reflection

**1. The hardest bug you hit this week, and how you debugged it**
The hardest bug was dealing with the non-deterministic nature of the Anthropic API when generating the 100-word personalized summary. Initially, my prompt asked Claude to do the math and summarize the savings. However, Claude would occasionally hallucinate prices or output malformed responses that broke the frontend UI layout. 
*Hypothesis:* The LLM was getting confused between its internal training data on pricing and the data I was providing. 
*Fix:* I completely decoupled the math from the AI. I built a hardcoded, deterministic `auditEngine.ts` to calculate the exact savings, and *only* passed the final total to the LLM with strict instructions to output nothing but a 100-word paragraph. It completely stabilized the endpoint.

**2. A decision you reversed mid-week, and what made you reverse it**
On Day 1, I planned to build a custom PostgreSQL database using `pg` and Express to handle the lead capture. By Day 2, I reversed this and switched to Supabase. 
*Reasoning:* Building a custom database meant writing schema migrations, handling connection pooling, and dealing with ORM boilerplate. In a 7-day sprint where the primary goal is to ship an *entrepreneurial* asset, spending 10 hours on database architecture is a poor use of time. Supabase gave me the exact same Postgres functionality in 15 minutes, allowing me to focus heavily on the GTM and unit economics.

**3. What you would build in week 2 if you had it**
If I had Week 2, I would build the "Benchmark Mode." The current tool tells a user how much *they* can save. Benchmark Mode would aggregate all the data captured in the database to tell a user: *"Your AI spend per developer is $140. Startups of your size average $85."* Social proof and FOMO (Fear Of Missing Out) are massive drivers in B2B SaaS. Showing a VP of Engineering that they are spending 40% more than their peers is the ultimate hook to book a Credex consultation.

**4. How you used AI tools**
* **Usage:** I used Cursor as my primary IDE for the React frontend, heavily relying on its autocomplete for the Tailwind CSS styling and rapid component scaffolding. I used Claude 3 Opus to help brainstorm edge cases for the `auditEngine.ts` logic rules.
* **Lack of Trust:** I specifically did not trust the AI to write the final GTM strategy or the `ECONOMICS.md` math. AI tends to write highly generic marketing copy ("We will post on Twitter and do SEO"). 
* **Caught Error:** When I asked an AI assistant to scaffold my automated tests, it hallucinated a complex Jest configuration that directly conflicted with my Vite setup. I caught the error, scrapped the generated code, and manually installed Vitest to keep the tooling native and clean.

**5. Self-rating on a 1-10 scale**
* **Discipline (9/10):** I consistently shipped features across the 7-day window, maintaining clear Git hygiene and sticking to the MVP scope without getting distracted.
* **Code quality (8/10):** The abstractions in the React components are clean and heavily typed via TypeScript, though test coverage could be expanded beyond just the core engine.
* **Design sense (8/10):** The UI feels like a trustworthy B2B financial tool. It relies on clean typography, plenty of whitespace, and clear typographic hierarchy without relying on banned templates.
* **Problem-solving (9/10):** Successfully navigated the strict constraint of collecting an email *after* showing value, utilizing localStorage and dynamic routing to create a seamless user experience.
* **Entrepreneurial thinking (10/10):** I treated this like a real product launch. The GTM strategy targets the exact buyer persona (Fractional CFOs), and the unit economics are modeled around actual Credex margin targets rather than vanity metrics.