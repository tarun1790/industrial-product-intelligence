import React, { useState, useEffect } from 'react';
import { MessageSquare, Sparkles, BookOpen, Volume2, CheckCircle2, ArrowRight, RefreshCw, Send, Layers } from 'lucide-react';
import { explainEngineeringConcept } from '../services/api';

export default function NaturalLanguageCopilotView({ selectedProduct }) {
  const [queryText, setQueryText] = useState('Why does this motor draw 14.7 A at 400V and how does synchronous slip work?');
  const [copilotResponse, setCopilotResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const partNum = selectedProduct?.part_number || 'M3BP 160MLA 4';

  useEffect(() => {
    handleAskCopilot();
  }, [partNum]);

  const handleAskCopilot = async () => {
    if (!queryText.trim()) return;
    setLoading(true);
    try {
      const data = await explainEngineeringConcept(partNum, queryText);
      setCopilotResponse(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const presetQueries = [
    'Why is this motor rated at 14.7 A and what is its efficiency?',
    'How does 2.33% slip generate 48.9 Nm of mechanical torque?',
    'What happens to insulation life if ambient temperature rises above 40°C?',
    'How does this product comply with ATEX Gas Zone 1 / Hydrogen Group IIC?'
  ];

  return (
    <div className="space-y-6 w-full font-sans">
      {/* Header */}
      <div className="premium-card p-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase bg-blue-50 text-blue-700 border border-blue-200/80 font-extrabold tracking-wide">
                Natural Language Physics Derivations
              </span>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 tracking-tight">
                <Sparkles className="w-5 h-5 text-blue-600" />
                Industrial Engineering Copilot & Natural Language Physics Explainer
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Translates complex 3-phase electromagnetic formulas, synchronous slip, and statutory standards into crystal-clear natural language with step-by-step physical derivations.
            </p>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-right shadow-2xs">
            <span className="text-slate-500 block text-[10px] font-medium">Copilot Reasoning Engine</span>
            <span className="font-extrabold text-blue-600 font-mono">
              Physics Grounded (Zero Hallucination)
            </span>
          </div>
        </div>

        {/* Interactive Query Input Box */}
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAskCopilot()}
              placeholder="Ask any engineering question about electrical ratings, slip, thermal dissipation..."
              className="flex-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <button
              onClick={handleAskCopilot}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Explain</span>
            </button>
          </div>

          {/* Quick Preset Query Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="text-slate-500 font-medium">Suggested queries:</span>
            {presetQueries.map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQueryText(q);
                  explainEngineeringConcept(partNum, q).then(setCopilotResponse);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium cursor-pointer transition-all"
              >
                {q.slice(0, 48)}...
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Copilot Response Overview & Derivations */}
      {copilotResponse && (
        <div className="space-y-6">
          {/* Executive Summary Card */}
          <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 shadow-2xs space-y-2">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Executive Engineering Summary:</span>
            </div>
            <p className="text-xs text-slate-800 leading-relaxed font-sans font-medium">
              {copilotResponse.executive_summary}
            </p>
          </div>

          {/* Step-by-Step Mathematical Derivations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {copilotResponse.engineering_derivation_steps.map((step) => (
              <div key={step.step_number} className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-mono font-bold text-xs flex items-center justify-center">
                    {step.step_number}
                  </span>
                  <h4 className="font-extrabold text-xs text-slate-900">{step.title}</h4>
                </div>

                {/* LaTeX / Math Box */}
                <div className="p-2.5 rounded-lg bg-slate-900 text-blue-300 font-mono text-xs text-center border border-slate-800">
                  <code>{step.mathematical_formula}</code>
                </div>

                <div className="space-y-2 text-xs">
                  <p className="text-slate-700 leading-relaxed font-sans">
                    {step.plain_english_explanation}
                  </p>

                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 italic">
                    💡 <strong>Intuition:</strong> {step.physical_intuition}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Key Takeaways Card */}
          <div className="premium-card p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
              Verified Technical Takeaways
            </h3>

            <div className="space-y-1.5">
              {copilotResponse.key_takeaways.map((takeaway, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>{takeaway}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
