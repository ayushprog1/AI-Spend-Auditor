import { useState, useEffect } from 'react';
import type { UserInput } from '../types';
import { toolsData } from '../data/pricingData';
import type { UseCase } from '../data/pricingData';

const theme = {
  colors: {
    primary: "text-[#22C55E]",
    secondary: "text-[#102A29]",
    card: "bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] p-8",
    cta: "bg-[#102A29] hover:bg-[#1a4240] text-white font-medium py-3.5 px-8 rounded-full transition-all duration-200",
  },
};

export default function SpendForm({ onSubmit }: { onSubmit: (data: UserInput) => void }) {
  const [formData, setFormData] = useState<UserInput>(() => {
    const saved = localStorage.getItem('auditFormData');
    if (saved) return JSON.parse(saved);
    return {
      teamSize: 1,
      primaryUseCase: 'mixed',
      currentStack: [],
    };
  });

  useEffect(() => {
    localStorage.setItem('auditFormData', JSON.stringify(formData));
  }, [formData]);

  const handleAddTool = () => {
    setFormData((prev) => ({
      ...prev,
      currentStack: [
        ...prev.currentStack,
        { toolId: 'chatgpt', planId: 'plus', seats: 1, monthlySpend: 20 },
      ],
    }));
  };

  const handleRemoveTool = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      currentStack: prev.currentStack.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div className={theme.colors.card}>
        <h2 className={`text-2xl font-bold ${theme.colors.secondary} mb-8`}>Configure Your Stack</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="relative">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M12 11a4 4 0 100-8 4 4 0 000 8zm0 13c3 0 5-1 5-4.5S15 15 12 15 7 16 7 19.5 9 24 12 24z"/></svg>
              Team Size
            </label>
            <input
              type="number"
              min="1"
              value={formData.teamSize}
              onChange={(e) => setFormData({ ...formData, teamSize: parseInt(e.target.value) || 1 })}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:bg-white focus:ring-2 focus:ring-[#22C55E] focus:border-[#22C55E] transition font-medium text-gray-900 outline-none"
            />
          </div>
          <div className="relative">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M10 20l4-16M6 16l-4-4 4-4m12 8l4-4-4-4"/></svg>
              Primary Use Case
            </label>
            <select
              value={formData.primaryUseCase}
              onChange={(e) => setFormData({ ...formData, primaryUseCase: e.target.value as UseCase })}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:bg-white focus:ring-2 focus:ring-[#22C55E] focus:border-[#22C55E] transition appearance-none font-medium text-gray-900 outline-none"
            >
              <option value="coding">Coding</option>
              <option value="writing">Writing</option>
              <option value="data">Data Analysis</option>
              <option value="research">Research</option>
              <option value="mixed">Mixed / General</option>
            </select>
            <svg className="absolute right-5 top-[55%] -translate-y-1/2 text-gray-400 pointer-events-none" width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className={`text-xl font-bold ${theme.colors.secondary} px-2`}>Tools Currently in Use</h3>
        
        {formData.currentStack.map((tool, index) => (
          <div key={index} className={`${theme.colors.card} grid md:grid-cols-12 gap-6 items-center p-6`}>
            <div className="col-span-12 md:col-span-4 relative">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Tool</label>
              <select
                value={tool.toolId}
                onChange={(e) => {
                  const newStack = [...formData.currentStack];
                  newStack[index].toolId = e.target.value;
                  newStack[index].planId = toolsData[e.target.value].plans[0].id; 
                  setFormData({ ...formData, currentStack: newStack });
                }}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 text-sm font-medium text-gray-800 appearance-none outline-none focus:ring-2 focus:ring-[#22C55E]"
              >
                {Object.values(toolsData).map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              <svg className="absolute right-4 top-[65%] -translate-y-1/2 text-gray-400 pointer-events-none" width="14" height="14" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
            </div>

            <div className="col-span-12 md:col-span-3 relative">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Plan</label>
              <select
                value={tool.planId}
                onChange={(e) => {
                  const newStack = [...formData.currentStack];
                  newStack[index].planId = e.target.value;
                  setFormData({ ...formData, currentStack: newStack });
                }}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 text-sm font-medium text-gray-800 appearance-none outline-none focus:ring-2 focus:ring-[#22C55E]"
              >
                {toolsData[tool.toolId]?.plans.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <svg className="absolute right-4 top-[65%] -translate-y-1/2 text-gray-400 pointer-events-none" width="14" height="14" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
            </div>

            <div className="col-span-6 md:col-span-2">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Seats</label>
              <input
                type="number"
                min="1"
                value={tool.seats}
                onChange={(e) => {
                  const newStack = [...formData.currentStack];
                  newStack[index].seats = parseInt(e.target.value) || 1;
                  setFormData({ ...formData, currentStack: newStack });
                }}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 text-sm font-medium text-center outline-none focus:ring-2 focus:ring-[#22C55E]"
              />
            </div>

            <div className="col-span-6 md:col-span-3 flex items-end gap-2">
              <div className="relative flex-1">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Total $/mo</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                  <input
                    type="number"
                    min="0"
                    value={tool.monthlySpend}
                    onChange={(e) => {
                      const newStack = [...formData.currentStack];
                      newStack[index].monthlySpend = parseInt(e.target.value) || 0;
                      setFormData({ ...formData, currentStack: newStack });
                    }}
                    className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#22C55E]"
                    placeholder="20"
                  />
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => handleRemoveTool(index)}
                className="p-3 mb-[2px] bg-red-50 text-red-500 hover:bg-red-100 rounded-2xl transition"
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.8 13.4a2 2 0 01-2 1.6H7.8a2 2 0 01-2-1.6L5 7m14-3h-3.5a1 1 0 01-1-1v-.5a1 1 0 00-1-1h-3a1 1 0 00-1 1v.5a1 1 0 01-1 1H5m10 3H9"/></svg>
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddTool}
          className="px-6 py-4 border-2 border-dashed border-gray-200 rounded-[2rem] w-full text-gray-500 font-semibold hover:text-[#22C55E] hover:border-[#22C55E] hover:bg-green-50/50 flex items-center justify-center gap-2 transition-all duration-200"
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" d="M12 5v14m7-7H5"/></svg> Add another tool
        </button>
      </div>

      <div className="pt-8 text-center">
        <button
          type="submit"
          className={theme.colors.cta}
        >
          Run AI Cost Audit →
        </button>
      </div>
    </form>
  );
}