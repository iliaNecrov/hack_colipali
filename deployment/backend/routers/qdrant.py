import io
import base64
import pickle

from fastapi import APIRouter
from fastapi import UploadFile
from fastapi.responses import FileResponse

from typing import List, Dict

from common.parser import pdf_bytes_to_pages
from common.search_engine import SearchEngine
from pydantic import BaseModel

router = APIRouter()


PATH_TO_PAGES = "pages/pages.pkl"

search_engine = None


@router.post("/upload")
async def upload_document(files: List[UploadFile]):
    global search_engine

    # get pages from uploaded files
    pages: List[Dict] = []

    for file in files:
        pdf_bytes = await file.read()

        pages.extend(pdf_bytes_to_pages(pdf_bytes, file.filename))

    # save images to volume with pickle
    # pickle.dump(obj=pages, file=open(PATH_TO_PAGES, "wb"))

    # compute embeddings from pages
    search_engine = SearchEngine(pages, "documents")

    # upload embeddings and payloads to Qdrant
    # ...

    return "OK!"

class SearchRequest(BaseModel):
    query: str

@router.post("/search")
async def search(query: SearchRequest):
    global search_engine

    pages = search_engine.query(query.query)

    outputs = []
    for page in pages:
        img_bytes = io.BytesIO()
        page["image"].save(img_bytes, format="PNG")
        img_bytes.seek(0)

        # Convert image to base64
        img_base64 = base64.b64encode(img_bytes.getvalue()).decode("utf-8")
        img_page = page["page"]
        img_name = page["name"]
        img_text = page["text"]
        
        outputs.append({
            "page": img_page,
            "text": img_text,
            "name": img_name,
            "img": img_base64, 
        })

    return {"images": outputs}


@router.post("/generate")
async def generate(query: SearchRequest) -> str:
    global search_engine

    return search_engine.get_answer(query.query)


