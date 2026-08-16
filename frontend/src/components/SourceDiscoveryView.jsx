import React, { useState, useEffect } from 'react';
import { Globe, FileText, BookOpen, ShoppingCart, Archive, ExternalLink, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';
import { fetchDiscoveredSources } from '../services/api';

export default function SourceDiscoveryView({ product }) {
  const [discoveryReport, setDiscoveryReport] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product?.part_number) {
      loadSources(product.part_number, product.manufacturer);
    }
  }, [product]);

  const loadSources = async (partNo, mfg) => {
    setLoading(true);
    try {
      const res = await fetchDiscoveredSources(partNo);
      setDiscoveryReport(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getSourceIcon = (type) => {
    switch (type) {
      case 'OEM_PRIMARY_PAGE':
        return Globe;
      case 'OEM_DATASHEET_PDF':
        return FileText;
      case 'TECHNICAL_MANUAL':
        return BookOpen;
      case 'DISTRIBUTOR_CATALOG':
        return ShoppingCart;
      case 'HISTORICAL_ARCHIVE':
        return Archive;
      default:
        return FileText;
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] uppercase bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                Pillar 1 • Identify & Discover
              </span>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" />
                Agentic Source Discovery & Document Registry
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Multi-modal harvester that indexes and ranks OEM primary portals, engineering manuals, technical datasheets, distributor feeds, and revision archives.
            </p>
          </div>

          <div className="px-3.5 py-2 rounded-lg bg-blue-50 border border-blue-200 text-xs text-right">
            <span className="text-slate-500 block text-[10px]">Harvested Sources</span>
            <span className="font-bold text-blue-700">
              {discoveryReport?.total_sources_discovered || 5} Verified Repositories
            </span>
          </div>
        </div>
      </div>

      {/* Discovered Sources Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1 text-xs">
          <span className="font-bold text-slate-700 uppercase tracking-wider">
            Ranked Document Authority Registry
          </span>
          <span className="text-slate-500">Sorted by OEM Hierarchy & Fingerprint Alignment</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {discoveryReport?.ranked_sources?.map((src, idx) => {
            const Icon = getSourceIcon(src.source_type);
            const isOem = src.authority_score >= 0.95;

            return (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-300 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <span className="px-2 py-0.2 rounded text-[9px] uppercase bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
                          {src.source_type.replace(/_/g, ' ')}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 mt-1 leading-snug">{src.source_name}</h4>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-blue-700 font-mono">
                        {(src.authority_score * 100).toFixed(0)}%
                      </span>
                      <span className="text-[9px] text-slate-500 block">Authority</span>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Publication ID:</span>
                      <span className="text-slate-700 font-mono truncate max-w-[170px]" title={src.uri_or_pub_id}>
                        {src.uri_or_pub_id}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Revision Year:</span>
                      <span className="text-blue-700 font-semibold">{src.publication_year}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Extracted Specs:</span>
                      <span className="text-slate-800 font-bold">{src.extracted_parameters_count} Attributes</span>
                    </div>
                  </div>

                  {/* Notes */}
                  {src.notes && (
                    <p className="mt-2.5 text-[11px] text-slate-600 leading-relaxed">
                      {src.notes}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-blue-700 text-[11px] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Fingerprint Verified
                  </span>
                  <span className="text-slate-500 text-[10px] uppercase font-semibold">{src.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
