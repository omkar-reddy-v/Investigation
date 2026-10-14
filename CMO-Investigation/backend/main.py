"""Standalone CMO Investigation extraction API."""
from __future__ import annotations

import os
from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from ai_service import (IASConfigurationError, IASServiceError, IASTimeoutError,
                        ReportExtraction, extract_investigation)
from pdf_service import PDFInputError, PDFTooLargeError, extract_pdf_text

load_dotenv(Path(__file__).with_name('.env'))
app = FastAPI(title='CMO Investigation API', version='1.0.0')
origins = [item.strip() for item in os.getenv('FRONTEND_ORIGINS', 'http://localhost:5173,http://localhost:3000').split(',') if item.strip()]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=False,
                   allow_methods=['POST', 'OPTIONS'], allow_headers=['Content-Type'])

@app.post('/api/v1/reports/extract', response_model=ReportExtraction)
async def extract_report(file: UploadFile = File(...)) -> ReportExtraction:
    # Receive the PDF, extract its text, and return IAS-generated fields.
    try:
        report_text = await extract_pdf_text(file)
    except PDFTooLargeError as exc:
        raise HTTPException(status_code=413, detail=str(exc)) from exc
    except PDFInputError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    finally:
        await file.close()
    try:
        return await extract_investigation(report_text)
    except IASConfigurationError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except IASTimeoutError as exc:
        raise HTTPException(status_code=504, detail=str(exc)) from exc
    except IASServiceError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
