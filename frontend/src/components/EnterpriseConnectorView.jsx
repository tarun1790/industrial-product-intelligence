import React, { useState } from 'react';
import { Share2, Send, CheckCircle2, Server, Database, Lock, ArrowRight, RefreshCw, Key, Globe } from 'lucide-react';
import { dispatchEnterpriseWebhook } from '../services/api';

export default function EnterpriseConnectorView({ selectedProduct }) {
  const [targetSystem, setTargetSystem] = useState('SAP_S4HANA');
  const [endpointUrl, setEndpointUrl] = useState('https://api.s4hana.enterprise.com/sap/opu/odata4/sap/product_srv/v0001/A_Product');
  const [authToken, setAuthToken] = useState('Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
  const [dispatchResult, setDispatchResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const prodId = selectedProduct?.id || 'prod_abb_m3bp_160';

  const systemPresets = {
    SAP_S4HANA: {
      name: 'SAP S/4HANA Cloud (OData API v4)',
      defaultUrl: 'https://api.s4hana.enterprise.com/sap/opu/odata4/sap/product_srv/v0001/A_Product',
      desc: 'Synchronizes master material records, plant storage locations, and procurement classifications.'
    },
    AKENEO_PIM: {
      name: 'Akeneo Enterprise PIM (REST API v1)',
      defaultUrl: 'https://pim.enterprise.corp/api/rest/v1/products',
      desc: 'Pushes verified technical attributes, localized marketing text, and multi-media asset references.'
    },
    SHOPIFY_PLUS: {
      name: 'Shopify Plus B2B Storefront (GraphQL)',
      defaultUrl: 'https://industrial-direct.myshopify.com/admin/api/2024-04/graphql.json',
      desc: 'Publishes commerce-ready SEO titles, meta descriptions, and live Schema.org JSON-LD snippets.'
    },
    SIEMENS_TEAMCENTER: {
      name: 'Siemens Teamcenter PLM (Active Workspace)',
      defaultUrl: 'https://teamcenter.enterprise.corp/tc/rest/v1/ItemManagement',
      desc: 'Updates engineering revision baselines, CAD model parameters, and bill-of-materials attributes.'
    }
  };

  const handleSelectSystem = (sysKey) => {
    setTargetSystem(sysKey);
    setEndpointUrl(systemPresets[sysKey].defaultUrl);
    setDispatchResult(null);
  };

  const handleDispatch = async () => {
    setLoading(true);
    try {
      const res = await dispatchEnterpriseWebhook({
        integration_target: targetSystem,
        product_id: prodId,
        target_endpoint_url: endpointUrl,
        auth_token: authToken
      });
      setDispatchResult(res);
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
                Enterprise Integration Hub
              </span>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 tracking-tight">
                <Server className="w-5 h-5 text-blue-600" />
                1-Click ERP / PIM / PLM Webhook Dispatcher
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Direct live payload dispatch to enterprise systems (SAP S/4HANA, Akeneo PIM, Shopify Plus B2B, Siemens Teamcenter) with HMAC-SHA256 signature verification.
            </p>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-right shadow-2xs">
            <span className="text-slate-500 block text-[10px] font-medium">Selected Product</span>
            <span className="font-extrabold text-blue-600 font-mono">
              {selectedProduct?.part_number || 'M3BP 160MLA 4'}
            </span>
          </div>
        </div>

        {/* Integration Preset Selector */}
        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {Object.entries(systemPresets).map(([key, sys]) => {
            const isSelected = targetSystem === key;
            return (
              <button
                key={key}
                onClick={() => handleSelectSystem(key)}
                className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50 border-blue-300 ring-1 ring-blue-400/30'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs truncate">{key.replace('_', ' ')}</span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                </div>
                <div className="text-[10px] text-slate-500 mt-1 truncate">{sys.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dispatch Configuration & Execution Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left 6 Cols: Webhook Config Form */}
        <div className="xl:col-span-6 premium-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Webhook Endpoint Parameters
            </h3>
            <span className="text-[11px] text-blue-600 font-mono font-bold">HMAC SHA-256</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-700 font-bold block mb-1">Target API URL:</label>
              <input
                type="text"
                value={endpointUrl}
                onChange={(e) => setEndpointUrl(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-[11px] focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1">Bearer Auth Token / OAuth2 Header:</label>
              <input
                type="password"
                value={authToken}
                onChange={(e) => setAuthToken(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-[11px] focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
              <span className="font-bold text-slate-800 block text-[11px]">System Target:</span>
              <p>{systemPresets[targetSystem]?.desc}</p>
            </div>
          </div>

          <button
            onClick={handleDispatch}
            disabled={loading}
            className="btn-primary w-full py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>Dispatch Verified SKU to {targetSystem.replace('_', ' ')}</span>
          </button>
        </div>

        {/* Right 6 Cols: Live Execution Response Ledger */}
        <div className="xl:col-span-6 premium-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Live Sync Transaction Log
            </h3>
            {dispatchResult && (
              <span className="px-2 py-0.5 rounded text-[10px] bg-blue-100 text-blue-800 font-mono font-bold">
                HTTP {dispatchResult.http_status} OK
              </span>
            )}
          </div>

          {dispatchResult ? (
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-semibold">Transaction ID</span>
                  <span className="font-mono font-bold text-slate-900">{dispatchResult.transaction_id}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-semibold">Latency</span>
                  <span className="font-mono font-bold text-blue-600">{dispatchResult.response_latency_ms} ms</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px] space-y-1">
                <div className="text-slate-500 font-semibold">Digital Signature:</div>
                <div className="text-slate-800 truncate">{dispatchResult.payload_signature}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 text-slate-800 text-xs space-y-1 font-sans">
                <div className="flex items-center gap-1.5 text-blue-700 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Payload Accepted & Indexed</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {dispatchResult.system_log}
                </p>
                <div className="text-[10px] text-slate-400 font-mono pt-1">
                  Timestamp: {dispatchResult.timestamp}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-slate-400">
              Click "Dispatch Verified SKU" to test live enterprise webhook sync.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
