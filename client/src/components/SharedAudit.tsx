import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

interface FetchedAudit {
  monthly_savings: number;
  ai_summary: string;
}

export default function SharedAudit() {
  const { id } = useParams<{ id: string }>();
  const [fetchedAudit, setFetchedAudit] = useState<FetchedAudit | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Fetch the audit data from our backend
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
      <div className="text-center mt-20">
        <h2 className="text-2xl font-bold">Audit not found</h2>
        <Link to="/" className="text-blue-600 underline mt-4 inline-block">Run a new audit</Link>
      </div>
    );
  }

  if (!fetchedAudit) return <div className="text-center mt-20 text-gray-500">Loading report...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10">
      {/* Open Graph Tags for Twitter/LinkedIn Previews */}
      <Helmet>
        <title>AI Spend Audit | Saved ${fetchedAudit.monthly_savings}/mo</title>
        <meta property="og:title" content={`I just found $${fetchedAudit.monthly_savings}/mo in AI stack savings.`} />
        <meta property="og:description" content="Run your own free AI infrastructure audit to see if you are overpaying for Cursor, ChatGPT, Claude, or APIs." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="text-center p-8 bg-gradient-to-b from-blue-50 to-white rounded-xl border mb-8 shadow-sm">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Anonymous AI Spend Audit</h1>
        <p className="text-xl text-gray-600 mb-2">Total Monthly Savings Identified:</p>
        <p className="text-6xl font-extrabold text-green-600">${fetchedAudit.monthly_savings}</p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-8 border">
        <h3 className="font-bold mb-2 flex items-center gap-2">
          <span>✨</span> AI Analysis
        </h3>
        <p className="text-gray-700 leading-relaxed">{fetchedAudit.ai_summary}</p>
      </div>

      <div className="text-center p-8 bg-gray-900 text-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Are you overpaying for AI?</h2>
        <p className="text-gray-300 mb-6">Find out if you are on the wrong plan or missing out on cheaper alternatives in 60 seconds.</p>
        <Link to="/" className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded font-bold transition-colors inline-block">
          Run Your Free Audit
        </Link>
      </div>
    </div>
  );
}