# Learn From Your Notes — VERSATHON 2.0 E2 MVP

A modern, automated active-learning application that converts student lecture notes and multi-page study PDFs (including **20+ page documents**) into structured active-learning materials: **Topics**, **Interactive Flashcards**, **Multiple-Choice Quizzes**, **Weak Topic Analytics**, and **Targeted Revision Recommendations**.

---

## 🎯 Problem Statement

Students often spend hours passively reading through dense, lengthy study PDFs (20+ pages) without active engagement. Passive reading leads to low retention, difficulty identifying weak knowledge areas, and ineffective exam preparation.

## 🚀 Solution

**Learn From Your Notes** automatically processes complete multi-page study documents, cleans and chunks large text, extracts core domain topics, and generates interactive 3D flashcards and multiple-choice practice quizzes. After quiz submission, the application evaluates topic-level accuracy, flags weak topics (accuracy < 60%), and delivers clear, actionable revision recommendations.

---

## ✨ Key Features

1. **Multi-Page PDF Processing Pipeline (20+ Pages Guarantee)**
   - Loops through **ALL pages** (1 to N) of PDF notes without hardcoded single-page limits.
   - Normalizes whitespace, cleans repeated blank lines, and removes repetitive headers/footers.
   - Splits large documents into manageable text chunks for parallel processing and deduplication.
   - **Scanned PDF Safeguard**: Explicitly detects image-only/scanned PDFs without readable text and alerts the user with:  
     `"Unable to extract readable text from this PDF. Please upload a text-based PDF."`

2. **Topic Extraction**
   - Automatically identifies key concepts, chapter sections, and core subject units from the study material.

3. **3D Interactive Flashcards**
   - Generates active-recall flashcards linked to extracted topics with a smooth 3D flip card UI, topic filtering, and next/previous controls.

4. **Multiple-Choice Quiz Generator**
   - Creates 4-option practice quizzes (A, B, C, D) with contextual distractors and target answer explanations strictly based on uploaded notes.

5. **Automatic Scoring & Weak Topics Analysis**
   - Calculates score percentage, correct count, and incorrect count upon submission.
   - Applies transparent topic accuracy tracking: **Accuracy < 60% = Weak Topic**.

6. **Targeted Revision Recommendations**
   - Displays clear, prioritized revision suggestions based on weak topic areas.

7. **Interactive Dashboard**
   - Centralized overview showing document metadata, topics list, quiz attempts, score badges, weak topic alerts, and revision plans.

---

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons
- **Backend**: Python 3.14, Flask, Flask-CORS, SQLite3
- **PDF Engine**: `pypdf` (multi-page text extraction & chunking)
- **AI & Fallback Engine**: `google-genai` (Gemini API) + Built-in Heuristic NLP Extractor (100% resilient offline fallback)

---

## 🏗 Project Structure

```
learn-from-notes/
├── backend/
│   ├── app.py                  # Flask server entrypoint & API registration
│   ├── config.py               # Database paths & upload configuration
│   ├── database.py             # SQLite schema initialization
│   ├── models.py               # Data models & CRUD helpers
│   ├── requirements.txt        # Python backend dependencies
│   ├── routes/
│   │   └── api.py              # REST API endpoints
│   ├── services/
│   │   ├── pdf_service.py      # Multi-page PDF text extraction & chunking
│   │   └── ai_service.py       # Topic, flashcard & quiz generator (Gemini + Heuristic NLP)
│   └── uploads/                # Local file upload directory
├── frontend/
│   ├── package.json            # React & Tailwind dependencies
│   ├── vite.config.js          # Vite configuration with API proxy (port 5000)
│   ├── tailwind.config.js      # Tailwind CSS setup
│   ├── src/
│   │   ├── main.jsx            # React root
│   │   ├── App.jsx             # Main layout & tab router
│   │   ├── index.css           # Tailwind & 3D glassmorphism styles
│   │   ├── services/
│   │   │   └── api.js          # API client wrapper
│   │   └── components/
│   │       ├── Navbar.jsx      # Navigation header & document selector
│   │       ├── FileUpload.jsx  # Drag & drop file upload component
│   │       ├── Dashboard.jsx   # Main overview dashboard
│   │       ├── TopicList.jsx   # Extracted topics list & search
│   │       ├── Flashcards.jsx  # 3D flip card viewer
│   │       ├── QuizView.jsx    # MCQ quiz runner
│   │       ├── ScoreModal.jsx   # Results & score summary modal
│   │       └── WeakTopics.jsx  # Weak topics (<60%) & revision plan
├── test_pipeline.py            # End-to-end 22-page PDF test script
├── .gitignore                  # Git ignore rules
├── .env.example                # Environment variables template
└── README.md                   # Project documentation
```

---

## 🚦 Quick Start Guide

### Prerequisites
- Node.js (v18+) & npm
- Python (v3.10+)

### 1. Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```
*Backend server starts at `http://127.0.0.1:5001`.*

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
*Frontend application starts at `http://localhost:5173`.*

---

## 🌐 API Overview

| Endpoint | Method | Description |
|---|---|---|
| `/api/health` | GET | API healthcheck status |
| `/api/upload` | POST | Uploads PDF/TXT, extracts ALL pages, chunks text, generates materials |
| `/api/documents` | GET | Retrieves list of uploaded documents |
| `/api/topics` | GET | Retrieves extracted topics for active document |
| `/api/flashcards` | GET | Retrieves flashcards for active document |
| `/api/quiz` | GET | Retrieves MCQ quiz questions for active document |
| `/api/quiz/submit` | POST | Evaluates submitted answers, records score, calculates weak topics |
| `/api/progress` | GET | Retrieves latest quiz score & attempt metrics |
| `/api/weak-topics` | GET | Retrieves weak topics (<60% accuracy) & revision recommendations |

---

## 🧪 Testing Proof

The project includes an automated test script `test_pipeline.py` that generates a realistic **22-page study PDF** (`Operating_Systems_Master_Notes_22Pages.pdf`) and verifies the complete user flow:

```bash
python test_pipeline.py
```

### Verified Pipeline Checklist:
- [x] Upload TXT / PDF
- [x] Extract text from ALL 22 pages (verified 29,473 characters extracted)
- [x] Chunk large text into 11 manageable sections
- [x] Extract topics, flashcards, and MCQs
- [x] Insert into SQLite database
- [x] Execute quiz & calculate score %
- [x] Flag weak topics with accuracy < 60%
- [x] Generate targeted revision recommendations
- [x] Verify scanned PDF detection error handling

---

## 📜 License & Acknowledgments

Built for **VERSATHON 2.0 E2**.
