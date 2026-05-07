import { useState } from 'react';
import { AuditResult } from '../utils/auditEngine';

interface ResultsPageProps {
  result: AuditResult;
  aiSummary: string | null; // We will generate this from the backend next
  onSubmitEmail: (email: string) => void;
}

export default function ResultsPage({ result, aiSummary, onSubmitEmail }: ResultsPageProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitEmail(email);
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      {/* 1. Hero Section: Big and Clear Savings */}
      <div className="text-center p-8 bg-gradient-to-b from-green-50 to-white rounded-xl border border-green-100 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Your AI Spend Audit</h1>
        <p className="text-gray-600 mb-6">Here is how much you could save by optimizing your stack.</p>
        <div className="flex justify-center gap-8">
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Monthly Savings</p>
            <p className="text-5xl font-extrabold text-green-600">${result.monthlySavings}</p>
          </div>
          <div className="border-l border-gray-200"></div>
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Annual Savings</p>
            <p className="text-5xl font-extrabold text-green-600">${result.annualSavings}</p>
          </div>
        </div>
      </div>

      {/* 2. AI-Generated Summary (Requirement #4) */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 text-blue-900">
        <h3 className="font-bold mb-2 flex items-center gap-2">
          <span>✨</span> AI Analysis
        </h3>
        {aiSummary ? (
          <p className="text-sm leading-relaxed">{aiSummary}</p>
        ) : (
          <p className="text-sm italic text-gray-500">Generating personalized summary...</p>
        )}
      </div>

      {/* 3. Per-Tool Breakdown */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold border-b pb-2">Line-Item Breakdown</h2>
        {result.toolAudits.map((audit, i) => (
          <div key={i} className="p-4 bg-white border rounded-lg shadow-sm flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div>
              <p className="font-bold text-lg capitalize">{audit.toolId.replace('_api', ' API')}</p>
              <p className="text-sm text-gray-600">Current: ${audit.currentSpend}/mo</p>
            </div>
            
            <div className="flex-1 md:px-6">
              <span className={`inline-block px-2 py-1 text-xs font-bold rounded uppercase mb-2 ${
                audit.recommendedAction === 'keep' ? 'bg-gray-100 text-gray-600' :
                audit.recommendedAction === 'downgrade' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                Action: {audit.recommendedAction}
              </span>
              <p className="text-sm text-gray-800 font-medium">{audit.reason}</p>
            </div>

            <div className="text-right whitespace-nowrap">
              <p className="text-sm font-semibold text-gray-500">New Spend: ${audit.newSpend}</p>
              {audit.savings > 0 && (
                <p className="text-lg font-bold text-green-600">Save ${audit.savings}/mo</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 4. Conditional Lead Capture (Credex Pitch vs Honest Assessment) */}
      <div className="mt-12 p-8 bg-gray-900 text-white rounded-xl text-center">
        {result.isHighSavings ? (
          <>
            <h2 className="text-2xl font-bold mb-2">Stop burning cash on AI.</h2>
            <p className="text-gray-300 mb-6">
              You are leaving over ${result.monthlySavings}/mo on the table. Credex can provide discounted API credits and consolidate your billing to capture these exact savings immediately.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-2">You're spending well.</h2>
            <p className="text-gray-300 mb-6">
              Your AI stack is highly optimized. We won't manufacture savings that aren't there. Get notified when new pricing changes or cheaper models drop that affect your stack.
            </p>
          </>
        )}

        {submitted ? (
          <div className="bg-green-800 text-green-100 p-4 rounded-lg font-medium">
            Report secured! Check your inbox shortly.
          </div>
        ) : (
          <form onSubmit={handleEmailSubmit} className="flex max-w-md mx-auto gap-2">
            <input
              type="email"
              required
              placeholder="Enter work email for full report"
              className="flex-1 px-4 py-2 rounded text-gray-900 border-none outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded font-bold transition-colors">
              {result.isHighSavings ? 'Book Consultation' : 'Get Notified'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}