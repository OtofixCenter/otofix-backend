from PIL import Image
import random

def analyze_image(image_path: str, brand: str, model: str) -> dict:
    # Basit görsel açma testi
    try:
        img = Image.open(image_path)
        img.verify()  # bozuk dosyaları kontrol eder
    except Exception as e:
        return {"status": "hata", "error": str(e)}

    # Dummy analiz: rastgele öneri döner
    findings = [
        "Her şey normal görünüyor.",
        "Aşınma tespit edildi.",
        "Yağ sızıntısı belirtisi var.",
        "Paslanma görülüyor.",
        "Değişim önerilir."
    ]

    recommendation = random.choice(findings)
    return {
        "brand": brand,
        "model": model,
        "status": "analiz tamamlandı",
        "recommendation": recommendation
    }
