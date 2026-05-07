import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Import your components
import SpendForm from './components/SpendForm';
import ResultsPage from './components/ResultsPage';
import SharedAudit from './components/SharedAudit';
import { runAudit, AuditResult } from './utils/auditEngine';
import { UserInput } from './types';

// The main page flow
function Home() {
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [teamSize, setTeamSize] = useState<number>(1);

  const handleRunAudit = async (data: UserInput) => {
    // 1. Run the local math engine
    const result = runAudit(data);
    setAuditResult(result);
    setTeamSize(data.teamSize);

    // 2. Fetch the AI Summary from backend
    try {
      const response = await fetch('http://localhost:3001/api/generate-summary', {
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
      console.error("Failed to fetch summary");
      setAiSummary("Could not generate summary at this time.");
    }
  };

  const handleCaptureLead = async (email: string) => {
    try {
      const response = await fetch('http://localhost:3001/api/capture-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, auditResult, teamSize, aiSummary }),
      });
      const data = await response.json();
      
      // If successful, log the shareable link the user can copy
      if (data.shareId) {
        console.log(`Shareable URL: ${window.location.origin}/audit/${data.shareId}`);
        // You could update your ResultsPage UI to display this link to the user!
      }
    } catch (error) {
      console.error("Failed to capture lead");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-4xl mx-auto px-4 text-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Credex AI Spend Auditor</h1>
        <p className="text-lg text-gray-600">Stop burning cash on AI subscriptions.</p>
      </div>

      {!auditResult ? (
        <SpendForm onSubmit={handleRunAudit} />
      ) : (
        <ResultsPage 
          result={auditResult} 
          aiSummary={aiSummary} 
          onSubmitEmail={handleCaptureLead} 
        />
      )}
    </div>
  );
}

// The main App wrapper with Routing
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