from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from common.config import logger
from routers import qdrant, image

app = FastAPI(title="api",  version="1.0.0")

app.include_router(qdrant.router)
app.include_router(image.router)

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



