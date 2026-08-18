const API_BASE = 'http://localhost:8080/api/v1';

export async function fetchProducts(category, manufacturer, industry) {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (manufacturer && manufacturer !== 'All') params.append('manufacturer', manufacturer);
    if (industry && industry !== 'All Industries') params.append('industry', industry);
    const res = await fetch(`${API_BASE}/products?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return await res.json();
  } catch (err) {
    console.error('API Error:', err);
    return [];
  }
}

export async function ingestPartNumber(partNumber) {
  const res = await fetch(`${API_BASE}/ingest/part-number`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input_type: 'part_number', content: partNumber })
  });
  if (!res.ok) throw new Error('Ingestion failed');
  return await res.json();
}

export async function ingestText(text) {
  const res = await fetch(`${API_BASE}/ingest/text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input_type: 'raw_text', content: text })
  });
  if (!res.ok) throw new Error('Text ingestion failed');
  return await res.json();
}

export async function uploadDatasheetDocument(filename, contentText) {
  const res = await fetch(`${API_BASE}/ingest/upload-datasheet`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename, content_text: contentText })
  });
  if (!res.ok) throw new Error('Document upload failed');
  return await res.json();
}

export async function fetchKnowledgeGraph() {
  try {
    const res = await fetch(`${API_BASE}/graph`);
    if (!res.ok) throw new Error('Failed to fetch graph');
    return await res.json();
  } catch (err) {
    console.error('Graph API Error:', err);
    return { nodes: [], edges: [] };
  }
}

export async function searchParametric(query, filters = {}) {
  const res = await fetch(`${API_BASE}/search/parametric`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, ...filters })
  });
  if (!res.ok) throw new Error('Search failed');
  return await res.json();
}

export async function fetchInterchange(partNumber) {
  try {
    const res = await fetch(`${API_BASE}/advanced/interchange/${encodeURIComponent(partNumber)}`);
    if (!res.ok) throw new Error('Interchange failed');
    return await res.json();
  } catch (err) {
    console.error('Interchange API Error:', err);
    return { matches: [] };
  }
}

export async function evaluateWhyNot(payload) {
  const res = await fetch(`${API_BASE}/advanced/why-not`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('WhyNot API failed');
  return await res.json();
}

export async function fetchCatalogHealth() {
  try {
    const res = await fetch(`${API_BASE}/advanced/catalog-health`);
    if (!res.ok) throw new Error('Catalog health failed');
    return await res.json();
  } catch (err) {
    console.error('Catalog health error:', err);
    return null;
  }
}

export async function fetchHitlQueue() {
  try {
    const res = await fetch(`${API_BASE}/advanced/hitl/queue`);
    if (!res.ok) throw new Error('HITL queue failed');
    return await res.json();
  } catch (err) {
    console.error('HITL error:', err);
    return [];
  }
}

export async function updateHitlItem(payload) {
  const res = await fetch(`${API_BASE}/advanced/hitl/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('HITL update failed');
  return await res.json();
}

export async function fetchProductHistory(partNumber) {
  try {
    const res = await fetch(`${API_BASE}/advanced/history/${encodeURIComponent(partNumber)}`);
    if (!res.ok) throw new Error('History API failed');
    return await res.json();
  } catch (err) {
    console.error('History API error:', err);
    return [];
  }
}

export async function fetchBenchmarkReport() {
  try {
    const res = await fetch(`${API_BASE}/advanced/benchmark-report`);
    if (!res.ok) throw new Error('Benchmark report failed');
    return await res.json();
  } catch (err) {
    console.error('Benchmark report error:', err);
    return null;
  }
}

export async function fetchDiscoveredSources(partNumber) {
  try {
    const res = await fetch(`${API_BASE}/advanced/sources/${encodeURIComponent(partNumber)}`);
    if (!res.ok) throw new Error('Sources discovery failed');
    return await res.json();
  } catch (err) {
    console.error('Sources API error:', err);
    return null;
  }
}

export async function fetchCategoryOntology(categoryName) {
  try {
    const res = await fetch(`${API_BASE}/advanced/ontology/${encodeURIComponent(categoryName)}`);
    if (!res.ok) throw new Error('Ontology failed');
    return await res.json();
  } catch (err) {
    console.error('Ontology API error:', err);
    return null;
  }
}

export async function fetchNeuroSymbolicProof(productType) {
  try {
    const res = await fetch(`${API_BASE}/advanced/neuro-symbolic?product_type=${encodeURIComponent(productType || '3-Phase Induction Motor')}`);
    if (!res.ok) throw new Error('Neuro-symbolic failed');
    return await res.json();
  } catch (err) {
    console.error('Neuro-symbolic error:', err);
    return null;
  }
}

export async function fetchDigitalProductPassport(partNumber, manufacturer) {
  try {
    const res = await fetch(`${API_BASE}/advanced/dpp?part_number=${encodeURIComponent(partNumber || 'M3BP 160MLA 4')}&manufacturer=${encodeURIComponent(manufacturer || 'ABB')}`);
    if (!res.ok) throw new Error('DPP failed');
    return await res.json();
  } catch (err) {
    console.error('DPP error:', err);
    return null;
  }
}

export async function calculateWeibullReliability(payload) {
  const res = await fetch(`${API_BASE}/advanced/weibull`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Weibull API failed');
  return await res.json();
}

export async function fetchMultiAgentConsensus(partNumber, manufacturer) {
  try {
    const res = await fetch(`${API_BASE}/advanced/multi-agent?part_number=${encodeURIComponent(partNumber || 'M3BP 160MLA 4')}&manufacturer=${encodeURIComponent(manufacturer || 'ABB')}`);
    if (!res.ok) throw new Error('Multi-agent failed');
    return await res.json();
  } catch (err) {
    console.error('Multi-agent error:', err);
    return null;
  }
}

export async function fetchIndustryProfiles() {
  try {
    const res = await fetch(`${API_BASE}/advanced/industries`);
    if (!res.ok) throw new Error('Failed to fetch industries');
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function synthesizeIndustrySchema(payload) {
  const res = await fetch(`${API_BASE}/advanced/industries/synthesize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Synthesis failed');
  return await res.json();
}

export async function simulateSystemAssembly(payload) {
  const res = await fetch(`${API_BASE}/advanced/system-assembly`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Assembly simulation failed');
  return await res.json();
}

export async function generateAutonomousRfq(prompt) {
  const res = await fetch(`${API_BASE}/advanced/rfq/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  if (!res.ok) throw new Error('RFQ generation failed');
  return await res.json();
}

export async function fetchVisionOcrData(partNumber) {
  try {
    const res = await fetch(`${API_BASE}/advanced/vision/inspect?part_number=${encodeURIComponent(partNumber || 'M3BP 160MLA 4')}`);
    if (!res.ok) throw new Error('Vision OCR failed');
    return await res.json();
  } catch (err) {
    console.error('Vision OCR API error:', err);
    return null;
  }
}

export async function dispatchEnterpriseWebhook(payload) {
  const res = await fetch(`${API_BASE}/advanced/integrations/dispatch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Webhook dispatch failed');
  return await res.json();
}

export async function fetchIoTTelemetry(partNumber, ambientTemp, loadFactor) {
  const res = await fetch(`${API_BASE}/advanced/iot/telemetry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      part_number: partNumber || 'M3BP 160MLA 4',
      ambient_temp_c: ambientTemp || 40.0,
      load_factor_percent: loadFactor || 85.0
    })
  });
  if (!res.ok) throw new Error('IoT telemetry failed');
  return await res.json();
}

export async function fetchCADDimensions(partNumber) {
  try {
    const res = await fetch(`${API_BASE}/advanced/cad/dimensions?part_number=${encodeURIComponent(partNumber || 'M3BP 160MLA 4')}`);
    if (!res.ok) throw new Error('CAD API failed');
    return await res.json();
  } catch (err) {
    console.error('CAD error:', err);
    return null;
  }
}

export async function fetchGraphReasoning(partNumber) {
  try {
    const res = await fetch(`${API_BASE}/advanced/graph/reasoning?part_number=${encodeURIComponent(partNumber || 'M3BP 160MLA 4')}`);
    if (!res.ok) throw new Error('Graph reasoning failed');
    return await res.json();
  } catch (err) {
    console.error('Graph reasoning error:', err);
    return null;
  }
}

export async function fetchComplianceAudit(partNumber, manufacturer) {
  try {
    const res = await fetch(`${API_BASE}/advanced/compliance/audit?part_number=${encodeURIComponent(partNumber || 'M3BP 160MLA 4')}&manufacturer=${encodeURIComponent(manufacturer || 'ABB')}`);
    if (!res.ok) throw new Error('Audit failed');
    return await res.json();
  } catch (err) {
    console.error('Audit error:', err);
    return null;
  }
}

export async function fetchBayesianFusion(partNumber) {
  try {
    const res = await fetch(`${API_BASE}/advanced/bayesian/fusion?part_number=${encodeURIComponent(partNumber || 'M3BP 160MLA 4')}`);
    if (!res.ok) throw new Error('Bayesian fusion failed');
    return await res.json();
  } catch (err) {
    console.error('Bayesian error:', err);
    return null;
  }
}

export async function fetchSelfHealingOntology() {
  try {
    const res = await fetch(`${API_BASE}/advanced/ontology/self-healing`);
    if (!res.ok) throw new Error('Self healing failed');
    return await res.json();
  } catch (err) {
    console.error('Self healing error:', err);
    return null;
  }
}

export async function simulateThermalFEM(partNumber, ambientTemp, loadFactor) {
  const res = await fetch(`${API_BASE}/advanced/physics/thermal-fem`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      part_number: partNumber || 'M3BP 160MLA 4',
      ambient_temp_c: ambientTemp || 40.0,
      load_factor_pct: loadFactor || 85.0
    })
  });
  if (!res.ok) throw new Error('Thermal FEM failed');
  return await res.json();
}

export async function evaluateChemicalCorrosion(partNumber, baseMaterial, elastomer) {
  const res = await fetch(`${API_BASE}/advanced/chemical/corrosion`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      part_number: partNumber || 'LKH-10/140',
      base_material: baseMaterial || 'AISI 316L Electropolished',
      elastomer: elastomer || 'EPDM FDA'
    })
  });
  if (!res.ok) throw new Error('Chemical corrosion API failed');
  return await res.json();
}

export async function calculateTCOCarbonROI(payload) {
  const res = await fetch(`${API_BASE}/advanced/finance/tco-carbon`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('TCO Carbon API failed');
  return await res.json();
}

export async function fetchPLCCode(partNumber, targetBrand) {
  try {
    const res = await fetch(`${API_BASE}/advanced/automation/plc-code?part_number=${encodeURIComponent(partNumber || 'M3BP 160MLA 4')}&target_brand=${encodeURIComponent(targetBrand || 'Siemens S7-1500')}`);
    if (!res.ok) throw new Error('PLC API failed');
    return await res.json();
  } catch (err) {
    console.error('PLC error:', err);
    return null;
  }
}

export async function fetchFFTVibration(partNumber, runningRpm, bearingModel) {
  try {
    const res = await fetch(`${API_BASE}/advanced/diagnostics/fft-vibration?part_number=${encodeURIComponent(partNumber || 'M3BP 160MLA 4')}&running_rpm=${runningRpm || 1465.0}&bearing_model=${encodeURIComponent(bearingModel || 'SKF 6309 C3')}`);
    if (!res.ok) throw new Error('FFT API failed');
    return await res.json();
  } catch (err) {
    console.error('FFT error:', err);
    return null;
  }
}

export async function runProcurementWarRoom(payload) {
  const res = await fetch(`${API_BASE}/advanced/procurement/war-room`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('War room API failed');
  return await res.json();
}

export async function fetchCircularDismantle(partNumber) {
  try {
    const res = await fetch(`${API_BASE}/advanced/sustainability/dismantle-tree?part_number=${encodeURIComponent(partNumber || 'M3BP 160MLA 4')}`);
    if (!res.ok) throw new Error('Dismantle tree failed');
    return await res.json();
  } catch (err) {
    console.error('Dismantle tree error:', err);
    return null;
  }
}

export async function fetchMotorCurves(payload) {
  const res = await fetch(`${API_BASE}/advanced/curves/motor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Curves API failed');
  return await res.json();
}

export async function calculateBearingLife(payload) {
  const res = await fetch(`${API_BASE}/advanced/curves/bearing-life`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Bearing life API failed');
  return await res.json();
}

export async function fetchPumpQh(payload) {
  const res = await fetch(`${API_BASE}/advanced/curves/pump-qh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Pump QH API failed');
  return await res.json();
}

export async function validateCompliance(payload) {
  const res = await fetch(`${API_BASE}/advanced/compliance/check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Compliance API failed');
  return await res.json();
}
