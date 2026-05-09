import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import SpendForm from './components/SpendForm';
import ResultsPage from './components/ResultsPage';
import SharedAudit from './components/SharedAudit';
import { runAudit } from './utils/auditEngine';
import type { AuditResult } from './utils/auditEngine';
import type { UserInput } from './types';


const theme = {
  colors: {
    primary: "text-[#22C55E]",
    secondary: "text-[#102A29]",
    background: "bg-[#ffffff]",
    card: "bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] p-8",
    cta: "bg-[#102A29] hover:bg-[#1a4240] text-white font-medium py-3.5 px-8 rounded-full transition-all duration-200",
  },
};

function Home() {
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [teamSize, setTeamSize] = useState<number>(1);

  const handleRunAudit = async (data: UserInput) => {
    const result = runAudit(data);
    setAuditResult(result);
    setTeamSize(data.teamSize);

    try {
      const response = await fetch('https://ai-spend-auditor.onrender.com/api/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auditResult: result,
          teamSize: data.teamSize,
          primaryUseCase: data.primaryUseCase
        }),
      });
      const aiData = await response.json();
      setAiSummary(aiData.summary);
    } catch (error) {
      console.error("Failed to fetch summary", error);
      setAiSummary("Could not generate summary at this time.");
    }
  };

  const handleCaptureLead = async (email: string) => {
    try {
      const response = await fetch('https://ai-spend-auditor.onrender.com/api/capture-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, auditResult, teamSize, aiSummary }),
      });
      const data = await response.json();
      
      if (data.shareId) {
        console.log(`Shareable URL: ${window.location.origin}/audit/${data.shareId}`);
      }
    } catch (error) {
      console.error("Failed to capture lead", error);
    }
  };

  return (
    <div 
      className={`min-h-screen ${theme.colors.background} relative overflow-hidden`}
      style={{ 
        backgroundImage: "linear-gradient(to right, #f0fdf4 1px, transparent 1px), linear-gradient(to bottom, #f0fdf4 1px, transparent 1px)", 
        backgroundSize: "4rem 4rem" 
      }}
    >
      <nav className="max-w-6xl mx-auto pt-6 px-4 relative z-50">
        <div className="bg-white border border-gray-100 shadow-sm rounded-full px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
            <svg width="28" height="28" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="80" cy="80" r="80" fill="#102A29"/>
              <path d="M45.5 107.5V52.5M114.5 52.5V107.5M80 80.5C92.5 80.5 104.5 90.5 104.5 107.5M80 80.5C67.5 80.5 55.5 70.5 55.5 52.5" stroke="#22C55E" strokeWidth="15" strokeLinecap="round"/>
            </svg>
            <span className={`text-xl font-bold tracking-tight ${theme.colors.secondary}`}>credex</span>
          </div>
          
          <div className="hidden md:flex bg-gray-50 p-1 rounded-full border border-gray-100">
            <button className="bg-[#dcfce7] text-[#166534] px-5 py-1.5 rounded-full text-sm font-semibold transition-colors">Run Audit</button>
            <button className="text-gray-500 hover:text-gray-700 px-5 py-1.5 rounded-full text-sm font-medium transition-colors">Pricing</button>
          </div>

          <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-600">
            {['How it Works', 'Guarantee', 'FAQ', 'Contact', 'Blog'].map(item => (
              <a key={item} href="#" className="hover:text-gray-900 transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-20 pb-24 relative z-10">
        {!auditResult ? (
          <>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-1.5 mb-8">
                <span className="bg-gray-200 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider">NO REGRETS</span>
                <span className="text-sm text-gray-600 font-medium">Safe transfer, Anonymous exchange</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-[#102A29] mb-6 leading-[1.1]">
                <span className="text-[#22C55E]">Save Up To 60%</span><br/>
                On AI Models & Cloud Credits
              </h1>
              <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">Find out if you are overpaying for retail APIs, redundant tooling, or missed volume discounts in just 60 seconds.</p>
            </div>
            <div className="max-w-3xl mx-auto">
              <SpendForm onSubmit={handleRunAudit} />
            </div>
          </>
        ) : (
          <ResultsPage 
            result={auditResult} 
            aiSummary={aiSummary} 
            onSubmitEmail={handleCaptureLead} 
          />
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/audit/:id" element={<SharedAudit />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}