from database import get_db

def create_document(filename, original_name, page_count, char_count):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        '''INSERT INTO documents (filename, original_name, page_count, char_count)
           VALUES (?, ?, ?, ?)''',
        (filename, original_name, page_count, char_count)
    )
    doc_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return doc_id

def get_document(doc_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM documents WHERE id = ?', (doc_id,))
    doc = cursor.fetchone()
    conn.close()
    return dict(doc) if doc else None

def get_latest_document():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM documents ORDER BY id DESC LIMIT 1')
    doc = cursor.fetchone()
    conn.close()
    return dict(doc) if doc else None

def get_all_documents():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM documents ORDER BY created_at DESC')
    docs = cursor.fetchall()
    conn.close()
    return [dict(d) for d in docs]

def save_topics(doc_id, topics):
    """
    topics: list of dicts {'title': '...', 'description': '...'}
    """
    conn = get_db()
    cursor = conn.cursor()
    saved = []
    for top in topics:
        cursor.execute(
            '''INSERT INTO topics (document_id, title, description)
               VALUES (?, ?, ?)''',
            (doc_id, top.get('title'), top.get('description', ''))
        )
        saved.append({
            'id': cursor.lastrowid,
            'document_id': doc_id,
            'title': top.get('title'),
            'description': top.get('description', '')
        })
    conn.commit()
    conn.close()
    return saved

def get_topics_by_doc(doc_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM topics WHERE document_id = ?', (doc_id,))
    topics = cursor.fetchall()
    conn.close()
    return [dict(t) for t in topics]

def save_flashcards(doc_id, flashcards):
    """
    flashcards: list of dicts {'question': '...', 'answer': '...', 'topic_name': '...'}
    """
    conn = get_db()
    cursor = conn.cursor()
    saved = []
    for fc in flashcards:
        cursor.execute(
            '''INSERT INTO flashcards (document_id, question, answer, topic_name)
               VALUES (?, ?, ?, ?)''',
            (doc_id, fc.get('question'), fc.get('answer'), fc.get('topic_name', 'General'))
        )
        saved.append({
            'id': cursor.lastrowid,
            'document_id': doc_id,
            'question': fc.get('question'),
            'answer': fc.get('answer'),
            'topic_name': fc.get('topic_name', 'General')
        })
    conn.commit()
    conn.close()
    return saved

def get_flashcards_by_doc(doc_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM flashcards WHERE document_id = ?', (doc_id,))
    cards = cursor.fetchall()
    conn.close()
    return [dict(c) for c in cards]

def save_questions(doc_id, questions):
    """
    questions: list of dicts {
        'question': '...', 'option_a': '...', 'option_b': '...', 'option_c': '...', 'option_d': '...',
        'correct_option': 'A', 'explanation': '...', 'topic_name': '...'
    }
    """
    conn = get_db()
    cursor = conn.cursor()
    saved = []
    for q in questions:
        cursor.execute(
            '''INSERT INTO questions (document_id, question, option_a, option_b, option_c, option_d, correct_option, explanation, topic_name)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)''',
            (
                doc_id,
                q.get('question'),
                q.get('option_a'),
                q.get('option_b'),
                q.get('option_c'),
                q.get('option_d'),
                q.get('correct_option', 'A').upper(),
                q.get('explanation', ''),
                q.get('topic_name', 'General')
            )
        )
        saved.append({
            'id': cursor.lastrowid,
            'document_id': doc_id,
            'question': q.get('question'),
            'option_a': q.get('option_a'),
            'option_b': q.get('option_b'),
            'option_c': q.get('option_c'),
            'option_d': q.get('option_d'),
            'correct_option': q.get('correct_option', 'A').upper(),
            'explanation': q.get('explanation', ''),
            'topic_name': q.get('topic_name', 'General')
        })
    conn.commit()
    conn.close()
    return saved

def get_questions_by_doc(doc_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM questions WHERE document_id = ?', (doc_id,))
    questions = cursor.fetchall()
    conn.close()
    return [dict(q) for q in questions]

def save_quiz_attempt(doc_id, total_questions, correct_answers, incorrect_answers, score_percentage, answers_data):
    """
    answers_data: list of dicts {'question_id': 1, 'topic_name': '...', 'selected_option': 'B', 'is_correct': True}
    """
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        '''INSERT INTO quiz_attempts (document_id, total_questions, correct_answers, incorrect_answers, score_percentage)
           VALUES (?, ?, ?, ?, ?)''',
        (doc_id, total_questions, correct_answers, incorrect_answers, score_percentage)
    )
    attempt_id = cursor.lastrowid
    
    for ans in answers_data:
        cursor.execute(
            '''INSERT INTO quiz_answers (attempt_id, question_id, topic_name, selected_option, is_correct)
               VALUES (?, ?, ?, ?, ?)''',
            (
                attempt_id,
                ans.get('question_id'),
                ans.get('topic_name', 'General'),
                ans.get('selected_option'),
                1 if ans.get('is_correct') else 0
            )
        )
        
    conn.commit()
    conn.close()
    return attempt_id

def get_latest_quiz_attempt(doc_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        'SELECT * FROM quiz_attempts WHERE document_id = ? ORDER BY created_at DESC LIMIT 1',
        (doc_id,)
    )
    attempt = cursor.fetchone()
    if not attempt:
        conn.close()
        return None
    
    attempt_dict = dict(attempt)
    cursor.execute(
        'SELECT * FROM quiz_answers WHERE attempt_id = ?',
        (attempt_dict['id'],)
    )
    answers = cursor.fetchall()
    conn.close()
    attempt_dict['answers'] = [dict(a) for a in answers]
    return attempt_dict

def get_topic_performance(doc_id):
    """
    Calculates accuracy per topic across the latest quiz attempt.
    Returns: list of dicts [{'topic_name': '...', 'total': 5, 'correct': 2, 'accuracy': 40.0, 'is_weak': True}]
    Rule: accuracy < 60.0 => weak topic
    """
    latest = get_latest_quiz_attempt(doc_id)
    if not latest or not latest.get('answers'):
        return []
    
    topic_stats = {}
    for ans in latest['answers']:
        t_name = ans['topic_name']
        if t_name not in topic_stats:
            topic_stats[t_name] = {'total': 0, 'correct': 0}
        topic_stats[t_name]['total'] += 1
        if ans['is_correct']:
            topic_stats[t_name]['correct'] += 1
            
    result = []
    for t_name, stats in topic_stats.items():
        accuracy = (stats['correct'] / stats['total']) * 100.0 if stats['total'] > 0 else 0.0
        is_weak = accuracy < 60.0
        result.append({
            'topic_name': t_name,
            'total': stats['total'],
            'correct': stats['correct'],
            'accuracy': round(accuracy, 1),
            'is_weak': is_weak
        })
    return result
