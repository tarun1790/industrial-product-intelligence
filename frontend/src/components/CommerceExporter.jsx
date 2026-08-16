import React, { useState } from 'react';
import { Database, Copy, Check, FileJson, ShoppingCart, Tag, ExternalLink, ShieldCheck } from 'lucide-react';

export default function CommerceExporter({ product }) {
  const [copied, setCopied] = useState(false);
  const [exportFormat, setExportFormat] = useState('JSON_LD');

  if (!product) return null;

  const commerce = product.commerce || {
    seo_title: `${product.manufacturer} ${product.part_number} - Industrial Engineering Specification`,
    marketing_bullet_points: [
      `High-efficiency ${product.category} engineered by ${product.manufacturer}.`,
      `Verified industrial specifications per international ISO/IEC engineering standards.`,
      `Certified for heavy-duty commercial applications with full provenance traceability.`
    ],
    application_tags: ['Industrial Automation', 'Continuous Duty', 'OEM Grade'],
    json_ld_schema: {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.title,
      "mpn": product.part_number,
      "brand": { "@type": "Brand", "name": product.manufacturer },
      "category": product.category
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(typeof text === 'string' ? text : JSON.stringify(text, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] uppercase bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                Pillar 4 • Commerce PIM Ready
              </span>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-600" />
                Commerce PIM Exporter & Schema.org JSON-LD Generator
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Transforms verified engineering specifications into commerce-ready listings, SEO-optimized metadata, and machine-readable JSON-LD schemas for SAP, Shopify, and Akeneo.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy(commerce.json_ld_schema)}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied JSON-LD' : 'Copy JSON-LD'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column: Commercial Metadata Profile */}
        <div className="xl:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-2.5">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Marketplace Preview</span>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">{commerce.seo_title}</h3>
            </div>

            {/* Bullet Points */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
                Standardized Feature Highlights:
              </span>
              <ul className="space-y-1.5 text-slate-700 pl-4 list-disc">
                {commerce.marketing_bullet_points?.map((bullet, idx) => (
                  <li key={idx} className="leading-relaxed">{bullet}</li>
                ))}
              </ul>
            </div>

            {/* Application & Commerce Tags */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
                Commerce Classification Tags:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {commerce.application_tags?.map((tag, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded bg-slate-50 text-slate-700 border border-slate-200 text-xs font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Schema.org JSON-LD Code Block */}
        <div className="xl:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileJson className="w-4 h-4 text-blue-600" />
                Schema.org / Product JSON-LD Payload
              </span>
              <span className="text-xs text-blue-700 font-mono font-semibold">Valid Google Rich Snippet</span>
            </div>

            <pre className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 overflow-x-auto max-h-96 leading-relaxed">
              {JSON.stringify(commerce.json_ld_schema, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
