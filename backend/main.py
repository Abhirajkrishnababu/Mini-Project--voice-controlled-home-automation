from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# uploads folder
os.makedirs("uploads", exist_ok=True)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/upload-admin")
async def upload_admin(file: UploadFile = File(...)):
    path = "uploads/admin_audio.webm"
    with open(path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {"status": "saved", "path": path}


@app.post("/reset")
async def reset():
    path = "uploads/admin_audio.webm"
    if os.path.exists(path):
        os.remove(path)
    return {"status": "reset complete"}


@app.get("/")
def root():
    return {"message": "Backend running."}
