import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
//import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

//const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const supabase = process.env.SUPABASE_URL ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY) : null;
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const leadRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: { error: "Too many audit requests from this IP, please try again later" }
});

app.post('/api/generate-summary', async (req, res) => {
  const { auditResult, teamSize, primaryUseCase } = req.body;
  const fallbackSummary = `Based on your audit, your team of ${teamSize} primarily focused on ${primaryUseCase} could save $${auditResult.monthlySavings} monthly. We recommend reviewing your seat allocations and considering specialized tools that better fit your use case to optimize your overall AI infrastructure spend.`;

  try {
    const prompt = `
      You are a financial auditor specializing in AI SaaS infrastructure.
      Analyze this audit for a team of ${teamSize} whose primary use case is ${primaryUseCase}.
      
      Total Monthly Savings identified: $${auditResult.monthlySavings}
      Total Annual Savings: $${auditResult.annualSavings}
      Is this considered "High Savings" (> $500/mo): ${auditResult.isHighSavings}
      
      Write a concise, professional 100-word personalized summary of these findings. 
      Do not hallucinate numbers. Be direct. If savings are $0, congratulate them on an optimized stack.
      If it is "High Savings", gently hint that consolidating billing through an infrastructure partner could help them capture these savings easily.
    `;

    // Use the free, fast Gemini Flash model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    res.json({ summary: responseText });

  } catch (error) {
    console.error("LLM API Error:", error);
    res.json({ summary: fallbackSummary });
  }
});

app.post('/api/capture-lead', leadRateLimiter, async (req, res) => {
  const { email, auditResult, teamSize, aiSummary } = req.body;

  try {
    let savedId = "mock-id-123";
    if (supabase) {
      const { data, error: dbError } = await supabase
        .from('leads')
        .insert([{ 
          email: email, 
          team_size: teamSize, 
          monthly_savings: auditResult.monthlySavings,
          is_high_savings: auditResult.isHighSavings,
          ai_summary: aiSummary // Save the summary for the public page!
        }])
        .select('id')
        .single();

      if (dbError) throw new Error(dbError.message);
      savedId = data.id;
    }

    if (resend) {
      const emailSubject = auditResult.isHighSavings 
        ? `Your AI Spend Audit: Save $${auditResult.monthlySavings}/mo`
        : `Your AI Spend Audit Results`;

      const emailBody = auditResult.isHighSavings
        ? `<p>Thanks for using the AI Spend Audit tool.</p><p>We found <strong>$${auditResult.monthlySavings}</strong> in monthly savings for your team.</p><p>Because your potential savings are significant, someone from the Credex team will reach out shortly to show you how we can consolidate your billing and capture these savings immediately.</p>`
        : `<p>Thanks for using the AI Spend Audit tool.</p><p>Your stack is highly optimized. We've added you to our notification list, and we'll alert you when new AI pricing drops that affect your specific tools.</p>`;

      const { error: emailError } = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: [email],
        subject: emailSubject,
        html: emailBody,
      });
      if (emailError) throw new Error(emailError.message);
    }

    res.json({ success: true, shareId: savedId });
  } catch (error) {
    console.error("Lead Capture Error:", error);
    res.status(500).json({ error: "Failed to process lead." });
  }
});

app.get('/api/audit/:id', async (req, res) => {
  try {
    if (!supabase) {
      return res.json({ monthly_savings: 450, ai_summary: "Mock summary because Supabase is not connected yet." });
    }
    const { data, error } = await supabase
      .from('leads')
      .select('monthly_savings, ai_summary')
      .eq('id', req.params.id)
      .single();

    if (error) throw new Error(error.message);
    res.json(data);
  } catch (error) {
    console.error("Fetch Audit Error:", error);
    res.status(404).json({ error: "Audit not found." });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));