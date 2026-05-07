import { useState, useEffect } from 'react';
import { UserInput } from '../types';
import { toolsData, UseCase } from '../data/pricingData';

export default function SpendForm({ onSubmit }: { onSubmit: (data: UserInput) => void }) {
  // Initialize state, checking localStorage first to meet the persistence requirement
  const [formData, setFormData] = useState<UserInput>(() => {
    const saved = localStorage.getItem('auditFormData');
    if (saved) return JSON.parse(saved);
    return {
      teamSize: 1,
      primaryUseCase: 'mixed',
      currentStack: [],
    };
  });

  // Save to localStorage whenever formData changes
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
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Your AI Stack</h2>

      {/* Global Settings */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Team Size</label>
          <input
            type="number"
            min="1"
            value={formData.teamSize}
            onChange={(e) => setFormData({ ...formData, teamSize: parseInt(e.target.value) })}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Primary Use Case</label>
          <select
            value={formData.primaryUseCase}
            onChange={(e) => setFormData({ ...formData, primaryUseCase: e.target.value as UseCase })}
            className="w-full border rounded p-2"
          >
            <option value="coding">Coding</option>
            <option value="writing">Writing</option>
            <option value="data">Data Analysis</option>
            <option value="research">Research</option>
            <option value="mixed">Mixed / General</option>
          </select>
        </div>
      </div>

      {/* Dynamic Tools List */}
      <div className="mb-6 space-y-4">
        <h3 className="font-semibold border-b pb-2">Tools Currently in Use</h3>
        {formData.currentStack.map((tool, index) => (
          <div key={index} className="flex gap-4 items-end bg-gray-50 p-4 rounded border">
            {/* Tool Selection */}
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">Tool</label>
              <select
                value={tool.toolId}
                onChange={(e) => {
                  const newStack = [...formData.currentStack];
                  newStack[index].toolId = e.target.value;
                  // Reset plan to the first available when tool changes
                  newStack[index].planId = toolsData[e.target.value].plans[0].id; 
                  setFormData({ ...formData, currentStack: newStack });
                }}
                className="w-full border rounded p-2"
              >
                {Object.values(toolsData).map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            {/* Plan Selection */}
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">Plan</label>
              <select
                value={tool.planId}
                onChange={(e) => {
                  const newStack = [...formData.currentStack];
                  newStack[index].planId = e.target.value;
                  setFormData({ ...formData, currentStack: newStack });
                }}
                className="w-full border rounded p-2"
              >
                {toolsData[tool.toolId]?.plans.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Seats */}
            <div className="w-20">
              <label className="block text-sm text-gray-600 mb-1">Seats</label>
              <input
                type="number"
                min="1"
                value={tool.seats}
                onChange={(e) => {
                  const newStack = [...formData.currentStack];
                  newStack[index].seats = parseInt(e.target.value);
                  setFormData({ ...formData, currentStack: newStack });
                }}
                className="w-full border rounded p-2"
              />
            </div>

            {/* Remove Button */}
            <button 
              type="button" 
              onClick={() => handleRemoveTool(index)}
              className="text-red-500 hover:text-red-700 p-2"
            >
              Remove
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddTool}
          className="text-blue-600 font-medium hover:underline"
        >
          + Add another tool
        </button>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 transition-colors"
      >
        Run Audit
      </button>
    </form>
  );
}