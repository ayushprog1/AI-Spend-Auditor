# LLM Prompts

**Primary Model Used:** Gemini 1.5 Flash (via Google Generative AI SDK)
**Fallback Model:** Gemini 1.0 Pro

## The Summary Generation Prompt
To prevent the LLM from hallucinating financial math, the system runs all calculations deterministically in standard TypeScript first. The LLM is only used for formatting the final text summary based on the proven variables.

**System/User Prompt Structure:**
```text
You are a financial auditor specializing in AI SaaS infrastructure.
Analyze this audit for a team of {teamSize} whose primary use case is {primaryUseCase}.

Total Monthly Savings identified: ${auditResult.monthlySavings}
Total Annual Savings: ${auditResult.annualSavings}
Is this considered "High Savings" (> $500/mo): {auditResult.isHighSavings}

Write a concise, professional 100-word personalized summary of these findings. 
Do not hallucinate numbers. Be direct. If savings are $0, congratulate them on an optimized stack.
If it is "High Savings", gently hint that consolidating billing through an infrastructure partner could help them capture these savings easily.