import { useState } from 'react';
import type { AuditResult } from '../utils/auditEngine';

interface ResultsPageProps {
  result: AuditResult;
  aiSummary: string | null;
  onSubmitEmail: (email: string) => void;
}

const theme = {
  colors: {
    primary: "text-[#22C55E]",
    secondary: "text-[#102A29]",
    background: "bg-[#ffffff]",
    card: "bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] p-8",
    darkCard: "bg-[#102A29] text-white rounded-[2rem] p-8 shadow-xl",
    ctaGreen: "bg-[#22C55E] hover:bg-[#1fae53] text-white font-medium py-3.5 px-8 rounded-full transition-all duration-200 shadow-lg shadow-green-500/25",
  },
};

export default function ResultsPage({ result, aiSummary, onSubmitEmail }: ResultsPageProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitEmail(email);
    setSubmitted(true);
  };

  const renderActionBadge = (action: string) => {
    const base = "px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border";
    switch (action) {
      case 'keep': return `${base} bg-gray-50 border-gray-200 text-gray-400`;
      case 'downgrade': return `${base} bg-[#102A29] border-[#102A29] text-[#22C55E]`;
      case 'switch': return `${base} bg-[#22C55E] border-[#22C55E] text-white`;
      default: return `${base} bg-gray-50 border-gray-200 text-gray-400`;
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className={`${theme.colors.darkCard} grid md:grid-cols-2 gap-10`}>
        <div className="md:border-r border-white/10 pr-8 flex flex-col justify-center">
          <p className="text-[11px] font-bold text-[#22C55E] uppercase tracking-widest mb-3">Total Monthly Savings</p>
          <h2 className="text-7xl font-extrabold text-white mb-2 tracking-tight">${result.monthlySavings}</h2>
          <p className="text-2xl font-medium text-gray-400">${result.annualSavings}/year recovered</p>
        </div>
        <div className="flex flex-col justify-center">
          <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
            <span className="text-[#22C55E]">✨</span> AI Analysis
          </h3>
          <p className="text-gray-300 leading-relaxed text-sm">
            {aiSummary || "Scanning your configuration for volume discounts and cheaper model drop-ins..."}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className={`text-2xl font-extrabold ${theme.colors.secondary} px-2`}>Line-Item Breakdown</h3>
        {result.toolAudits.map((audit, i) => (
          <div key={i} className={`${theme.colors.card} flex flex-col md:flex-row items-center justify-between gap-8 p-6 md:px-10`}>
            {/* Tool Name */}
            <div className="flex items-center gap-4 w-full md:w-1/4">
              <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 flex items-center justify-center">
                <span className="text-xl font-bold text-gray-300">#</span>
              </div>
              <h4 className={`text-lg font-bold ${theme.colors.secondary} capitalize`}>
                {audit.toolId.replace('_api', ' API')}
              </h4>
            </div>
            
            <div className="flex flex-row md:flex-col items-center w-full md:w-auto justify-between md:justify-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Current</p>
              <p className="text-2xl font-extrabold text-gray-400 line-through decoration-gray-300">${audit.currentSpend}</p>
            </div>
            
            <div className="hidden md:block text-gray-200">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </div>

            <div className="flex flex-row md:flex-col items-center w-full md:w-auto justify-between md:justify-center">
              <p className="text-[10px] font-bold text-[#22C55E] uppercase tracking-widest mb-1">Optimized</p>
              <p className={`text-3xl font-extrabold ${theme.colors.secondary}`}>${audit.newSpend}</p>
            </div>

            <div className="flex flex-col items-start md:items-end w-full md:w-1/4 gap-2">
              <span className={renderActionBadge(audit.recommendedAction)}>{audit.recommendedAction}</span>
              <p className="text-xs text-gray-500 font-medium text-left md:text-right">{audit.reason}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={`${theme.colors.darkCard} relative overflow-hidden mt-16`}>
        <div className="absolute -right-20 -top-40 opacity-10 pointer-events-none">
           <svg viewBox="0 0 400 400" width="600" height="600" fill="none"><circle cx="200" cy="200" r="195" stroke="#22C55E" strokeWidth="10"/><path d="M200 10V390" stroke="#22C55E" strokeWidth="2"/><path d="M10 200H390" stroke="#22C55E" strokeWidth="2"/></svg>
        </div>
        
        <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#22C55E]/20 border border-[#22C55E]/30 rounded-full px-3 py-1 mb-6">
              <span className="text-[#22C55E] text-[10px] font-bold tracking-widest uppercase">Next Steps</span>
            </div>
            
            {result.isHighSavings ? (
              <>
                <h3 className="text-3xl font-extrabold text-white mb-4 leading-tight">Stop burning cash on AI.</h3>
                <p className="text-gray-400">You are leaving ${result.monthlySavings}/mo on the table. Credex can provide discounted API credits and billing consolidation to capture these savings today.</p>
              </>
            ) : (
              <>
                <h3 className="text-3xl font-extrabold text-white mb-4 leading-tight">You're spending well.</h3>
                <p className="text-gray-400">Your AI stack is highly optimized. We won't manufacture savings that aren't there. Get notified when pricing drops or cheaper models hit the market.</p>
              </>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {submitted ? (
              <div className="bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] p-6 rounded-3xl font-bold text-center animate-pulse">
                ✨ Report secured! Check your inbox.
              </div>
            ) : (
              <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <svg className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  <input 
                    type="email" 
                    required
                    placeholder="Work email for full report" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-white/10 border border-white/20 rounded-full text-white placeholder-gray-400 focus:bg-white focus:text-gray-900 focus:outline-none transition-all duration-300"
                  />
                </div>
                <button type="submit" className={theme.colors.ctaGreen}>
                  {result.isHighSavings ? 'Book consultation' : 'Get notified'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}