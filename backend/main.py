from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

# CORS setup for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all domains
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure uploads folder exists
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/upload-admin")
async def upload_admin(file: UploadFile = File(...)):
    """Stores the uploaded admin audio file (demo only)."""
    path = os.path.join(UPLOAD_DIR, "admin_audio.webm")
    content = await file.read()

    with open(path, "wb") as f:
        f.write(content)

    return {
        "message": "Admin audio saved successfully (demo only)",
        "filename": file.filename
    }


@app.post("/reset")
async def reset():
    """Deletes saved audio and resets state."""
    audio_path = os.path.join(UPLOAD_DIR, "admin_audio.webm")

    if os.path.exists(audio_path):
        os.remove(audio_path)

    return {"message": "System reset to default state!"}
