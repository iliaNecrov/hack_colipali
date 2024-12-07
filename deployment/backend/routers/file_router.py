import os

from fastapi import APIRouter, UploadFile, File
from fastapi.responses import FileResponse

router = APIRouter()

@router.post("/file", response_class=FileResponse)
async def upload_file(file: UploadFile = File(...)) -> FileResponse:
    save_path = f"./uploaded_files/{file.filename}"

    os.makedirs(os.path.dirname(save_path), exist_ok=True)

    # Сохраните файл
    with open(save_path, "wb") as f:
        content = await file.read()
        f.write(content)

    return FileResponse(save_path)