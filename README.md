# LearnFlow — Learn From Your Notes

> **Turn your notes into a personalized learning system.**

LearnFlow is an active-learning and exam-preparation platform that transforms a student's own lecture notes and study PDFs into **structured topics, interactive flashcards, practice quizzes, performance insights, weak-topic analysis, revision recommendations, and time-aware exam preparation**.

Instead of simply summarizing notes, LearnFlow helps students answer a more important question:

> **“I have limited time. What should I study, practice, and revise next?”**

Built for **VERSATHON 2.0 E2**.

---

## 🎯 Problem Statement

Students often spend hours reading lengthy lecture notes and PDFs before examinations.

The main challenge is not simply finding study material. Students also struggle to:

* Identify the most important concepts.
* Remember information through active recall.
* Practice what they have learned.
* Understand which topics they are weak in.
* Decide what to revise next.
* Plan their preparation when an exam is approaching.
* Make effective use of limited study time.

Traditional PDF readers and note-taking tools provide information, but they do not provide a complete **understand → practice → measure → improve → revise** learning workflow.

---

## 💡 Our Solution

**LearnFlow converts a student's own study material into an interactive learning workflow.**

The platform follows:

```text
Upload
   ↓
Understand
   ↓
Topics
   ↓
Recall
   ↓
Practice
   ↓
Measure
   ↓
Identify Weak Areas
   ↓
Revise
   ↓
Optimize
   ↓
Prepare for the Exam
```

Students upload their notes or study PDFs, and LearnFlow processes the content to generate personalized learning resources.

The platform then uses quiz performance and learning activity to help students understand **what they know, what they don't know, and what they should focus on next**.

---

# 🚀 Key Features

## 1. 📄 Multi-Page Study Material Processing

LearnFlow processes complete study documents rather than relying on a single-page extraction approach.

### Capabilities

* Supports multi-page PDF and text documents.
* Extracts content from all available PDF pages.
* Cleans and normalizes extracted text.
* Removes repetitive formatting noise such as repeated headers and blank lines.
* Chunks large documents into manageable sections.
* Processes content for downstream topic, flashcard, and quiz generation.
* Detects scanned/image-only PDFs that do not contain readable text.

This allows students to work with lengthy lecture notes and study material.

---

## 2. 🧠 Automatic Topic Extraction

LearnFlow analyzes uploaded study material and identifies important concepts and topics.

Each topic can be explored through a detailed learning view containing relevant explanations and study-oriented information.

This helps students move from:

```text
Long PDF
   ↓
Important Topics
   ↓
Focused Learning
```

---

## 3. 🃏 Interactive Flashcards

LearnFlow generates active-recall flashcards from the student's study material.

### Features

* Interactive 3D card experience.
* Question and answer format.
* Topic-based organization.
* Previous/next navigation.
* Configurable flashcard counts.
* Custom card count selection.
* Additional generation options.
* Flashcards based on uploaded learning material.

The goal is to help students **recall information instead of only rereading it**.

---

## 4. 📝 Adaptive Practice Quizzes

LearnFlow generates multiple-choice practice questions from the uploaded notes.

### Features

* 4-option MCQs.
* Configurable question count.
* Difficulty selection.
* Question progress tracking.
* Answer submission.
* Score calculation.
* Topic-level performance analysis.
* Question explanations where available.
* Additional question generation.

Example:

```text
Question 3 of 15
        ↓
Select Answer
        ↓
Submit Quiz
        ↓
Calculate Performance
        ↓
Identify Weak Topics
```

---

## 5. 📊 Performance & Weak Topic Analysis

After completing a quiz, LearnFlow analyzes the student's performance.

The system calculates:

* Total questions.
* Correct answers.
* Incorrect answers.
* Score percentage.
* Topic-level accuracy.
* Weak topic areas.

A topic with **less than 60% accuracy** is classified as a weak topic in the current learning workflow.

This converts quiz results into actionable study information.

---

## 6. 🔄 Targeted Revision Recommendations

Instead of simply displaying a score, LearnFlow uses performance information to recommend what the student should revise.

The workflow becomes:

```text
Quiz
 ↓
Performance Analysis
 ↓
Weak Topics
 ↓
Revision Recommendations
 ↓
Focused Study
```

This helps students spend more time on areas where additional practice is needed.

---

# ⭐ 7. Exam Tomorrow Mode

## The Signature Feature

One of LearnFlow's key features is **Exam Tomorrow Mode**.

Imagine a student has an examination tomorrow and only has **one hour left to study**.

The student does not need another long summary.

They need an answer to:

> **“What exactly should I study in this one hour?”**

Exam Tomorrow Mode uses the student's existing learning data, including:

* Important topics.
* Weak topics.
* Quiz performance.
* Flashcards.
* Revision recommendations.
* Uploaded study material.

The student selects the available study time, such as:

```text
30 Minutes
1 Hour
2 Hours
4 Hours
```

LearnFlow then creates a focused, time-aware study plan.

### Example — 1 Hour

```text
15 min → Weak Concepts
20 min → Important Concepts
15 min → Adaptive Quiz
10 min → Final Revision
```

The planner ensures that the study activities fit within the selected time.

### Why it is different

Exam Tomorrow Mode does not simply summarize the student's notes.

It acts as an **orchestration layer over the existing learning system**.

It answers:

```text
What should I study?
        ↓
What am I weak at?
        ↓
What should I practice?
        ↓
What should I revise?
        ↓
How should I use my remaining time?
```

---

# 🎓 8. Student Assistant

LearnFlow also includes a built-in **Student Assistant** designed to guide students through the platform.

The assistant can help users understand:

* How to upload notes.
* How Topics work.
* How to use Flashcards.
* How to start a Quiz.
* How Performance analysis works.
* How Weak Topics are identified.
* How Revision works.
* How Exam Tomorrow Mode works.
* How to navigate the dashboard.

The assistant is designed as a lightweight contextual guidance layer rather than a replacement for the core learning workflow.

---

# 👤 9. Authentication & Student Data Isolation

LearnFlow supports authenticated student workflows.

The application provides:

* User registration.
* Login.
* User-specific data.
* Document ownership.
* Learning activity associated with the authenticated student.

This allows each student to work with their own study material and learning progress.

---

# 📊 10. Interactive Dashboard

The dashboard provides a centralized view of the student's learning workflow.

It can surface:

* Uploaded documents.
* Important topics.
* Flashcards.
* Quiz activity.
* Performance information.
* Weak topics.
* Revision recommendations.
* Exam preparation options.

The dashboard acts as the student's main learning control center.

---

# 🏗️ Learning Architecture

LearnFlow is designed around a connected learning pipeline rather than independent features.

```text
                    ┌──────────────────┐
                    │   Student Notes  │
                    │    / PDF Upload  │
                    └────────┬─────────┘
                             ↓
                    ┌──────────────────┐
                    │ PDF/Text Pipeline│
                    │ Extraction +     │
                    │ Cleaning + Chunking│
                    └────────┬─────────┘
                             ↓
                    ┌──────────────────┐
                    │ Content Analysis │
                    └────────┬─────────┘
                             ↓
             ┌───────────────┼────────────────┐
             ↓               ↓                ↓
        ┌─────────┐     ┌───────────┐    ┌─────────┐
        │ Topics  │     │ Flashcards│    │  Quiz   │
        └────┬────┘     └─────┬─────┘    └────┬────┘
             │                │               │
             └────────────────┼───────────────┘
                              ↓
                    ┌──────────────────┐
                    │   Performance    │
                    │     Analysis     │
                    └────────┬─────────┘
                             ↓
                    ┌──────────────────┐
                    │   Weak Topics    │
                    └────────┬─────────┘
                             ↓
                    ┌──────────────────┐
                    │ Revision System  │
                    └────────┬─────────┘
                             ↓
                    ┌──────────────────┐
                    │ Exam Tomorrow    │
                    │      Mode        │
                    └──────────────────┘
```

---

# 🛠️ Technology Stack

## Frontend

* React 18
* Vite
* Tailwind CSS
* Lucide Icons

## Backend

* Python
* Flask
* Flask-CORS
* SQLite

## Document Processing

* pypdf
* Multi-page text extraction
* Text cleaning
* Text chunking

## AI / Content Generation

* Google Gemini API through `google-genai`
* Built-in heuristic/NLP fallback mechanisms

## Development & Testing

* Python virtual environment
* npm
* Automated pipeline testing
* Git/GitHub

---

# 📁 Project Structure

```text
VERSATHON/
│
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── database.py
│   ├── models.py
│   ├── requirements.txt
│   │
│   ├── routes/
│   │   └── api.py
│   │
│   ├── services/
│   │   ├── pdf_service.py
│   │   └── ai_service.py
│   │
│   └── uploads/
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   │
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       │
│       ├── services/
│       │   └── api.js
│       │
│       └── components/
│           ├── Dashboard.jsx
│           ├── ExamTomorrowMode.jsx
│           ├── Flashcards.jsx
│           ├── FlashcardSetup.jsx
│           ├── QuizSetup.jsx
│           ├── QuizView.jsx
│           ├── Sidebar.jsx
│           │
│           └── StudentAssistant/
│               ├── StudentAssistantButton.jsx
│               ├── StudentAssistantPanel.jsx
│               ├── assistantRules.js
│               └── index.jsx
│
├── test_pipeline.py
├── .gitignore
├── .env.example
└── README.md
```

---

# 🚦 Quick Start

## Prerequisites

Install:

* Node.js 18+
* npm
* Python 3.10+
* Git

---

## 1. Clone the Repository

```bash
git clone https://github.com/pvnkulal45-svg/VERSATHON.git
cd VERSATHON
```

---

## 2. Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

The backend runs on:

```text
http://127.0.0.1:5001
```

---

## 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

---

# 🔐 Environment Variables

Create a local `.env` file when required.

Use `.env.example` as the reference.

**Never commit API keys, credentials, or other secrets to GitHub.**

---

# 🌐 API Overview

| Endpoint           | Method | Purpose                                           |
| ------------------ | ------ | ------------------------------------------------- |
| `/api/health`      | GET    | Backend health check                              |
| `/api/upload`      | POST   | Upload and process study material                 |
| `/api/documents`   | GET    | Retrieve user documents                           |
| `/api/topics`      | GET    | Retrieve extracted topics                         |
| `/api/flashcards`  | GET    | Retrieve flashcards                               |
| `/api/quiz`        | GET    | Retrieve quiz questions                           |
| `/api/quiz/submit` | POST   | Submit quiz and calculate performance             |
| `/api/progress`    | GET    | Retrieve learning progress                        |
| `/api/weak-topics` | GET    | Retrieve weak topics and revision recommendations |

Additional application routes support authentication, topic details, configurable learning activities, and exam preparation workflows.

---

# 🧪 Testing

The project includes an end-to-end pipeline test:

```bash
python test_pipeline.py
```

The test pipeline validates the core document-processing workflow using a multi-page study document.

### Pipeline Validation

```text
Upload PDF
    ↓
Extract all pages
    ↓
Clean text
    ↓
Chunk document
    ↓
Generate learning content
    ↓
Store data
    ↓
Generate quiz
    ↓
Submit quiz
    ↓
Calculate score
    ↓
Identify weak topics
    ↓
Generate revision recommendations
```

The test also validates handling of scanned/image-only PDFs where readable text cannot be extracted.

---

# 🎓 Core Learning Philosophy

LearnFlow is built around active learning rather than passive reading.

```text
Understand
    ↓
Recall
    ↓
Practice
    ↓
Measure
    ↓
Improve
    ↓
Revise
    ↓
Prepare
```

The objective is to turn a student's existing notes into a **complete learning system**.

---

# 🏆 What Makes LearnFlow Different?

Many study applications focus primarily on generating summaries.

LearnFlow connects multiple stages of the student's learning process:

**Notes → Topics → Flashcards → Quiz → Performance → Weak Topics → Revision → Exam Preparation**

The standout capability is **Exam Tomorrow Mode**, which uses the student's existing learning information to create a time-aware preparation plan.

Instead of asking:

> “What is inside my PDF?”

LearnFlow helps answer:

> **“Given what I know, what should I study next?”**

---

# 🔮 Future Enhancements

Potential future improvements include:

* Spaced repetition scheduling.
* More advanced adaptive quiz difficulty.
* Learning streaks and progress tracking.
* Calendar-based exam planning.
* More detailed learning analytics.
* Additional document formats.
* Improved multilingual learning support.
* More personalized revision scheduling.

---

# 👥 Team / Project

## 👥 Team Members

| Name            |
| --------------- |
| Pavan Kumar P   |
| Kishan S Shetty |
| Ashwith Kumar K |
| Shrijan         |

---



**Project:** Learn From Your Notes
**Event:** VERSATHON 2.0 E2
**Repository:** `pvnkulal45-svg/VERSATHON`

Built as an EdTech solution focused on helping students convert their own study material into a structured, measurable, and time-aware learning experience.
