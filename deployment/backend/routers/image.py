import io
import base64
import pickle

from fastapi import APIRouter
from fastapi.responses import FileResponse

from typing import List, Dict


router = APIRouter()


@router.get("/images")
async def images():
    pages = pickle.load(open("pages/pages.pkl", "rb"))

    image_list = []
    for page in pages:
        img_bytes = io.BytesIO()
        page["image"].save(img_bytes, format="PNG")
        img_bytes.seek(0)

        # Convert image to base64
        img_base64 = base64.b64encode(img_bytes.getvalue()).decode("utf-8")
        image_list.append(img_base64)

    # Return list of base64-encoded images in JSON
    return {"images": image_list}
    