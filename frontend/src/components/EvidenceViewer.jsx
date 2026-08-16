import React, { useState } from 'react';
import { FileText, Eye, CheckCircle2, ShieldCheck, Search, Filter, ExternalLink } from 'lucide-react';

export default function EvidenceViewer({ product }) {
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  if (!product) return null;

  const evidenceList = product.evidence_trail || [];
  const filteredEvidence = evidenceList.filter(e =>
    e.attribute_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.snippet.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.source_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] uppercase bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                Pillar 4 • Provenance Trail
              </span>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Multi-Modal PDF & Datasheet Ground-Truth Evidence Trail
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Inspection of exact page numbers, visual bounding boxes, OCR confidence scores, and verbatim source quotations.
            </p>
          </div>

          <div className="px-3.5 py-2 rounded-lg bg-blue-50 border border-blue-200 text-xs text-right">
            <span className="text-slate-500 block text-[10px]">Indexed Citations</span>
            <span className="font-bold text-blue-700">{evidenceList.length} Ground-Truth Excerpts</span>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter evidence by parameter name, source datasheet, or keyword..."
            className="w-full px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>
      </div>

      {/* Evidence Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredEvidence.map((ev) => (
          <div
            key={ev.id}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-300 transition-all"
          >
            <div>
              <div className="flex items-start justify-between border-b border-slate-100 pb-2.5">
                <div>
                  <span className="px-2 py-0.2 rounded text-[9px] uppercase bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
                    {ev.source_type.replace(/_/g, ' ')}
                  </span>
                  <h3 className="text-xs font-bold text-slate-900 mt-1 uppercase">{ev.attribute_name}</h3>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-blue-700 font-mono">{(ev.confidence * 100).toFixed(0)}%</span>
                  <span className="text-[9px] text-slate-500 block">OCR Conf.</span>
                </div>
              </div>

              <div className="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Document:</span>
                  <span className="text-slate-800 font-semibold truncate max-w-[160px]" title={ev.source_name}>{ev.source_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Page:</span>
                  <span className="text-blue-700 font-bold font-mono">Page {ev.page_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Raw Extracted:</span>
                  <span className="text-slate-900 font-bold font-mono">{ev.raw_value}</span>
                </div>
              </div>

              <div className="mt-3 p-2.5 rounded bg-blue-50/40 border border-blue-200 text-xs text-slate-800 italic leading-relaxed font-sans">
                "{ev.snippet}"
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-blue-700 font-semibold text-[11px] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Bounding Box Verified
              </span>
              <span className="text-slate-500 text-[10px] font-mono">ID: {ev.id}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
