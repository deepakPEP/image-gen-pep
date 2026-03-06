import google.generativeai as genai
from dotenv import load_dotenv
import os
import base64

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash-image")

def ask_gemini(prompt, image_bytes=None):

    contents = [{"text": prompt}]

    if image_bytes:
        contents.append({
            "inline_data": {
                "mime_type": "image/png",
                "data": image_bytes
            }
        })

    response = model.generate_content(contents)

    text_parts = []
    image_parts = []

    if response.candidates:
        for part in response.candidates[0].content.parts:
            if hasattr(part, "text") and part.text:
                text_parts.append(part.text)
            elif hasattr(part, "inline_data") and part.inline_data:
                # Convert image bytes to base64 for frontend display
                image_data = part.inline_data.data
                mime_type = part.inline_data.mime_type or "image/png"
                base64_image = base64.b64encode(image_data).decode('utf-8')
                image_parts.append({
                    "data": base64_image,
                    "mime_type": mime_type
                })

    return {
        "text": "\n".join(text_parts) if text_parts else None,
        "images": image_parts if image_parts else None
    }