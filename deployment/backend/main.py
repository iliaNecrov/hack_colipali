from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware

from common.config import logger
from routers import file_router
from routers import qdrant

app = FastAPI(title="api")

app.include_router(file_router.router)

app.include_router(qdrant.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/test")
def root():
    logger.info("test")
    return {"test": "success"}

temp_data = ["Some Data"]
@app.post("/test-post")
def test(data: str = Body(...)):
    temp_data.append(data)
    return {"data": temp_data}


