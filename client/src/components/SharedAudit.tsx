import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

interface FetchedAudit {
  monthly_savings: number;
  ai_summary: string;
}

const theme = {
  colors: {
    primary: "text-[#22C55E]",
    secondary: "text-[#102A29]",
    background: "bg-[#ffffff]",
    darkCard: "bg-[#102A29] text-white rounded-[2rem] p-8 shadow-xl",
    cta: "bg-[#102A29] hover:bg-[#1a4240] text-white font-medium py-3.5 px-8 rounded-full transition-all duration-200",
  },
};

export default function SharedAudit() {
  const { id } = useParams<{ id: string }>();
  const [fetchedAudit, setFetchedAudit] = useState<FetchedAudit | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3001/api/audit/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data) => setFetchedAudit(data))
      .catch(() => setError(true));
  }, [id]);

  if (error) {
    return (
      <div 
        className={`min-h-screen ${theme.colors.background} flex flex-col items-center justify-center p-6 text-center`}
        style={{ backgroundImage: "linear-gradient(to right, #f0fdf4 1px, transparent 1px), linear-gradient(to bottom, #f0fdf4 1px, transparent 1px)", backgroundSize: "4rem 4rem" }}
      >
        <div className="bg-white p-12 rounded-[2rem] shadow-sm border border-gray-100 max-w-lg">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <h2 className={`text-3xl font-extrabold ${theme.colors.secondary} mb-4`}>Audit Not Found</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">The AI spend audit you are looking for may have expired or was removed. You can generate a new one in 60 seconds.</p>
          <Link to="/" className={theme.colors.cta}>Run New Audit</Link>
        </div>
      </div>
    );
  }

  if (!fetchedAudit) {
    return (
      <div className={`min-h-screen ${theme.colors.background} flex items-center justify-center text-lg text-gray-400 font-medium`}>
        <span className="flex items-center gap-3">
          <svg className="animate-spin text-[#22C55E]" width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeLinecap="round" className="opacity-25"></circle><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          Fetching report details...
        </span>
      </div>
    );
  }

  return (
    <div 
      className={`min-h-screen ${theme.colors.background}`}
      style={{ backgroundImage: "linear-gradient(to right, #f0fdf4 1px, transparent 1px), linear-gradient(to bottom, #f0fdf4 1px, transparent 1px)", backgroundSize: "4rem 4rem" }}
    >
      <Helmet>
        <title>{`AI Spend Audit | Saved $${fetchedAudit.monthly_savings}/mo`}</title>
        <meta property="og:title" content={`I just found $${fetchedAudit.monthly_savings}/mo in AI stack savings.`} />
        <meta property="og:description" content="Run your own free AI infrastructure audit to see if you are overpaying for Cursor, ChatGPT, Claude, or APIs." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <nav className="max-w-4xl mx-auto pt-6 px-4 relative z-50">
        <div className="bg-white border border-gray-100 shadow-sm rounded-full px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 160 160" fill="none"><circle cx="80" cy="80" r="80" fill="#102A29"/><path d="M45.5 107.5V52.5M114.5 52.5V107.5M80 80.5C92.5 80.5 104.5 90.5 104.5 107.5M80 80.5C67.5 80.5 55.5 70.5 55.5 52.5" stroke="#22C55E" strokeWidth="15" strokeLinecap="round"/></svg>
            <span className={`text-lg font-bold tracking-tight ${theme.colors.secondary}`}>credex</span>
          </Link>
          <Link to="/" className="text-sm font-bold text-[#22C55E] hover:text-[#1fae53] transition-colors">Run Free Audit →</Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#dcfce7] border border-[#bbf7d0] rounded-full px-4 py-1.5 mb-6">
             <span className="text-[#166534] text-[10px] font-bold tracking-wider uppercase">Verified Analysis</span>
          </div>
          <h1 className={`text-4xl md:text-5xl font-extrabold ${theme.colors.secondary} tracking-tight`}>Anonymous AI Spend Audit</h1>
        </div>

        <div className={`${theme.colors.darkCard} grid md:grid-cols-2 gap-10 mb-12`}>
          <div className="md:border-r border-white/10 pr-8 flex flex-col justify-center text-center md:text-left">
            <p className="text-[11px] font-bold text-[#22C55E] uppercase tracking-widest mb-3">Total Monthly Savings Identified</p>
            <h2 className="text-7xl font-extrabold text-white mb-2 tracking-tight">${fetchedAudit.monthly_savings}</h2>
            <p className="text-2xl font-medium text-gray-400">${fetchedAudit.monthly_savings * 12}/year</p>
          </div>
          <div className="flex flex-col justify-center">
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-[#22C55E]">✨</span> AI Analysis
            </h3>
            <p className="text-gray-300 leading-relaxed text-sm">{fetchedAudit.ai_summary}</p>
          </div>
        </div>

        <div className="text-center pt-16 pb-20">
          <h3 className={`text-2xl font-bold ${theme.colors.secondary} mb-4`}>Are you overpaying for AI?</h3>
          <p className="text-gray-500 mb-10 max-w-xl mx-auto leading-relaxed">Find out if you are on the wrong subscription plan, missing volume discounts, or using redundant tools in 60 seconds.</p>
          <Link to="/" className={theme.colors.cta}>Run Your Free Audit</Link>
        </div>
      </main>
    </div>
  );
}