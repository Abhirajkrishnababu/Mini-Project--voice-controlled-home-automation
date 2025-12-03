from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import os
from pydub import AudioSegment

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory
if not os.path.exists("uploads"):
    os.makedirs("uploads")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/upload-admin")
async def upload_admin(file: UploadFile = File(...)):
    path = "uploads/admin_audio.webm"
    content = await file.read()

    with open(path, "wb") as f:
        f.write(content)

    # Convert to WAV (optional)
    audio = AudioSegment.from_file(path)
    audio.export("uploads/admin_audio.wav", format="wav")

    return {"message": "Admin voice recorded successfully (demo only)"}

@app.post("/reset")
async def reset():
    if os.path.exists("uploads/admin_audio.webm"):
        os.remove("uploads/admin_audio.webm")
    if os.path.exists("uploads/admin_audio.wav"):
        os.remove("uploads/admin_audio.wav")

    return {"message": "System reset to default!"}
