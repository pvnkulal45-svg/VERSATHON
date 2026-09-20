import os
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import config
from models import (
    create_document, get_document, get_latest_document, get_all_documents,
    save_topics, get_topics_by_doc, save_flashcards, get_flashcards_by_doc,
    update_flashcard_status, save_questions, get_questions_by_doc,
    save_quiz_attempt, get_latest_quiz_attempt, get_topic_performance
)
from services.pdf_service import extract_text_from_file, chunk_text, ScannedPdfError, UnsupportedFileError
from services.ai_service import process_text_chunks
from services.auth_service import register_user, login_user, get_user_from_token, AuthError

api_bp = Blueprint('api', __name__)

def get_current_user():
    token = request.headers.get('Authorization')
    if token:
        user = get_user_from_token(token)
        if user:
            return user
    # Fallback to guest user ID 1 for backwards compatibility if token not sent
    return {"id": 1, "name": "Guest Student", "email": "guest@learnnotes.com"}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in config.ALLOWED_EXTENSIONS

@api_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "message": "Learn From Your Notes API is running"}), 200

# AUTH ROUTES
@api_bp.route('/auth/register', methods=['POST'])
def handle_register():
    data = request.json or {}
    try:
        res = register_user(data.get('name'), data.get('email'), data.get('password'))
        return jsonify(res), 201
    except AuthError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": f"Registration failed: {str(e)}"}), 500

@api_bp.route('/auth/login', methods=['POST'])
def handle_login():
    data = request.json or {}
    try:
        res = login_user(data.get('email'), data.get('password'))
        return jsonify(res), 200
    except AuthError as e:
        return jsonify({"error": str(e)}), 401
    except Exception as e:
        return jsonify({"error": f"Login failed: {str(e)}"}), 500

@api_bp.route('/auth/me', methods=['GET'])
def handle_get_me():
    user = get_current_user()
    return jsonify({"user": user}), 200

# DOCUMENT & CONTENT ROUTES (ISOLATED BY USER_ID)
@api_bp.route('/upload', methods=['POST'])
def upload_file():
    user = get_current_user()
    user_id = user['id']

    if 'file' not in request.files:
        return jsonify({"error": "No file part provided in request."}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected."}), 400
        
    if not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type. Only PDF (.pdf) and TXT (.txt) files are allowed."}), 400
        
    original_name = secure_filename(file.filename) or "study_notes.pdf"
    save_filename = f"{user_id}_{os.urandom(8).hex()}_{original_name}"
    filepath = os.path.join(config.UPLOAD_FOLDER, save_filename)
    
    try:
        file.save(filepath)
        
        # 1. Extract ALL pages text
        extracted_text, page_count = extract_text_from_file(filepath)
        char_count = len(extracted_text)
        
        # 2. Split large text into chunks
        chunks = chunk_text(extracted_text, max_chunk_size=3500)
        
        # 3. Extract topics, flashcards, questions across all chunks
        topics, flashcards, questions = process_text_chunks(chunks)
        
        # 4. Save to Database under user_id
        doc_id = create_document(save_filename, file.filename, page_count, char_count, user_id=user_id)
        saved_topics = save_topics(doc_id, topics, user_id=user_id)
        saved_flashcards = save_flashcards(doc_id, flashcards, user_id=user_id)
        saved_questions = save_questions(doc_id, questions, user_id=user_id)
        
        return jsonify({
            "message": "File processed successfully!",
            "document": {
                "id": doc_id,
                "filename": file.filename,
                "page_count": page_count,
                "char_count": char_count,
                "chunks_processed": len(chunks)
            },
            "topics_count": len(saved_topics),
            "flashcards_count": len(saved_flashcards),
            "questions_count": len(saved_questions)
        }), 200
        
    except ScannedPdfError as e:
        if os.path.exists(filepath):
            os.remove(filepath)
        return jsonify({"error": str(e)}), 400
    except UnsupportedFileError as e:
        if os.path.exists(filepath):
            os.remove(filepath)
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        if os.path.exists(filepath):
            os.remove(filepath)
        return jsonify({"error": f"Failed to process document: {str(e)}"}), 500

@api_bp.route('/documents', methods=['GET'])
def list_documents():
    user = get_current_user()
    docs = get_all_documents(user_id=user['id'])
    return jsonify({"documents": docs}), 200

@api_bp.route('/topics', methods=['GET'])
def get_topics():
    user = get_current_user()
    user_id = user['id']
    doc_id = request.args.get('doc_id', type=int)
    
    if not doc_id:
        latest = get_latest_document(user_id=user_id)
        if not latest:
            return jsonify({"topics": [], "document": None}), 200
        doc_id = latest['id']
        
    doc = get_document(doc_id, user_id=user_id)
    topics = get_topics_by_doc(doc_id, user_id=user_id)
    return jsonify({"document": doc, "topics": topics}), 200

@api_bp.route('/flashcards', methods=['GET'])
def get_flashcards():
    user = get_current_user()
    user_id = user['id']
    doc_id = request.args.get('doc_id', type=int)
    
    if not doc_id:
        latest = get_latest_document(user_id=user_id)
        if not latest:
            return jsonify({"flashcards": [], "document": None}), 200
        doc_id = latest['id']
        
    doc = get_document(doc_id, user_id=user_id)
    flashcards = get_flashcards_by_doc(doc_id, user_id=user_id)
    return jsonify({"document": doc, "flashcards": flashcards}), 200

@api_bp.route('/flashcards/<int:card_id>/status', methods=['POST'])
def handle_flashcard_status(card_id):
    user = get_current_user()
    user_id = user['id']
    data = request.json or {}
    status = data.get('status', 'new')
    if status not in ['new', 'know', 'review']:
        return jsonify({"error": "Invalid status value. Must be 'new', 'know', or 'review'."}), 400
        
    update_flashcard_status(card_id, status, user_id=user_id)
    return jsonify({"message": "Status updated successfully", "card_id": card_id, "status": status}), 200

@api_bp.route('/questions', methods=['GET'])
@api_bp.route('/quiz', methods=['GET'])
def get_quiz():
    user = get_current_user()
    user_id = user['id']
    doc_id = request.args.get('doc_id', type=int)
    
    if not doc_id:
        latest = get_latest_document(user_id=user_id)
        if not latest:
            return jsonify({"questions": [], "document": None}), 200
        doc_id = latest['id']
        
    doc = get_document(doc_id, user_id=user_id)
    questions = get_questions_by_doc(doc_id, user_id=user_id)
    return jsonify({"document": doc, "questions": questions}), 200

@api_bp.route('/quiz/submit', methods=['POST'])
def submit_quiz():
    user = get_current_user()
    user_id = user['id']
    data = request.json or {}
    doc_id = data.get('doc_id')
    user_answers = data.get('answers', [])
    
    if not doc_id:
        latest = get_latest_document(user_id=user_id)
        if not latest:
            return jsonify({"error": "No active document found."}), 400
        doc_id = latest['id']
        
    all_questions = get_questions_by_doc(doc_id, user_id=user_id)
    q_map = {q['id']: q for q in all_questions}
    
    total_questions = len(all_questions)
    if total_questions == 0:
        return jsonify({"error": "No questions found for this document."}), 400
        
    correct_count = 0
    evaluated_answers = []
    
    for user_ans in user_answers:
        q_id = user_ans.get('question_id')
        selected = (user_ans.get('selected_option') or '').upper()
        
        if q_id in q_map:
            question_obj = q_map[q_id]
            correct_opt = question_obj['correct_option'].upper()
            is_correct = (selected == correct_opt)
            if is_correct:
                correct_count += 1
                
            evaluated_answers.append({
                'question_id': q_id,
                'topic_name': question_obj['topic_name'],
                'selected_option': selected,
                'is_correct': is_correct
            })
            
    incorrect_count = total_questions - correct_count
    score_percentage = round((correct_count / total_questions) * 100.0, 1)
    
    # Save attempt under user_id
    attempt_id = save_quiz_attempt(doc_id, total_questions, correct_count, incorrect_count, score_percentage, evaluated_answers, user_id=user_id)
    
    # Weak topics (<60% accuracy rule)
    topic_perf = get_topic_performance(doc_id, user_id=user_id)
    weak_topics = [t for t in topic_perf if t['is_weak']]
    
    revision_recommendations = []
    for wt in weak_topics:
        revision_recommendations.append({
            "topic_name": wt['topic_name'],
            "accuracy": wt['accuracy'],
            "recommendation": f"Focus review on '{wt['topic_name']}'. Current accuracy is {wt['accuracy']}%. Re-read core definitions and practice related flashcards."
        })
        
    return jsonify({
        "attempt_id": attempt_id,
        "document_id": doc_id,
        "total_questions": total_questions,
        "correct_answers": correct_count,
        "incorrect_answers": incorrect_count,
        "score_percentage": score_percentage,
        "topic_performance": topic_perf,
        "weak_topics": weak_topics,
        "revision_recommendations": revision_recommendations
    }), 200

@api_bp.route('/progress', methods=['GET'])
def get_progress():
    user = get_current_user()
    user_id = user['id']
    doc_id = request.args.get('doc_id', type=int)
    
    if not doc_id:
        latest = get_latest_document(user_id=user_id)
        if not latest:
            return jsonify({"progress": None}), 200
        doc_id = latest['id']
        
    latest_attempt = get_latest_quiz_attempt(doc_id, user_id=user_id)
    topic_perf = get_topic_performance(doc_id, user_id=user_id) if latest_attempt else []
    
    return jsonify({
        "document_id": doc_id,
        "latest_attempt": latest_attempt,
        "topic_performance": topic_perf
    }), 200

@api_bp.route('/weak-topics', methods=['GET'])
def get_weak_topics():
    user = get_current_user()
    user_id = user['id']
    doc_id = request.args.get('doc_id', type=int)
    
    if not doc_id:
        latest = get_latest_document(user_id=user_id)
        if not latest:
            return jsonify({"weak_topics": [], "revision_recommendations": []}), 200
        doc_id = latest['id']
        
    topic_perf = get_topic_performance(doc_id, user_id=user_id)
    weak_topics = [t for t in topic_perf if t['is_weak']]
    
    revision_recommendations = []
    for wt in weak_topics:
        revision_recommendations.append({
            "topic_name": wt['topic_name'],
            "accuracy": wt['accuracy'],
            "recommendation": f"Revise key notes for '{wt['topic_name']}'. Current accuracy: {wt['accuracy']}%."
        })
        
    return jsonify({
        "weak_topics": weak_topics,
        "revision_recommendations": revision_recommendations
    }), 200
