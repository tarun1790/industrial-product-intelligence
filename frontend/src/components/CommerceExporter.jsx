import React, { useState } from 'react';
import { Database, Download, Copy, Check, ExternalLink, Code2, Layers, Tag, Globe } from 'lucide-react';

export default function CommerceExporter({ product }) {
  const [copied, setCopied] = useState(false);
  const [exportType, setExportType] = useState('jsonld');

  if (!product) return null;

  const comm = product.commerce;
  const jsonLdString = comm?.json_ld_schema ? JSON.stringify(comm.json_ld_schema, null, 2) : '{}';

  const handleCopyJsonLd = () => {
    navigator.clipboard.writeText(jsonLdString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = (type) => {
    const filename = `${product.clean_part_number}_export.${type === 'csv' ? 'csv' : 'json'}`;
    let content = '';
    let mime = 'application/json';

    if (type === 'json') {
      content = JSON.stringify(product, null, 2);
    } else if (type === 'jsonld') {
      content = jsonLdString;
    } else if (type === 'csv') {
      mime = 'text/csv';
      const rows = Object.entries(product.attributes || {}).map(([k, v]) => `"${k}","${v.raw_value}","${v.normalized_value || ''}","${v.unit || ''}"`);
      content = 'Attribute,Raw Value,Normalized Value,Unit\n' + rows.join('\n');
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono uppercase bg-cyan-950 text-cyan-400 border border-cyan-800">
                PIM / COMMERCE READY
              </span>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Database className="w-6 h-6 text-cyan-400" />
                Commerce-Ready Product Intelligence & Schema Generator
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Automated production of SEO titles, rich Schema.org JSON-LD snippets, marketplace bullet points, and multi-format PIM export bundles.
            </p>
          </div>

          {/* Export Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleDownloadFile('jsonld')}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono font-semibold border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>JSON-LD</span>
            </button>
            <button
              onClick={() => handleDownloadFile('csv')}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-mono font-semibold border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV Specs</span>
            </button>
            <button
              onClick={() => handleDownloadFile('json')}
              className="px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Full Product JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Commerce Product Page Preview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono uppercase bg-slate-800 text-cyan-400 border border-slate-700">
                  {product.category}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-400 border border-slate-700">
                  HSN / UNSPSC: {comm?.hsn_unspsc_code || '85015200'}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight leading-snug">
                {comm?.title || product.title}
              </h3>
              <p className="text-xs text-cyan-300 font-mono mt-1">
                {comm?.subtitle}
              </p>
            </div>

            {/* Description */}
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans">
              {comm?.short_description}
            </div>

            {/* Key Engineering Features */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono mb-2.5">
                Key Engineering Highlights
              </h4>
              <ul className="space-y-2">
                {comm?.key_features?.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Target Applications */}
            <div className="pt-2 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono mb-2.5">
                Approved Industrial Applications
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {comm?.applications?.map((app, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded bg-slate-950 text-slate-300 text-xs border border-slate-800 font-mono">
                    {app}
                  </span>
                ))}
              </div>
            </div>

            {/* SEO Metadata Box */}
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono space-y-2">
              <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <Globe className="w-4 h-4" /> SEO Meta Preview:
              </div>
              <div className="text-sky-400 font-semibold">{comm?.seo_meta_title}</div>
              <div className="text-slate-400 text-[11px]">{comm?.seo_meta_description}</div>
              <div className="flex flex-wrap gap-1 pt-1">
                {comm?.seo_keywords?.map((kw, idx) => (
                  <span key={idx} className="px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 text-[10px] border border-slate-800">
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Schema.org JSON-LD Code Inspector */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              Schema.org JSON-LD
            </h4>
            <button
              onClick={handleCopyJsonLd}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono flex items-center gap-1 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 shadow-xl overflow-x-auto max-h-[560px]">
            <pre className="text-[11px] font-mono text-emerald-300/90 whitespace-pre-wrap leading-tight">
              {jsonLdString}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
