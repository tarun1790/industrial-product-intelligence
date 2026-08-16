import React, { useState, useEffect } from 'react';
import { Factory, ShieldCheck, Sparkles, Plus, CheckCircle2, ArrowRight, Layers, Cpu, Settings2, Globe } from 'lucide-react';
import { fetchIndustryProfiles, synthesizeIndustrySchema } from '../services/api';

export default function IndustryAdaptationView() {
  const [industries, setIndustries] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [loading, setLoading] = useState(true);

  // Custom Synthesis State
  const [customIndustryName, setCustomIndustryName] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [customStandards, setCustomStandards] = useState('ISO 28921-1, ASME B16.34, BS 6364');
  const [synthesizedResult, setSynthesizedResult] = useState(null);
  const [synthesizing, setSynthesizing] = useState(false);

  useEffect(() => {
    loadIndustries();
  }, []);

  const loadIndustries = async () => {
    setLoading(true);
    try {
      const data = await fetchIndustryProfiles();
      setIndustries(data);
      if (data.length > 0) setSelectedIndustry(data[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSynthesize = async () => {
    if (!customIndustryName || !customCategory) return;
    setSynthesizing(true);
    try {
      const stdList = customStandards.split(',').map(s => s.trim()).filter(Boolean);
      const res = await synthesizeIndustrySchema({
        industry_name: customIndustryName,
        category_name: customCategory,
        governing_standards: stdList
      });
      setSynthesizedResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setSynthesizing(false);
    }
  };

  return (
    <div className="space-y-6 w-full font-sans">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] uppercase bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                Universal Multi-Industry Architecture
              </span>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Factory className="w-5 h-5 text-blue-600" />
                Cross-Industry Standard Adapters & Autonomous Schema Synthesizer
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              How ProductIQ dynamically adapts to any industrial sector (Pharma, Oil & Gas, Aerospace, Semiconductor, Power) using pluggable standard ontologies and automated constraint solvers.
            </p>
          </div>

          <div className="px-3.5 py-2 rounded-lg bg-blue-50 border border-blue-200 text-xs text-right">
            <span className="text-slate-500 block text-[10px]">Active Standard Plugins</span>
            <span className="font-bold text-blue-700">
              5 Pre-Configured Verticals + Custom Synthesizer
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Pre-Configured Profiles & Synthesizer */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left 4 Cols: Industry Vertical Selector Chips */}
        <div className="xl:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Industrial Verticals
            </h3>
            <span className="text-xs text-slate-500">{industries.length} Registered</span>
          </div>

          <div className="space-y-2">
            {industries.map((ind) => {
              const isSelected = selectedIndustry?.industry_id === ind.industry_id;
              return (
                <button
                  key={ind.industry_id}
                  onClick={() => { setSelectedIndustry(ind); setSynthesizedResult(null); }}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 border-blue-300 shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{ind.industry_name}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 truncate">
                    Standards: {ind.governing_standards?.slice(0, 2).join(', ')}...
                  </div>
                </button>
              );
            })}
          </div>

          {/* Autonomous Synthesizer Banner */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="flex items-center gap-1.5 text-blue-700 font-bold">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Synthesize Any New Industry</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Need Mining, Shipbuilding, Nuclear, or Agriculture? ProductIQ auto-discovers and writes the schema instantly.
            </p>
          </div>
        </div>

        {/* Right 8 Cols: Active Profile Inspector or Synthesized Schema */}
        <div className="xl:col-span-8 space-y-4">
          {selectedIndustry && !synthesizedResult && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                    Standard Profile
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">{selectedIndustry.industry_name}</h3>
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedIndustry.mandatory_certifications?.map((cert, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>

              {/* Governing Standards */}
              <div className="space-y-1.5 text-xs">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
                  Governing Statutory & Technical Standards:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedIndustry.governing_standards?.map((std, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-50 text-blue-800 border border-slate-200 font-mono text-[11px] font-semibold">
                      {std}
                    </span>
                  ))}
                </div>
              </div>

              {/* Critical Validation Rules */}
              <div className="space-y-2 text-xs pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
                  Industry-Specific Engineering Constraints:
                </span>
                <div className="space-y-1.5">
                  {selectedIndustry.critical_validation_rules?.map((rule, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 flex items-center gap-2 text-xs">
                      <span className="text-blue-600 font-bold">●</span>
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Industry Parameters */}
              <div className="space-y-2 text-xs pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
                  Enforced Parameter Schema Fields:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedIndustry.custom_parameters?.map((param, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-0.5">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900 text-xs">{param.display}</span>
                        <span className="text-[10px] font-mono text-blue-700 font-semibold">{param.type}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        Key: {param.name} {param.unit ? `(${param.unit})` : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Autonomous Synthesizer Form */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <Settings2 className="w-4 h-4 text-blue-600" />
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Autonomous Industry Schema Synthesizer (Zero-Code Dynamic Extension)
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-slate-600 font-medium block mb-1">New Industry Name:</label>
                <input
                  type="text"
                  placeholder="e.g. Cryogenic LNG & Gas Distribution"
                  value={customIndustryName}
                  onChange={(e) => setCustomIndustryName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-600 font-medium block mb-1">Product Category:</label>
                <input
                  type="text"
                  placeholder="e.g. Cryogenic Butterfly Valve"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-600 font-medium block mb-1">Governing Standards:</label>
                <input
                  type="text"
                  placeholder="e.g. ISO 28921-1, BS 6364"
                  value={customStandards}
                  onChange={(e) => setCustomStandards(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500 font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                disabled={synthesizing}
                onClick={handleSynthesize}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{synthesizing ? 'Synthesizing...' : 'Synthesize Industry Schema'}</span>
              </button>
            </div>

            {/* Synthesized Output Result */}
            {synthesizedResult && (
              <div className="mt-3 p-4 rounded-xl bg-blue-50/50 border border-blue-200 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-blue-200 pb-2">
                  <span className="font-bold text-blue-950">
                    Generated Schema for: {synthesizedResult.synthesized_industry} ({synthesizedResult.category})
                  </span>
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[10px]">
                    {synthesizedResult.readiness_state}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <span className="text-slate-700 font-semibold block text-[11px]">Auto-Generated Schema Parameters:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {synthesizedResult.auto_generated_schema_fields?.map((fld, fIdx) => (
                      <div key={fIdx} className="p-2 rounded bg-white border border-blue-200 space-y-0.5">
                        <div className="font-bold text-slate-900 font-mono text-[11px]">{fld.field}</div>
                        <div className="text-[10px] text-slate-500">{fld.rationale} ({fld.unit || 'Standard String'})</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
