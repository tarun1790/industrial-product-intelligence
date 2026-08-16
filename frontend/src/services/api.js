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
