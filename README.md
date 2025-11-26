# HealthLog

HealthLog – AI-Powered Digital Health Locker

HealthLog is a secure, interoperable digital health locker that enables patients to store, manage, and share their medical records. It provides a seamless QR-based workflow for doctors and hospitals, integrates OCR to extract text from medical documents, and uses an AI microservice to generate structured health summaries.

HealthLog follows modern healthcare interoperability concepts inspired by ABDM (Ayushman Bharat Digital Mission) while remaining simple and deployment-ready.

Table of Contents

Overview

Key Features

System Architecture

Tech Stack

API Overview

Installation and Setup

Project Structure

Security Considerations

Future Enhancements

License

1. Overview

Healthcare files are scattered across labs, hospitals, and devices. Patients often struggle to maintain their medical history and share it efficiently with doctors. HealthLog solves this by offering:

A unified, secure digital health locker

QR-based access for hospitals and doctors

OCR extraction from medical files

AI-generated medical summaries

Emergency ICE (In Case of Emergency) profile with QR

Audit logs for transparency

The system ensures that patients remain in full control of their data.

2. Key Features
2.1 Patient Features

Register, verify email via OTP, and log in securely

Upload medical reports (PDF, images)

View and manage medical records

View auto-generated medical timeline

Generate Doctor Access QR (temporary read-only access)

Generate Hospital Upload QR (temporary upload access)

Create an Emergency ICE Profile

Access AI-generated health summary

View audit logs

2.2 Doctor Features

Scan patient QR

Access patient records without login (QR-secured)

View timeline, summaries, extracted text

Add doctor notes securely

2.3 Hospital Features

Scan special QR to upload reports for a patient

Upload files directly without login

Files automatically stored under patient records

2.4 AI Microservice

A dedicated FastAPI service

Converts OCR text into a structured JSON health summary

Powered by OpenAI GPT models

Diagnoses extraction, medication breakdown, lab overview, follow-up, and warnings

2.5 OCR and Timeline

Tesseract.js OCR

Extracts text from uploaded files

Auto-generates timeline entries

2.6 Emergency Profile

Stores blood group, allergies, medical history, emergency contacts

Public QR for paramedics

No login required

3. System Architecture

QR Token System:

Doctor Access Token

Hospital Upload Token

ICE Token

All tokens are time-bound and secure

4. Tech Stack
Frontend

React (Vite)

TailwindCSS

Axios

Context API

React Router

Lucide Icons

Backend (Node.js)

Express.js

MongoDB + Mongoose

JWT Authentication

Multer + Cloudinary

Tesseract.js OCR

QR Code Generation

Crypto-secured tokens

AI Microservice

FastAPI

OpenAI API

Uvicorn

Pydantic

5. API Overview
Authentication

POST /auth/register

POST /auth/verify-email-otp

POST /auth/login

Records

POST /records/upload

GET /records/all

POST /ocr/extract

GET /ocr/all

Timeline

GET /timeline

Doctor QR

POST /qr/generate

GET /doctor/view/:token

POST /doctor/note/add/:token

Hospital Upload

POST /hospital/generate

POST /hospital/upload/:token

Emergency (ICE)

POST /ice/save

POST /ice/generate

GET /ice/view/:token

AI Summary

GET /ai/summary (Node backend → FastAPI microservice)

Audit Logs

GET /audit

6. Installation and Setup
Clone Repository
git clone https://github.com/yourusername/healthlog.git
cd healthlog

Backend Setup
cd backend
npm install
npm run dev


Environment Variables (backend .env):

PORT=8080
MONGO_URI=
JWT_SECRET=
EMAIL_USER=
EMAIL_PASS=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLIENT_URL=http://localhost:5173

AI Microservice Setup (FastAPI)
cd fastapi-ai-summary
pip install -r requirements.txt
uvicorn main:app --reload --port 8001


Environment Variables (FastAPI .env):

OPENAI_API_KEY=

Frontend Setup
cd frontend
npm install
npm run dev


Environment Variables (frontend .env):

VITE_API_URL=http://localhost:8080/api

7. Project Structure
backend/
  ├── controllers/
  ├── routes/
  ├── models/
  ├── middleware/
  ├── config/
  └── app.js

fastapi-ai-summary/
  ├── main.py
  ├── requirements.txt
  └── .env

frontend/
  ├── src/
  │   ├── pages/
  │   ├── components/
  │   ├── api/
  │   ├── contexts/
  │   └── App.tsx
  └── index.html

8. Security Considerations

All QR tokens are random, secure, and auto-expiring

Doctor and hospital access occurs only through temporary QR tokens

JWT for user authentication

No persistent hospital/doctor accounts

Private AI microservice (not directly exposed to UI)

Input validation on all API layers

Audit logging of doctor accesses

9. Future Enhancements

ABDM Health ID linking

Multi-hospital interoperability

AI-based anomaly detection

Drug interaction warnings

Encrypted offline health card

Automated report categorization

FHIR-compliant data structures

10. License

This project is licensed under the MIT License.
