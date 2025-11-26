import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = FastAPI(
    title="AI Health Summary Service",
    description="Generate concise medical summaries from OCR text",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SummaryRequest(BaseModel):
    text: str


@app.post("/summarize")
async def summarize_text(data: SummaryRequest):
    try:
        prompt = f"""
        You are a medical summarization AI. 
        Create a **very short, clear, structured JSON summary** from the extracted OCR text.

        Keep the response:
        - **strictly in JSON**
        - **max 2–3 lines per field**
        - **no extra commentary**
        - **no long paragraphs**
        - **no markdown**

        Extract only:
        - diagnosis (short phrase)
        - medications (array of {{"name": "", "dose": "", "frequency": ""}})
        - lab_summary (2–3 key findings max)
        - recommendations (short)
        - follow_up (short)
        - warnings (only if serious)

        OCR text:
        {data.text}

        Return ONLY this JSON:
        {{
            "diagnosis": "",
            "medications": [],
            "lab_summary": "",
            "recommendations": "",
            "follow_up": "",
            "warnings": ""
        }}
        """

        response = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1,
        )

        ai_summary = response.choices[0].message.content

        return {
            "success": True,
            "summary": ai_summary
        }

    except Exception as e:
        return {"success": False, "error": str(e)}
