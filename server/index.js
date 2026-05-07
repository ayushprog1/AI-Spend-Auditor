import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Clients
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

// --- Basic Abuse Protection (Requirement 5) ---
// Limits lead capture to 5 submissions per IP every 15 minutes
const leadRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: { error: "Too many audit requests from this IP, please try again later." }
});

// ... (Keep Route 1: /api/generate-summary as it is) ...

// --- ROUTE 2: Capture Lead & Trigger Email ---
app.post('/api/capture-lead', leadRateLimiter, async (req, res) => {
  const { email, auditResult, teamSize } = req.body;

  try {
    // 1. Save to Supabase
    const { data, error: dbError } = await supabase
      .from('leads')
      .insert([
        { 
          email: email, 
          team_size: teamSize, 
          monthly_savings: auditResult.monthlySavings,
          is_high_savings: auditResult.isHighSavings 
        }
      ]);

    if (dbError) throw new Error(dbError.message);

    // 2. Determine Email Content based on Savings
    const emailSubject = auditResult.isHighSavings 
      ? `Your AI Spend Audit: Save $${auditResult.monthlySavings}/mo`
      : `Your AI Spend Audit Results`;

    const emailBody = auditResult.isHighSavings
      ? `<p>Thanks for using the AI Spend Audit tool.</p>
         <p>We found <strong>$${auditResult.monthlySavings}</strong> in monthly savings for your team.</p>
         <p>Because your potential savings are significant, someone from the Credex team will reach out shortly to show you how we can consolidate your billing and capture these savings immediately.</p>`
      : `<p>Thanks for using the AI Spend Audit tool.</p>
         <p>Your stack is highly optimized. We've added you to our notification list, and we'll alert you when new AI pricing drops that affect your specific tools.</p>`;

    // 3. Send Transactional Email
    const { error: emailError } = await resend.emails.send({
      from: 'Audit Tool <audit@yourdomain.com>', // Update this when you set up Resend
      to: [email],
      subject: emailSubject,
      html: emailBody,
    });

    if (emailError) throw new Error(emailError.message);

    res.json({ success: true, message: "Lead captured and email sent." });
  } catch (error) {
    console.error("Lead Capture Error:", error);
    res.status(500).json({ error: "Failed to process lead." });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));