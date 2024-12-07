import pickle

from fastapi import APIRouter
from fastapi import UploadFile
from fastapi.responses import FileResponse

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

    # save images to volume with pickle
    pickle.dump(obj=pages, file=open("pages/pages.pkl", "wb"))

    # compute embeddings from pages
    # ...

    # upload embeddings and payloads to Qdrant
    # ...

    return "OK!"


@router.post("/search")
async def search(query: str) -> str:
    pass
