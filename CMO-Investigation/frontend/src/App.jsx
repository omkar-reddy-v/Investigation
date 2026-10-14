import React, { useState } from 'react';
import { Alert, Box, CircularProgress } from '@mui/material';
import ReportUpload from './components/ReportUpload.jsx';
import InvestigationForm, { EMPTY_FIELDS } from './components/InvestigationForm.jsx';
import { extractReport } from './reportApi.js';

export default function App() {
  const [file, setFile] = useState(null);
  const [values, setValues] = useState({ ...EMPTY_FIELDS });
  const [language, setLanguage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Changing the PDF clears any data extracted from the previous report.
  function changeFile(nextFile) {
    setFile(nextFile);
    setValues({ ...EMPTY_FIELDS });
    setLanguage('');
    setError('');
  }

  // Sends the selected PDF to FastAPI and fills the editable form from JSON.
  async function handleExtract() {
    if (!file || loading) return;
    setLoading(true);
    setError('');
    try {
      const result = await extractReport(file);
      setValues(Object.fromEntries(Object.keys(EMPTY_FIELDS).map(key => [key, result[key] ?? ''])));
      setLanguage(result.detected_language || '');
    } catch (err) {
      setValues({ ...EMPTY_FIELDS });
      setLanguage('');
      setError(err.message || 'Report extraction failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box className="page">
      <ReportUpload file={file} onFileChange={changeFile} onExtract={handleExtract} loading={loading} />
      {error && <Alert severity="error" sx={{ mb: 1.5 }}>{error}</Alert>}
      <InvestigationForm values={values} language={language}
        onChange={(key, value) => setValues(prev => ({ ...prev, [key]: value }))} />
    </Box>
  );
}
