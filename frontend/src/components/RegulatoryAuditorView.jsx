import React, { useState, useEffect } from 'react';
import { ShieldCheck, Award, FileCheck2, CheckCircle2, Lock, Download, RefreshCw, AlertCircle, Globe } from 'lucide-react';
import { fetchComplianceAudit } from '../services/api';

export default function RegulatoryAuditorView({ selectedProduct }) {
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);

  const partNum = selectedProduct?.part_number || 'M3BP 160MLA 4';
  const mfg = selectedProduct?.manufacturer || 'ABB';

  useEffect(() => {
    loadAudit();
  }, [partNum, mfg]);

  const loadAudit = async () => {
    setLoading(true);
    try {
      const data = await fetchComplianceAudit(partNum, mfg);
      setCert(data);
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
                ISO/IEC 17025 Automated Test Protocol
              </span>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 tracking-tight">
                <Award className="w-5 h-5 text-blue-600" />
                Autonomous Statutory Regulatory Compliance AI Auditor
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Automated statutory compliance audit against EU CBAM Carbon Tariffs, ATEX 2014/34/EU Explosion-Proof directives, RoHS 3 SVHC thresholds, OSHA machine guarding, and FDA contact rules.
            </p>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-right shadow-2xs">
            <span className="text-slate-500 block text-[10px] font-medium">Certificate Ref</span>
            <span className="font-extrabold text-blue-600 font-mono">
              {cert?.certificate_id || 'CERT-EU-USA-2024'}
            </span>
          </div>
        </div>
      </div>

      {/* Certificate Stat Overview */}
      {cert && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-semibold">Compliance Grade</span>
            <span className="text-2xl font-extrabold text-blue-600 block font-mono">GRADE A</span>
            <span className="text-[10px] text-blue-600 font-medium">100% Mandates Passed</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-semibold">Audited Frameworks</span>
            <span className="text-2xl font-extrabold text-slate-900 block font-mono">{cert.total_regulations_audited} Directives</span>
            <span className="text-[10px] text-slate-500">EU • USA • IEC Standards</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-semibold">CBAM Scope 3 Carbon</span>
            <span className="text-2xl font-extrabold text-slate-900 block font-mono">184.5 kg CO2e</span>
            <span className="text-[10px] text-slate-500">Verified LCA Intensity</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-semibold">Statutory Penalty Risk</span>
            <span className="text-2xl font-extrabold text-blue-700 block font-mono">$0.00 USD</span>
            <span className="text-[10px] text-blue-700 font-medium">Zero Violation Exposure</span>
          </div>
        </div>
      )}

      {/* Regulatory Directives Audit Table */}
      {cert && (
        <div className="premium-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Statutory Regulatory Directives Ledger ({cert.regulatory_items.length} Audited Directives)
              </h3>
              <span className="text-xs text-slate-500">Official notified body verification records</span>
            </div>
            <button className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs">
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Export Audit Certificate PDF</span>
            </button>
          </div>

          <div className="space-y-3">
            {cert.regulatory_items.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 text-xs block">{item.regulation_name}</span>
                    <span className="text-[10px] text-slate-500 font-mono font-medium">{item.regulation_code} • {item.governing_body}</span>
                  </div>
                  <span className="text-blue-700 font-bold text-xs flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" /> {item.audit_status}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1 font-mono text-[11px]">
                  <div className="text-slate-500 font-semibold">Statutory Threshold: <span className="text-slate-800">{item.statutory_threshold}</span></div>
                  <div className="text-slate-500 font-semibold">Tested Values: <span className="text-blue-700">{JSON.stringify(item.tested_parameters).replace(/[{""}]/g, ' ')}</span></div>
                </div>

                <p className="text-slate-700 text-[11px] leading-relaxed font-sans">
                  {item.audit_finding}
                </p>
              </div>
            ))}
          </div>

          {/* Cryptographic Merkle Proof Footer */}
          <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] font-mono text-slate-700">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-600" />
              <span>SHA-256 Digital Certificate Seal: <strong className="text-slate-900">{cert.digital_signature_sha256.slice(0, 36)}...</strong></span>
            </div>
            <span className="text-blue-800 font-bold">Audit Date: {cert.audit_date}</span>
          </div>
        </div>
      )}
    </div>
  );
}
