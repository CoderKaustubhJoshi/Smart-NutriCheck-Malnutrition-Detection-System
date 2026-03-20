from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import tensorflow as tf
import numpy as np
from PIL import Image
import os
import uuid
import io
from reportlab.platypus import SimpleDocTemplate, Paragraph, Image as RLImage
from reportlab.lib.styles import getSampleStyleSheet
import httpx
from typing import Optional

app = FastAPI(title="Smart Nutricheck API")

# CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Absolute base directory (where this file lives) ─────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ─── Directories ──────────────────────────────────────────────────────────────
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Serve uploaded images as static files
app.mount("/uploads", StaticFiles(directory=UPLOAD_FOLDER), name="uploads")

# ─── Load ML Model ────────────────────────────────────────────────────────────
MODEL_PATH = os.path.join(BASE_DIR, "..", "model", "mobilenetv2_finetuned_model.keras")
MODEL_PATH = os.path.normpath(MODEL_PATH)
print(f"[Smart Nutricheck] Loading model from: {MODEL_PATH}")
model = tf.keras.models.load_model(MODEL_PATH)
print("[Smart Nutricheck] Model loaded successfully!")

# ─── Gemini AI Setup (REST via httpx – avoids gRPC ALTS issues on Windows) ───
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "AIzaSyB5KA0hzOBi5vcV-Y1lDs58YU-hqnEaf8A")
GEMINI_ENDPOINT = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    "gemini-1.5-flash:generateContent"
)
if GEMINI_API_KEY:
    print("[Smart Nutricheck] Gemini AI configured successfully (REST mode)!")
else:
    print("[Smart Nutricheck] WARNING: No Gemini API key. Chat feature disabled.")

# ─── Helper Functions ─────────────────────────────────────────────────────────
def preprocess_image(image_bytes: bytes) -> np.ndarray:
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize((224, 224))
    arr = np.array(img) / 255.0
    return np.expand_dims(arr, axis=0)

def calculate_bmi(weight: float, height_cm: float) -> float:
    height_m = height_cm / 100
    return round(weight / (height_m ** 2), 2)

def bmi_category(bmi: float) -> str:
    if bmi < 14:
        return "Malnourished"
    elif bmi < 18.5:
        return "At Risk"
    else:
        return "Healthy"

# ─── Pydantic Schemas ─────────────────────────────────────────────────────────
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

# ─── Routes ───────────────────────────────────────────────────────────────────

@app.get("/")
async def root():
    return {"message": "Smart Nutricheck API is running"}

@app.post("/api/analyze")
async def analyze(
    child_name: str = Form(...),
    age: str = Form(...),
    height: float = Form(...),
    weight: float = Form(...),
    child_image: UploadFile = File(...)
):
    # Validate height/weight
    if height <= 0 or weight <= 0:
        raise HTTPException(status_code=422, detail="Height and weight must be positive values.")

    # BMI calculation
    bmi = calculate_bmi(weight, height)
    bmi_result = bmi_category(bmi)

    # Save uploaded image
    file_ext = os.path.splitext(child_image.filename)[1] or ".jpg"
    filename = f"{uuid.uuid4()}{file_ext}"
    save_path = os.path.join(UPLOAD_FOLDER, filename)
    image_bytes = await child_image.read()
    with open(save_path, "wb") as f:
        f.write(image_bytes)

    # ML prediction
    img_input = preprocess_image(image_bytes)
    pred = model.predict(img_input)
    prob = float(pred[0][0])  # sigmoid output

    ml_result = "Malnourished" if prob > 0.5 else "Healthy"
    confidence = round(prob * 100, 2) if ml_result == "Malnourished" else round((1 - prob) * 100, 2)

    # ── Hybrid Decision Logic (6-combination table) ─────────────────────────
    # Model: Healthy | BMI: Healthy        → Healthy
    # Model: Healthy | BMI: At Risk        → Risk
    # Model: Healthy | BMI: Malnourished   → Risk
    # Model: Malnourished | BMI: Healthy   → Risk
    # Model: Malnourished | BMI: At Risk   → Malnourished
    # Model: Malnourished | BMI: Malnourished → Malnourished
    if ml_result == "Healthy" and bmi_result == "Healthy":
        final_status = "Healthy"
    elif ml_result == "Malnourished" and bmi_result in ["At Risk", "Malnourished"]:
        final_status = "Malnourished"
    else:
        # Covers: Healthy+AtRisk, Healthy+Malnourished, Malnourished+Healthy
        final_status = "Risk"

    return {
        "name": child_name,
        "age": age,
        "bmi": bmi,
        "bmi_category": bmi_result,        # Healthy | At Risk | Malnourished
        "ml_result": ml_result,            # Healthy | Malnourished
        "confidence": confidence,
        "final_status": final_status,      # Healthy | Risk | Malnourished
        "image_path": f"/uploads/{filename}",
    }


@app.get("/api/download-pdf")
async def download_pdf(
    name: str,
    age: str,
    bmi: float,
    confidence: float,
    final_status: str,
    image_filename: Optional[str] = None
):
    file_path = f"report_{uuid.uuid4()}.pdf"
    styles = getSampleStyleSheet()
    doc = SimpleDocTemplate(file_path)

    content = [
        Paragraph("<b>Smart Nutricheck — Malnutrition Assessment Report</b>", styles["Title"]),
        Paragraph("<br/>", styles["Normal"]),
    ]

    # Add image if available
    if image_filename:
        img_path = os.path.join(UPLOAD_FOLDER, image_filename)
        if os.path.exists(img_path):
            rl_img = RLImage(img_path, width=200, height=200)
            content.append(rl_img)
            content.append(Paragraph("<br/>", styles["Normal"]))

    content.extend([
        Paragraph(f"<b>Child Name:</b> {name}", styles["Normal"]),
        Paragraph(f"<b>Age:</b> {age} years", styles["Normal"]),
        Paragraph(f"<b>BMI:</b> {bmi}", styles["Normal"]),
        Paragraph(f"<b>Final Status:</b> {final_status}", styles["Normal"]),
        Paragraph(f"<b>AI Confidence:</b> {confidence}%", styles["Normal"]),
        Paragraph("<br/>", styles["Normal"]),
        Paragraph("<i>This is an AI-based prediction and not a medical diagnosis.</i>", styles["Normal"]),
        Paragraph("Please consult a qualified healthcare professional for confirmation.", styles["Normal"]),
    ])

    doc.build(content)
    return FileResponse(
        path=file_path,
        filename="SmartNutricheck_Report.pdf",
        media_type="application/pdf"
    )


@app.post("/api/chat", response_model=ChatResponse)
async def chat(body: ChatRequest):
    if not GEMINI_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="Gemini API key not configured. Set GEMINI_API_KEY environment variable."
        )

    system_prompt = (
        "Act as a professional medical expert and nutritionist specializing in child health and malnutrition. "
        "Answer the following question clearly, compassionately, and accurately based on current medical knowledge. "
        "Always recommend consulting a qualified healthcare professional for personal medical advice or diagnosis. "
        "Keep your answer concise (within 3-4 paragraphs max) and easy to understand.\n\n"
        f"User question: {body.message}"
    )

    payload = {
        "contents": [{"parts": [{"text": system_prompt}]}]
    }

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(
                GEMINI_ENDPOINT,
                params={"key": GEMINI_API_KEY},
                json=payload,
            )
            resp.raise_for_status()
            data = resp.json()
            reply = data["candidates"][0]["content"]["parts"][0]["text"]
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=502, detail=f"Gemini API error: {e.response.text}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")

    return ChatResponse(reply=reply)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
