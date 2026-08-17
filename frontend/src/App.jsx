import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import IngestionStudio from './components/IngestionStudio';
import SourceDiscoveryView from './components/SourceDiscoveryView';
import ProductOntologyView from './components/ProductOntologyView';
import AttributeTruthTable from './components/AttributeTruthTable';
import ProvenanceInspector from './components/ProvenanceInspector';
import ConflictResolver from './components/ConflictResolver';
import ValidationReport from './components/ValidationReport';
import NeuroSymbolicView from './components/NeuroSymbolicView';
import DigitalProductPassportView from './components/DigitalProductPassportView';
import WeibullReliabilityView from './components/WeibullReliabilityView';
import MultiAgentConsensusView from './components/MultiAgentConsensusView';
import IndustryAdaptationView from './components/IndustryAdaptationView';
import SystemAssemblySimulator from './components/SystemAssemblySimulator';
import AutonomousRfqView from './components/AutonomousRfqView';
import VisionOcrStudio from './components/VisionOcrStudio';
import EnterpriseConnectorView from './components/EnterpriseConnectorView';
import IoTTelemetryTwinView from './components/IoTTelemetryTwinView';
import CADDimensionView from './components/CADDimensionView';
import GraphReasoningView from './components/GraphReasoningView';
import RegulatoryAuditorView from './components/RegulatoryAuditorView';
import BayesianUncertaintyView from './components/BayesianUncertaintyView';
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
    'Process Instrumentation & Sensing',
    'Sanitary Food & Bio-Pharma',
    'Oil & Gas / Petrochemical',
    'Aerospace & Defense Actuation',
    'Cryogenic LNG & Clean Energy'
  ]);
  const [industriesMeta, setIndustriesMeta] = useState({ total_catalog_size: 16 });
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
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

        {activeTab === 'vision_ocr' && (
          <VisionOcrStudio selectedProduct={selectedProduct} />
        )}

        {/* PILLAR 2: ENRICH */}
        {activeTab === 'ontology' && (
          <ProductOntologyView product={selectedProduct} />
        )}

        {activeTab === 'truth_table' && (
          <AttributeTruthTable product={selectedProduct} />
        )}

        {activeTab === 'cad' && (
          <CADDimensionView selectedProduct={selectedProduct} />
        )}

        {/* PILLAR 3: VALIDATE */}
        {activeTab === 'validation' && (
          <ValidationReport product={selectedProduct} />
        )}

        {activeTab === 'neuro_symbolic' && (
          <NeuroSymbolicView product={selectedProduct} />
        )}

        {activeTab === 'bayesian_fusion' && (
          <BayesianUncertaintyView selectedProduct={selectedProduct} />
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

        {activeTab === 'multi_agent' && (
          <MultiAgentConsensusView product={selectedProduct} />
        )}

        {activeTab === 'graph_reasoning' && (
          <GraphReasoningView selectedProduct={selectedProduct} />
        )}

        {activeTab === 'compliance_audit' && (
          <RegulatoryAuditorView selectedProduct={selectedProduct} />
        )}

        {activeTab === 'history' && (
          <TemporalTimeline product={selectedProduct} />
        )}

        {activeTab === 'catalog_health' && (
          <CatalogHealthDashboard />
        )}

        {/* Universal Cross-Industry Extensions */}
        {activeTab === 'industry_adapters' && (
          <IndustryAdaptationView />
        )}

        {activeTab === 'system_assembly' && (
          <SystemAssemblySimulator />
        )}

        {activeTab === 'rfq' && (
          <AutonomousRfqView />
        )}

        {activeTab === 'iot_twin' && (
          <IoTTelemetryTwinView selectedProduct={selectedProduct} />
        )}

        {activeTab === 'enterprise_sync' && (
          <EnterpriseConnectorView selectedProduct={selectedProduct} />
        )}

        {activeTab === 'dpp' && (
          <DigitalProductPassportView product={selectedProduct} />
        )}

        {activeTab === 'weibull' && (
          <WeibullReliabilityView product={selectedProduct} />
        )}

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

      {/* Formal Enterprise Telemetry Footer */}
      <footer className="border-t border-slate-200 bg-white py-3 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
        <div>
          ProductIQ Enterprise Industrial Product Intelligence Platform • 10 Sectors Connected
        </div>
        <div className="flex items-center gap-3 mt-2 sm:mt-0">
          <span>IEC 60034 • ISO 15552 • API 610 • 3-A Sanitary • AS9100D • ISO 28921 Cryo</span>
          <span>•</span>
          <span className="text-blue-700 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> TransE Graph AI & CAD Vectorizer Active
          </span>
        </div>
      </footer>
    </div>
  );
}
