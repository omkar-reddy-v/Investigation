import React, { useRef, useState } from 'react';
import { Button, CircularProgress } from '@mui/material';

export default function ReportUpload({ file, onFileChange, onExtract, loading }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  // Accept only PDFs and pass the selected file to the parent component.
  function acceptFile(nextFile) {
    if (!nextFile) return;
    if (nextFile.type !== 'application/pdf' && !nextFile.name.toLowerCase().endsWith('.pdf')) return;
    onFileChange(nextFile);
  }

  return (
    <section className="panel upload-panel">
      <h2>Upload Investigation Report</h2>
      <input ref={inputRef} type="file" accept=".pdf,application/pdf" hidden
        onChange={e => { acceptFile(e.target.files?.[0]); e.target.value = ''; }} />
      <div className={`dropzone ${dragging ? 'dragging' : ''}`} role="button" tabIndex={0}
        onClick={() => !loading && inputRef.current?.click()}
        onKeyDown={e => { if ((e.key === 'Enter' || e.key === ' ') && !loading) { e.preventDefault(); inputRef.current?.click(); } }}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); if (!loading) acceptFile(e.dataTransfer.files?.[0]); }}>
        <span className="pdf-symbol" aria-hidden="true">📄</span>
        <span>Click to upload Investigation Report (PDF)</span>
        <small>or drag and drop your file here</small>
      </div>
      {file && (
        <div className="selected-file">
          <span className="file-icon" aria-hidden="true">PDF</span>
          <span className="file-title">{file.name}</span>
          <button className="remove-file" aria-label="Remove PDF" title="Remove PDF" disabled={loading}
            onClick={() => onFileChange(null)}>×</button>
          <Button variant="contained" disabled={loading} onClick={onExtract} className="extract-button">
            {loading ? <><CircularProgress size={16} color="inherit" sx={{ mr: 1 }} />Extracting</> : 'Extract'}
          </Button>
        </div>
      )}
    </section>
  );
}
