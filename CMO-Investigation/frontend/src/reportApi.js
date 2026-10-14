const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');

export async function extractReport(file) {
  const formData = new FormData();
  formData.append('file', file);
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/api/v1/reports/extract`, { method: 'POST', body: formData });
  } catch (error) {
    throw new Error('Cannot connect to the backend. Check that FastAPI is running on port 8000.');
  }
  let result;
  try { result = await response.json(); }
  catch { throw new Error(`Backend returned an invalid response (HTTP ${response.status}).`); }
  if (!response.ok) {
    const detail = result?.detail;
    throw new Error(typeof detail === 'string' ? detail : `Extraction failed (HTTP ${response.status}).`);
  }
  return result;
}
