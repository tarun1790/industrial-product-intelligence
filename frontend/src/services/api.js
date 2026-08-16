const API_BASE = 'http://localhost:8000/api/v1';

export async function fetchProducts(category, manufacturer) {
  try {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (manufacturer) params.append('manufacturer', manufacturer);
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

export async function compareProducts(productIds) {
  const res = await fetch(`${API_BASE}/products/compare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product_ids: productIds })
  });
  if (!res.ok) throw new Error('Compare failed');
  return await res.json();
}
