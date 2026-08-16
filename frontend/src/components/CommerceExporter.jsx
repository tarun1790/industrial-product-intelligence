import React, { useState } from 'react';
import { Database, Download, Copy, Check, Tag, Globe, Code2 } from 'lucide-react';

export default function CommerceExporter({ product }) {
  const [copied, setCopied] = useState(false);

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
    <div className="space-y-6 w-full font-mono">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] uppercase bg-slate-950 text-amber-400 border border-slate-800 font-bold">
                PIM / COMMERCE READY
              </span>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-amber-400" />
                Commerce-Ready Product Intelligence & Schema Generator
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Automated production of SEO titles, rich Schema.org JSON-LD snippets, marketplace engineering bullet points, and multi-format PIM export bundles.
            </p>
          </div>

          {/* Export Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleDownloadFile('jsonld')}
              className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-800 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>JSON-LD</span>
            </button>
            <button
              onClick={() => handleDownloadFile('csv')}
              className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-800 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>CSV Specs</span>
            </button>
            <button
              onClick={() => handleDownloadFile('json')}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Full Product JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left 2 Columns: Product Page Preview */}
        <div className="xl:col-span-2 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] uppercase bg-slate-950 text-amber-400 border border-slate-800">
                  {product.category}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-slate-950 text-slate-400 border border-slate-800">
                  HSN / UNSPSC: {comm?.hsn_unspsc_code || '85015200'}
                </span>
              </div>
              <h3 className="text-base font-bold text-white leading-snug">
                {comm?.title || product.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {comm?.subtitle}
              </p>
            </div>

            {/* Description */}
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed font-mono">
              {comm?.short_description}
            </div>

            {/* Key Features */}
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Key Engineering Highlights
              </div>
              <ul className="space-y-1.5 text-xs">
                {comm?.key_features?.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-200">
                    <span className="text-amber-400">▪</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Approved Applications */}
            <div className="pt-2 border-t border-slate-800">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Approved Industrial Applications
              </div>
              <div className="flex flex-wrap gap-1.5">
                {comm?.applications?.map((app, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded bg-slate-950 text-slate-300 text-xs border border-slate-800">
                    {app}
                  </span>
                ))}
              </div>
            </div>

            {/* SEO Metadata Box */}
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Globe className="w-4 h-4" /> SEO Meta Preview:
              </div>
              <div className="text-white font-semibold text-xs">{comm?.seo_meta_title}</div>
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

        {/* Right Column: Schema.org JSON-LD */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Schema.org JSON-LD
            </div>
            <button
              onClick={handleCopyJsonLd}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs flex items-center gap-1 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 overflow-x-auto max-h-[520px]">
            <pre className="text-[11px] text-slate-300 whitespace-pre-wrap leading-tight">
              {jsonLdString}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
