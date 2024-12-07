import os
os.environ['TRANSFORMERS_CACHE'] = "transformers_cache"

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from common.config import logger
from routers import qdrant

app = FastAPI(title="api",  version="1.0.0")

app.include_router(qdrant.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return "OK!"



