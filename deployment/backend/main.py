import uvicorn
from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware

from common.config import logger

app = FastAPI(title="api")

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

# if __name__ == "__main__":
#     port = 8000
#     workers = 1
#     host = "0.0.0.0"
#     logger.info(f"port: {port}, host: {host}, workers: {workers}")
#     uvicorn.run("main:app", host=host, port=port, workers=workers)
