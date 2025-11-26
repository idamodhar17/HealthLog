# HealthLog

HealthLog is a secure, interoperable digital health locker designed to help patients store, manage, and share their medical records. It includes OCR-based text extraction, AI-generated medical summaries, and QR-based workflows for doctors and hospitals. Patients maintain full control over their data, with all accesses secured through time-bound tokens.

## Features

- **Digital Health Locker**: Upload, store, and manage medical files such as PDFs and images.
- **OCR Extraction**: Extracts text content from uploaded reports using Tesseract.js.
- **AI Health Summary**: A dedicated FastAPI microservice uses GPT models to generate structured medical summaries.
- **QR-Based Access System**:
  - Temporary Doctor Access QR for read-only viewing.
  - Temporary Hospital Upload QR for adding new reports.
  - Public Emergency (ICE) QR for critical medical information.
- **Medical Timeline**: Automatically generated timeline of patient medical history.
- **Doctor Notes**: Doctors can add notes through QR-secured sessions.
- **Emergency Profile**: Stores blood group, allergies, critical history, and emergency contacts.
- **Audit Logging**: Complete logs of doctor and hospital access for transparency.

## Tech Stack

### Frontend
- React (Vite)
- TailwindCSS
- Axios
- React Router
- Context API

### Backend
- Node.js, Express.js
- MongoDB + Mongoose
- Multer + Cloudinary
- JWT Authentication
- QR Code Generation
- Tesseract.js OCR
- Crypto-secured tokens

### AI Microservice
- FastAPI
- OpenAI GPT Models
- Pydantic
- Uvicorn

## Installation

### Prerequisites

Make sure you have the following installed:

- Node.js 16+
- Python 3.9+
- MongoDB running locally or via cloud (MongoDB Atlas)

### Clone the Repository

```bash
git clone https://github.com/idamodhar17/HealthLog.git
cd healthlog
```
---

## Backend Setup

```bash
cd backend
npm install
npm run dev
```
---

## Backend Environment Variables (.env)

```bash
PORT=8080
MONGO_URI=
JWT_SECRET=
EMAIL_USER=
EMAIL_PASS=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLIENT_URL=http://localhost:5173
```

---

## AI Microservice Setup (FastAPI)

```bash
cd fastapi-ai-summary
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

### FastAPI Environment Variables (.env)

```bash
OPENAI_API_KEY=
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Frontend Environment Variables (.env)

```bash
VITE_API_URL=http://localhost:8080/api
```

---

## Usage

1. Start the backend server.
2. Start the FastAPI AI microservice.
3. Start the frontend.
4. Open `http://localhost:5173` in your browser.
5. Register or log in.
6. Upload medical records, view dashboard, generate QR codes, or use AI summary features.

---

## API Overview

### Authentication
```bash
POST /auth/register
POST /auth/verify-email-otp
POST /auth/login
```

### Records
```bash
POST /records/upload
GET  /records/all
POST /ocr/extract
GET  /ocr/all
```

### Timeline
```bash
GET /timeline
```

### Doctor Access
```bash
POST /qr/generate
GET  /doctor/view/:token
POST /doctor/note/add/:token
```

### Hospital Upload
```bash
POST /hospital/generate
POST /hospital/upload/:token
```

### Emergency (ICE)
```bash
POST /ice/save
POST /ice/generate
GET  /ice/view/:token
```

### AI Summary
```bash
GET /ai/summary
```

### Audit Logs
```bash
GET /audit
```

---

## Project Structure

```
healthlog/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── config/
│   ├── uploads/
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── vite.config.js
│
└── fastapi-ai-summary/
    ├── main.py
    ├── schemas/
    ├── services/
    └── requirements.txt
```

---

## Security Considerations

- All QR tokens are encrypted and auto-expire.
- No doctor or hospital login accounts; access is token-based.
- JWT-based user authentication.
- Audit logs track all external access via QR tokens.
- AI microservice is fully isolated from the client.
- Strict input validation and secure file uploads.

---

## Future Enhancements

- ABDM Health ID Integration
- FHIR-compliant data export/import
- Multi-hospital interoperability
- AI-based anomaly detection
- Drug interaction warnings
- Offline encrypted health card
- Automatic report categorization using ML

---

## Acknowledgments

- Tesseract.js for OCR
- OpenAI API for AI summaries
- React and Node.js ecosystem
- FastAPI community
