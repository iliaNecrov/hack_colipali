from fastapi import APIRouter
from fastapi import UploadFile

from typing import List, Dict

from common.parser import pdf_bytes_to_pages


router = APIRouter()


@router.post("/upload")
async def upload_document(files: List[UploadFile]):
    # get pages from uploaded files
    pages: List[Dict] = []

    for file in files:
        pdf_bytes = await file.read()

        pages.extend(pdf_bytes_to_pages(pdf_bytes, file.filename))

    # compute embeddings from pages
    # ...

    # upload embeddings and payloads to Qdrant
    # ...

    print(pages)

    return "OK!"