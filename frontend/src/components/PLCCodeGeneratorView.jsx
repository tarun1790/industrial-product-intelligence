import React, { useState, useEffect } from 'react';
import { Terminal, Cpu, Copy, CheckCircle2, Download, RefreshCw, Layers, ShieldCheck, Code2 } from 'lucide-react';
import { fetchPLCCode } from '../services/api';

export default function PLCCodeGeneratorView({ selectedProduct }) {
  const [targetBrand, setTargetBrand] = useState('Siemens S7-1500');
  const [codePackage, setCodePackage] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const partNum = selectedProduct?.part_number || 'M3BP 160MLA 4';

  useEffect(() => {
    loadPLCCode();
  }, [partNum, targetBrand]);

  const loadPLCCode = async () => {
    setLoading(true);
    try {
      const data = await fetchPLCCode(partNum, targetBrand);
      setCodePackage(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (codePackage?.structured_text_code) {
      navigator.clipboard.writeText(codePackage.structured_text_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
                IEC 61131-3 Automation Compiler
              </span>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 tracking-tight">
                <Terminal className="w-5 h-5 text-blue-600" />
                Generative PLC Control Code & SCADA Modbus Register Synthesizer
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Compiles verified physical motor specs and thermal safety limits directly into production-ready Structured Text (ST), Ladder Logic (LAD) rungs, and Modbus TCP telemetry register maps.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={targetBrand}
              onChange={(e) => setTargetBrand(e.target.value)}
              className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-xs font-bold text-blue-800 cursor-pointer shadow-2xs font-mono"
            >
              <option value="Siemens S7-1500">Siemens S7-1500 (TIA Portal v18)</option>
              <option value="Rockwell ControlLogix">Rockwell ControlLogix (Studio 5000)</option>
              <option value="Beckhoff TwinCAT 3">Beckhoff TwinCAT 3 (EtherCAT)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Code Studio & Rungs Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left 7 Cols: Structured Text Code Editor */}
        <div className="xl:col-span-7 premium-card p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                IEC 61131-3 Structured Text (ST) Source
              </h3>
            </div>

            <button
              onClick={handleCopy}
              className="px-3 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> : <Copy className="w-3.5 h-3.5 text-blue-600" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy ST Code'}</span>
            </button>
          </div>

          {/* Dark IDE Code View */}
          <div className="w-full bg-slate-950 rounded-xl p-4 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-[440px] leading-relaxed border border-slate-800 shadow-inner">
            <pre className="text-blue-400">
              {codePackage?.structured_text_code || '// Generating PLC Code...'}
            </pre>
          </div>
        </div>

        {/* Right 5 Cols: Ladder Logic Rungs & Modbus TCP Register Map */}
        <div className="xl:col-span-5 space-y-4">
          {/* Ladder Rungs */}
          <div className="premium-card p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
              Ladder Logic (LAD) Graphical Rungs
            </h3>

            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {codePackage?.ladder_logic_rungs?.map((rung) => (
                <div key={rung.rung_number} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">Rung {rung.rung_number}: {rung.title}</span>
                  </div>
                  <pre className="p-2 rounded bg-slate-900 text-blue-300 font-mono text-[10px] overflow-x-auto">
                    {rung.logic_expression}
                  </pre>
                  <p className="text-slate-600 text-[11px] font-sans">
                    {rung.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Modbus Registers */}
          <div className="premium-card p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
              SCADA Modbus TCP Register Map
            </h3>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 font-mono text-[11px]">
              {codePackage?.modbus_registers?.map((reg) => (
                <div key={reg.register_address} className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-blue-700">[{reg.register_address}]</span>{' '}
                    <span className="font-semibold text-slate-800">{reg.parameter_name}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    {reg.engineering_unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
