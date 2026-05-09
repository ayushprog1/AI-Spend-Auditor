# Product Metrics

**The North Star Metric**
Our North Star is **Qualified Leads Captured**. 
Specifically, the absolute number of emails captured where the audit identified `monthlySavings > $500`. We are not building a consumer app where DAU (Daily Active Users) matters; an engineering manager might only use this tool once a year. The only metric that proves the tool is working as a lead-generation asset for Credex is how many high-value, actionable leads it drops into the sales pipeline.

**3 Input Metrics That Drive the North Star**
1.  **Audit Completion Rate:** (Audits Completed / Landing Page Visitors). This measures if the UI is frictionless and the initial value proposition is strong enough to get them to fill out the form.
2.  **Report Capture Rate:** (Emails Submitted / Audits Completed). This measures the effectiveness of the Results Page. Did the audit provide enough "shock value" (savings) that they are willing to trade their email for the full report and future notifications?
3.  **Viral Share Coefficient:** (New Visitors from Shared URLs / Total Shared URLs Generated). This measures if the Open Graph tags and anonymous sharing feature are successfully driving a free viral loop on social media.

**What I Would Instrument First**
I would implement PostHog or Mixpanel to track the exact drop-off points in the funnel:
`Page View` $\rightarrow$ `Form Started` $\rightarrow$ `Audit Completed` $\rightarrow$ `Email Input Focused` $\rightarrow$ `Email Submitted`. 
If users are completing the audit but abandoning the page at the email capture step, we know the math is working but the CTA is failing.

**The Pivot Trigger**
The pivot trigger is **if the Report Capture Rate falls below 2% after 1,000 completed audits.**
If 1,000 people use the tool but only 20 give us their email, the tool is a "leaky bucket" novelty calculator, not a lead-gen asset. 
*Pivot Decision:* We would need to pivot to a "Gated" model, where we show the *Total Savings* on the screen but require an email to reveal the *Per-Tool Breakdown*.