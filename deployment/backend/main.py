from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from common.config import logger
from routers import qdrant

app = FastAPI(title="api")

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



