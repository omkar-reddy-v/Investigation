"""Validate PDFs and extract selectable text with page boundaries."""
from __future__ import annotations

import fitz
from fastapi import UploadFile

MAX_PDF_BYTES = 50 * 1024 * 1024
MAX_REPORT_CHARS = 250_000

class PDFInputError(ValueError): pass
class PDFTooLargeError(PDFInputError): pass

async def extract_pdf_text(upload: UploadFile) -> str:
    # Check the uploaded PDF and read selectable text page by page.
    if upload.filename and not upload.filename.lower().endswith('.pdf'):
        raise PDFInputError('Please upload a PDF file.')
    raw = await upload.read(MAX_PDF_BYTES + 1)
    if not raw:
        raise PDFInputError('The uploaded PDF is empty.')
    if len(raw) > MAX_PDF_BYTES:
        raise PDFTooLargeError('The PDF exceeds the 50 MiB upload limit.')
    if not raw.startswith(b'%PDF-'):
        raise PDFInputError('The uploaded file is not a valid PDF.')
    try:
        with fitz.open(stream=raw, filetype='pdf') as doc:
            if doc.needs_pass:
                raise PDFInputError('Password-protected PDFs are not supported.')
            if doc.page_count < 1:
                raise PDFInputError('The PDF contains no pages.')
            blocks, total, has_text = [], 0, False
            for number, page in enumerate(doc, start=1):
                content = (page.get_text('text') or '').strip()
                has_text |= bool(content)
                block = f'--- Page {number} ---\n{content}'
                total += len(block) + 2
                if total > MAX_REPORT_CHARS:
                    raise PDFTooLargeError('Extracted text exceeds 250,000 characters; this POC does not chunk reports.')
                blocks.append(block)
    except (PDFInputError, PDFTooLargeError):
        raise
    except Exception as exc:
        raise PDFInputError('The uploaded PDF could not be read.') from exc
    if not has_text:
        raise PDFInputError('The PDF contains no selectable text. OCR is not supported in this POC.')
    return '\n\n'.join(blocks)
