import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import IngestionStudio from './components/IngestionStudio';
import EvidenceViewer from './components/EvidenceViewer';
import ConflictResolver from './components/ConflictResolver';
import ValidationReport from './components/ValidationReport';
import KnowledgeGraphView from './components/KnowledgeGraphView';
import CommerceExporter from './components/CommerceExporter';
import ParametricSearch from './components/ParametricSearch';
import { fetchProducts } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('ingest');
  const [catalog, setCatalog] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
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
        setSelectedProduct(prods[0]); // Default to first (ABB M3BP motor with resolved conflict)
      }
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedProduct={selectedProduct}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'ingest' && (
          <IngestionStudio
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            catalog={catalog}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'evidence' && (
          <EvidenceViewer product={selectedProduct} />
        )}

        {activeTab === 'conflicts' && (
          <ConflictResolver product={selectedProduct} />
        )}

        {activeTab === 'validation' && (
          <ValidationReport product={selectedProduct} />
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

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs font-mono text-slate-500">
        ProductIQ Industrial Intelligence Platform • Extract → Enrich → Validate → Prove
      </footer>
    </div>
  );
}
