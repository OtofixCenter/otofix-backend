from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from utils import analyze_image
import shutil
import os

app = FastAPI()

# CORS ayarları (frontend bağlantısı için)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze(
    brand: str = Form(...),
    model: str = Form(...),
    photo: UploadFile = File(...)
):
    # Görseli kaydet
    photo_location = f"temp_{photo.filename}"
    with open(photo_location, "wb") as buffer:
        shutil.copyfileobj(photo.file, buffer)

    # Görseli analiz et
    result = analyze_image(photo_location, brand, model)

    # Geçici görseli sil
    os.remove(photo_location)

    return result
