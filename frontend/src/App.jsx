import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import IngestionStudio from './components/IngestionStudio';
import SourceDiscoveryView from './components/SourceDiscoveryView';
import ProductOntologyView from './components/ProductOntologyView';
import AttributeTruthTable from './components/AttributeTruthTable';
import ProvenanceInspector from './components/ProvenanceInspector';
import ConflictResolver from './components/ConflictResolver';
import ValidationReport from './components/ValidationReport';
import WhyNotEngine from './components/WhyNotEngine';
import BenchmarkReport from './components/BenchmarkReport';
import TemporalTimeline from './components/TemporalTimeline';
import InterchangeEngine from './components/InterchangeEngine';
import CatalogHealthDashboard from './components/CatalogHealthDashboard';
import EngineeringCurves from './components/EngineeringCurves';
import ComplianceMatrix from './components/ComplianceMatrix';
import KnowledgeGraphView from './components/KnowledgeGraphView';
import CommerceExporter from './components/CommerceExporter';
import ParametricSearch from './components/ParametricSearch';
import { fetchProducts } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('ingest');
  const [catalog, setCatalog] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeIndustry, setActiveIndustry] = useState('All Industries');
  const [industriesList, setIndustriesList] = useState([
    'All Industries',
    'Power Transmission & Heavy Machinery',
    'Precision Motion & Tribology',
    'Fluid Power & Process Hydraulics',
    'Electrical Power & Switchgear',
    'Industrial Automation & Pneumatics',
    'Process Instrumentation & Sensing'
  ]);
  const [industriesMeta, setIndustriesMeta] = useState({ total_catalog_size: 12 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCatalog();
  }, []);

  const loadCatalog = async () => {
    setLoading(true);
    try {
      const prods = await fetchProducts();
      setCatalog(prods);
      if (prods.length > 0) {
        setSelectedProduct(prods[0]); // Default to first (ABB M3BP)
      }
      setIndustriesMeta({ total_catalog_size: prods.length });
    } catch (err) {
      console.error('Failed to load initial catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProduct = (prod) => {
    setSelectedProduct(prod);
    setActiveTab('ingest');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-mono selection:bg-amber-500/20 selection:text-amber-200">
      {/* Top Header & Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedProduct={selectedProduct}
        activeIndustry={activeIndustry}
        setActiveIndustry={setActiveIndustry}
        industriesMeta={industriesMeta}
      />

      {/* Main View Area - Full Fluid Width Edge-to-Edge */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-6">
        {/* PILLAR 1: IDENTIFY */}
        {activeTab === 'ingest' && (
          <IngestionStudio
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            catalog={catalog}
            onNavigateTab={setActiveTab}
            activeIndustry={activeIndustry}
            setActiveIndustry={setActiveIndustry}
            industriesList={industriesList}
          />
        )}

        {activeTab === 'sources' && (
          <SourceDiscoveryView product={selectedProduct} />
        )}

        {/* PILLAR 2: ENRICH */}
        {activeTab === 'ontology' && (
          <ProductOntologyView product={selectedProduct} />
        )}

        {activeTab === 'truth_table' && (
          <AttributeTruthTable product={selectedProduct} />
        )}

        {/* PILLAR 3: VALIDATE */}
        {activeTab === 'validation' && (
          <ValidationReport product={selectedProduct} />
        )}

        {activeTab === 'why_not' && (
          <WhyNotEngine product={selectedProduct} />
        )}

        {activeTab === 'benchmarks' && (
          <BenchmarkReport />
        )}

        {/* PILLAR 4: PROVE */}
        {activeTab === 'provenance' && (
          <ProvenanceInspector product={selectedProduct} onNavigateTab={setActiveTab} />
        )}

        {activeTab === 'conflicts' && (
          <ConflictResolver product={selectedProduct} />
        )}

        {activeTab === 'history' && (
          <TemporalTimeline product={selectedProduct} />
        )}

        {activeTab === 'catalog_health' && (
          <CatalogHealthDashboard />
        )}

        {/* Core Extension Tools */}
        {activeTab === 'interchange' && (
          <InterchangeEngine product={selectedProduct} onSelectProduct={handleSelectProduct} />
        )}

        {activeTab === 'curves' && (
          <EngineeringCurves product={selectedProduct} />
        )}

        {activeTab === 'compliance' && (
          <ComplianceMatrix product={selectedProduct} />
        )}

        {activeTab === 'graph' && (
          <KnowledgeGraphView onSelectProduct={handleSelectProduct} />
        )}

        {activeTab === 'commerce' && (
          <CommerceExporter product={selectedProduct} />
        )}

        {activeTab === 'search' && (
          <ParametricSearch
            catalog={catalog}
            onSelectProduct={handleSelectProduct}
            onCompare={() => {}}
          />
        )}
      </main>

      {/* Industrial Telemetry Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-3 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 font-mono">
        <div>
          ProductIQ Industrial Product Intelligence Engine • Identify → Enrich → Validate → Prove
        </div>
        <div className="flex items-center gap-4 mt-2 sm:mt-0">
          <span>IEC 60034 / ISO 15 / ISO 5199 Compliant</span>
          <span>•</span>
          <span className="text-emerald-500">System Ready for Production</span>
        </div>
      </footer>
    </div>
  );
}
