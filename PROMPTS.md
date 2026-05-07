# LLM Prompts

**Verified:** 2026-05-07

## 1. AI Spend Audit Summary Prompt
**Model:** claude-3-haiku-20240307
**Context:** This prompt is sent to the Anthropic API after the hardcoded math engine completes the audit. It receives the calculated variables to generate a 100-word personalized paragraph.

**The Prompt:**
\`\`\`text
You are a financial auditor specializing in AI SaaS infrastructure.
Analyze this audit for a team of {teamSize} whose primary use case is {primaryUseCase}.

Total Monthly Savings identified: ${monthlySavings}
Total Annual Savings: ${annualSavings}
Is this considered "High Savings" (> $500/mo): {isHighSavings}

Write a concise, professional 100-word personalized summary of these findings. 
Do not hallucinate numbers. Be direct. If savings are $0, congratulate them on an optimized stack.
If it is "High Savings", gently hint that consolidating billing through an infrastructure partner could help them capture these savings easily.
\`\`\`

**Why I wrote it this way:**
I explicitly defined the persona ("financial auditor") to keep the tone professional and aligned with Credex's brand. I passed the exact output from the hardcoded deterministic engine to prevent the LLM from hallucinating its own math. The conditional logic instruction (handling $0 vs >$500 savings) ensures the LLM aligns with the UI logic on the Results Page. 

**What I tried that didn't work:**
Initially, I tried passing the entire array of tools directly to the LLM and asked it to explain the savings line-by-line. This resulted in the model either hallucinating tool prices, making the response much longer than the required ~100 words, or contradicting the hardcoded engine's math. Summarizing the *totals* rather than the *line items* proved much more stable.