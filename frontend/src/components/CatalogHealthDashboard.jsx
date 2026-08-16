import React, { useState, useEffect } from 'react';
import { BarChart3, AlertCircle, CheckCircle2, UserCheck, ShieldAlert, FileText, ArrowRight, RefreshCw } from 'lucide-react';
import { fetchCatalogHealth, fetchHitlQueue, updateHitlItem } from '../services/api';

export default function CatalogHealthDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [hitlQueue, setHitlQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [m, q] = await Promise.all([fetchCatalogHealth(), fetchHitlQueue()]);
      setMetrics(m);
      setHitlQueue(q);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (itemId, action, reason) => {
    setActionLoading(itemId);
    try {
      await updateHitlItem({ item_id: itemId, action, reason });
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
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
                Enterprise Catalog Operations
              </span>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Catalog Quality Audit & Human-in-the-Loop (HITL) Queue
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Automated ingestion health triage: {metrics?.auto_approved_percentage || 78.8}% auto-approved without human intervention; remaining flagged for lead engineer review.
            </p>
          </div>

          <div className="px-3.5 py-2 rounded-lg bg-blue-50 border border-blue-200 text-xs text-right">
            <span className="text-slate-500 block text-[10px]">Total Catalog Size</span>
            <span className="font-bold text-blue-700">
              {metrics?.total_skus_tracked?.toLocaleString() || '12,482'} SKUs
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
            <span className="text-slate-500 text-[10px] block uppercase">Auto-Approved Rate</span>
            <span className="text-2xl font-bold text-blue-700 block font-mono">
              {metrics.auto_approved_percentage}%
            </span>
            <span className="text-[10px] text-slate-500">Zero Touch Straight-Through</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
            <span className="text-slate-500 text-[10px] block uppercase">Average Completeness</span>
            <span className="text-2xl font-bold text-blue-600 block font-mono">
              {metrics.average_schema_completeness}%
            </span>
            <span className="text-[10px] text-slate-500">Standardized Attributes</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
            <span className="text-slate-500 text-[10px] block uppercase">Active HITL Queue</span>
            <span className="text-2xl font-bold text-slate-900 block font-mono">
              {metrics.pending_hitl_reviews_count}
            </span>
            <span className="text-[10px] text-slate-500">Requires Lead Approval</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
            <span className="text-slate-500 text-[10px] block uppercase">Resolved Conflicts</span>
            <span className="text-2xl font-bold text-blue-700 block font-mono">
              {metrics.total_conflicts_reconciled}
            </span>
            <span className="text-[10px] text-blue-700 font-medium">100% Auditable History</span>
          </div>
        </div>
      )}

      {/* HITL Triage Queue Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Human-in-the-Loop Exception Triage Queue ({hitlQueue.length} Pending Actions)
            </h3>
            <span className="text-xs text-slate-500">Automated triage for edge-case discrepancies</span>
          </div>
          <button
            onClick={loadData}
            className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer text-slate-700"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Queue</span>
          </button>
        </div>

        <div className="space-y-3">
          {hitlQueue.map((item) => (
            <div key={item.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-blue-700 border border-slate-300 font-mono">
                    {item.id}
                  </span>
                  <span className="font-bold text-slate-900">{item.product_part_number}</span>
                  <span className="text-slate-500">({item.product_manufacturer})</span>
                </div>

                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                  item.priority === 'CRITICAL' ? 'bg-slate-200 text-slate-900 border border-slate-300' : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                  {item.priority} PRIORITY
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 rounded-lg bg-white border border-slate-200">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Flagged Parameter & Conflict:</span>
                  <div className="font-bold text-slate-900 mt-0.5 uppercase">{item.attribute_name}</div>
                  <div className="text-slate-600 text-[11px] mt-1">{item.issue_description}</div>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">AI Recommended Value:</span>
                  <div className="font-bold text-blue-700 font-mono mt-0.5">{item.ai_proposed_value}</div>
                  <div className="text-slate-500 text-[10px] mt-1">Source: {item.source_candidates?.join(' vs ')}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-1">
                <button
                  disabled={actionLoading === item.id}
                  onClick={() => handleAction(item.id, 'REJECT', 'Rejected by Lead Engineer')}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold cursor-pointer transition-all"
                >
                  Reject & Re-Extract
                </button>
                <button
                  disabled={actionLoading === item.id}
                  onClick={() => handleAction(item.id, 'APPROVE', 'Approved by Lead Engineer')}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer transition-all shadow-xs"
                >
                  Approve AI Recommendation
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
