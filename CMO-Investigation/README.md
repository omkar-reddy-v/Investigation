# CMO Investigation Report Extraction POC

Standalone FastAPI backend and React (JavaScript/JSX + Material UI) frontend. Does not change or depend on the MDCP application.

## Prerequisites

- Python 3.11.1
- Node.js 18.15.0 (or a compatible Node 18 release)
- Access to the company IAS gateway and valid IAS credentials

## 1. Backend (PowerShell)

Open a terminal in `CMO-Investigation/backend`:

```powershell
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
```

Edit `backend/.env` and set the IAS endpoint and credentials. Set `IAS_OPENAI_CHAT_URL` to the full working MDCP IAS chat-completions URL. Set `PINGFEDERATE_URL_BEARER_TOKEN_GENERATION`, `CLIENT_ID`, and `CLIENT_SECRET` using your approved company configuration. No IAS API key is needed. Never commit `.env`.

Start the API:

```powershell
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

Open `http://localhost:8000/docs` for interactive API documentation.

## 2. Frontend (separate terminal)

Open a terminal in `CMO-Investigation/frontend`:

```powershell
npm install
npm run dev
```

Open `http://localhost:5173`. Select a PDF, click **Extract**, and review/edit the 11 fields. The frontend calls `http://localhost:8000/api/v1/reports/extract` by default. For another API address, create `frontend/.env` with `VITE_API_BASE_URL=http://localhost:8000`.

## API test without frontend

From the backend folder:

```powershell
curl.exe -X POST http://localhost:8000/api/v1/reports/extract -F "file=@investigation-report.pdf;type=application/pdf"
```

The JSON response contains `detected_language` and 11 fields. Unknown values are empty strings. Supported inputs: selectable-text PDFs, maximum 50 MiB and 250,000 extracted characters. Scanned/image-only PDFs require OCR and are not supported in this POC. Oversized reports are rejected instead of truncated or chunked.

## File purposes

- `backend/main.py`: FastAPI endpoint and CORS.
- `backend/pdf_service.py`: PDF validation and page-wise text extraction.
- `backend/ai_service.py`: IAS authentication, extraction prompt, schema validation.
- `backend/.env.example`: environment variable names and non-secret defaults.
- `backend/requirements.txt`: Python dependencies.
- `frontend/src/App.jsx`: upload and form state management.
- `frontend/src/components/ReportUpload.jsx`: upload/extract controls.
- `frontend/src/components/InvestigationForm.jsx`: 11 editable fields.
- `frontend/src/reportApi.js`: API request and error handling.
- `frontend/src/styles.css`: responsive layout.

## Current limitations

IAS calls require your company's valid endpoint, credentials, network access, and support for the requested `json_schema` response format. Confirm that the token request format matches the existing MDCP token helper. Live IAS extraction cannot be verified without that access. The **Submit to Veeva** button is intentionally disabled until an approved Veeva endpoint is available; it does not fake submission. No database, AWS, MCP, RAG, or chunking is included.
