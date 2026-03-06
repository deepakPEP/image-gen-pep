from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from chat_service import ask_gemini
from s3_chat_storage import load_history, save_history, list_chats as s3_list_chats

load_dotenv()

app = FastAPI()

# CORS: allow frontend origin from API_BASE_URL (e.g. http://localhost:8080)
FRONTEND_ORIGIN = os.getenv("API_BASE_URL", "http://localhost:8080").rstrip("/")
CORS_ORIGINS = [FRONTEND_ORIGIN, "http://localhost:8080", "http://localhost:5173"]
# Dedupe while preserving order
CORS_ORIGINS = list(dict.fromkeys(CORS_ORIGINS))

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/chats")
def list_chats():
    return s3_list_chats()


@app.get("/chat/{chat_name}")
def get_chat(chat_name):
    return load_history(chat_name)


@app.post("/chat")
async def chat(
    chat_name: str = Form(...),
    prompt: str = Form(...),
    file: UploadFile = File(None)
):

    history = load_history(chat_name)

    image_bytes = None

    if file:
        image_bytes = await file.read()

    response = ask_gemini(prompt, image_bytes)

    history["messages"].append({
        "role": "user",
        "text": prompt
    })

    assistant_message = {
        "role": "assistant",
        "text": response.get("text"),
        "images": response.get("images")
    }
    history["messages"].append(assistant_message)

    save_history(chat_name, history)

    return {"response": response}