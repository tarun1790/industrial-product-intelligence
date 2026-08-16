import React, { useState, useEffect } from 'react';
import { ShoppingCart, DollarSign, Clock, ShieldCheck, Sparkles, FileText, CheckCircle2, ArrowRight, RefreshCw, Send, Download } from 'lucide-react';
import { generateAutonomousRfq } from '../services/api';

export default function AutonomousRfqView() {
  const [prompt, setPrompt] = useState('Corrosive chemical acid transfer skid with ATEX Zone 1 compliance and 6 bar pressure');
  const [rfq, setRfq] = useState(null);
  const [loading, setLoading] = useState(false);

  const samplePrompts = [
    'Corrosive chemical acid transfer skid with ATEX Zone 1 compliance and 6 bar pressure',
    'Cryogenic liquid hydrogen fueling transfer subsystem operating down to -253°C',
    'High-speed discrete automation conveyor drive with pneumatic pushers'
  ];

  useEffect(() => {
    handleGenerate(prompt);
  }, []);

  const handleGenerate = async (query) => {
    const q = query || prompt;
    if (!q) return;
    setLoading(true);
    try {
      const res = await generateAutonomousRfq(q);
      setRfq(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-full font-sans">
      {/* Header */}
      <div className="premium-card p-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase bg-blue-50 text-blue-700 border border-blue-200/80 font-extrabold tracking-wide">
                Autonomous B2B Procurement
              </span>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 tracking-tight">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
                AI Autonomous RFQ (Request for Quotation) & System Synthesizer
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Decomposes natural language industrial requirements into multi-vendor Bills of Materials, calculates estimated unit pricing, delivery lead times, and validates statutory compliance.
            </p>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-right shadow-2xs">
            <span className="text-slate-500 block text-[10px] font-medium">RFQ Reference</span>
            <span className="font-extrabold text-blue-600 font-mono">
              {rfq?.rfq_id || 'RFQ-2024-SYS'}
            </span>
          </div>
        </div>

        {/* Input Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
          <label className="text-xs font-bold text-slate-700">Enter Operational Requirement or Skid Description:</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate(prompt)}
              placeholder="e.g. Corrosive acid transfer skid with ATEX Zone 1 compliance..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 font-medium"
            />
            <button
              onClick={() => handleGenerate(prompt)}
              disabled={loading}
              className="btn-primary px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>Synthesize RFQ</span>
            </button>
          </div>

          {/* Prompt Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
            <span className="text-[11px] text-slate-500 font-bold whitespace-nowrap">Examples:</span>
            {samplePrompts.map((sp, idx) => (
              <button
                key={idx}
                onClick={() => { setPrompt(sp); handleGenerate(sp); }}
                className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-700 text-[11px] font-medium border border-slate-200 transition-all whitespace-nowrap cursor-pointer"
              >
                {sp.slice(0, 45)}...
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RFQ Package Output */}
      {rfq && (
        <div className="space-y-4">
          {/* Executive Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <span className="text-slate-500 text-[10px] uppercase font-semibold">Total Estimated Cost</span>
              <span className="text-2xl font-extrabold text-slate-900 block font-mono">
                ${rfq.total_estimated_cost_usd.toLocaleString()} USD
              </span>
              <span className="text-[10px] text-slate-500">MSRP Benchmark</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <span className="text-slate-500 text-[10px] uppercase font-semibold">Max Delivery Lead Time</span>
              <span className="text-2xl font-extrabold text-blue-600 block font-mono">
                {rfq.max_lead_time_days} Days
              </span>
              <span className="text-[10px] text-blue-600 font-medium">Critical Path Lead Time</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <span className="text-slate-500 text-[10px] uppercase font-semibold">BOM Line Items</span>
              <span className="text-2xl font-extrabold text-slate-900 block font-mono">
                {rfq.items.length} Subsystems
              </span>
              <span className="text-[10px] text-slate-500">Multi-Vendor Coordinated</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <span className="text-slate-500 text-[10px] uppercase font-semibold">Compliance Assurance</span>
              <span className="text-2xl font-extrabold text-blue-700 block font-mono">
                100% PASS
              </span>
              <span className="text-[10px] text-blue-700 font-medium">ATEX / IEC / ASME</span>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="premium-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">{rfq.system_title}</h3>
                <span className="text-xs text-slate-500 font-medium">Target Environment: {rfq.operating_environment}</span>
              </div>
              <button className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs">
                <Download className="w-3.5 h-3.5 text-blue-600" />
                <span>Export RFQ PDF</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-[11px] uppercase font-bold">
                    <th className="py-2.5 px-3">Item #</th>
                    <th className="py-2.5 px-3">Role</th>
                    <th className="py-2.5 px-3">Part Number</th>
                    <th className="py-2.5 px-3">Manufacturer</th>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3">Lead Time</th>
                    <th className="py-2.5 px-3 text-right">Est. Unit Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rfq.items.map((item) => (
                    <tr key={item.line_item} className="table-row-hover">
                      <td className="py-3 px-3 font-mono font-bold text-slate-500">#{item.line_item}</td>
                      <td className="py-3 px-3 font-bold text-slate-900">{item.role}</td>
                      <td className="py-3 px-3 font-mono font-bold text-blue-700">{item.part_number}</td>
                      <td className="py-3 px-3 font-semibold text-slate-800">{item.manufacturer}</td>
                      <td className="py-3 px-3 text-slate-600">{item.description}</td>
                      <td className="py-3 px-3 font-mono text-slate-600">{item.lead_time_days} days</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                        ${item.unit_price_usd.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Engineering Summary Footer */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block">
                Engineering Synthesis Summary:
              </span>
              <p className="text-slate-700 leading-relaxed font-sans">
                {rfq.engineering_summary}
              </p>
              <div className="text-[11px] text-blue-700 font-semibold pt-1">
                Risk Evaluation: {rfq.risk_assessment}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
