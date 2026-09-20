import json
from database import get_db

def create_document(filename, original_name, page_count, char_count, user_id=1):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        '''INSERT INTO documents (user_id, filename, original_name, page_count, char_count)
           VALUES (?, ?, ?, ?, ?)''',
        (user_id, filename, original_name, page_count, char_count)
    )
    doc_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return doc_id

def get_document(doc_id, user_id=None):
    conn = get_db()
    cursor = conn.cursor()
    if user_id:
        cursor.execute('SELECT * FROM documents WHERE id = ? AND user_id = ?', (doc_id, user_id))
    else:
        cursor.execute('SELECT * FROM documents WHERE id = ?', (doc_id,))
    doc = cursor.fetchone()
    conn.close()
    return dict(doc) if doc else None

def get_latest_document(user_id=1):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM documents WHERE user_id = ? ORDER BY id DESC LIMIT 1', (user_id,))
    doc = cursor.fetchone()
    conn.close()
    return dict(doc) if doc else None

def get_all_documents(user_id=1):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM documents WHERE user_id = ? ORDER BY created_at DESC', (user_id,))
    docs = cursor.fetchall()
    conn.close()
    return [dict(d) for d in docs]

def save_topics(doc_id, topics, user_id=1):
    conn = get_db()
    cursor = conn.cursor()
    saved = []
    for top in topics:
        key_points = top.get('key_points', [])
        if isinstance(key_points, list):
            key_points_str = json.dumps(key_points)
        else:
            key_points_str = str(key_points or '')

        cursor.execute(
            '''INSERT INTO topics (
                document_id, user_id, title, summary, importance, description,
                simple_explanation, detailed_explanation, example, key_points, exam_tip, memory_tip
               ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
            (
                doc_id,
                user_id,
                top.get('title'),
                top.get('summary', top.get('description', '')),
                top.get('importance', 'Medium'),
                top.get('description', ''),
                top.get('simple_explanation', ''),
                top.get('detailed_explanation', top.get('description', '')),
                top.get('example', ''),
                key_points_str,
                top.get('exam_tip', ''),
                top.get('memory_tip', '')
            )
        )
        saved.append({
            'id': cursor.lastrowid,
            'document_id': doc_id,
            'user_id': user_id,
            'title': top.get('title'),
            'summary': top.get('summary', top.get('description', '')),
            'importance': top.get('importance', 'Medium'),
            'description': top.get('description', ''),
            'simple_explanation': top.get('simple_explanation', ''),
            'detailed_explanation': top.get('detailed_explanation', top.get('description', '')),
            'example': top.get('example', ''),
            'key_points': key_points if isinstance(key_points, list) else [],
            'exam_tip': top.get('exam_tip', ''),
            'memory_tip': top.get('memory_tip', '')
        })
    conn.commit()
    conn.close()
    return saved

def get_topics_by_doc(doc_id, user_id=None):
    conn = get_db()
    cursor = conn.cursor()
    if user_id:
        cursor.execute('SELECT * FROM topics WHERE document_id = ? AND user_id = ?', (doc_id, user_id))
    else:
        cursor.execute('SELECT * FROM topics WHERE document_id = ?', (doc_id,))
    topics = cursor.fetchall()
    conn.close()
    
    result = []
    for t in topics:
        td = dict(t)
        if td.get('key_points'):
            try:
                td['key_points'] = json.loads(td['key_points'])
            except Exception:
                td['key_points'] = [td['key_points']]
        else:
            td['key_points'] = []
        result.append(td)
    return result

def save_flashcards(doc_id, flashcards, user_id=1):
    conn = get_db()
    cursor = conn.cursor()
    saved = []
    for fc in flashcards:
        cursor.execute(
            '''INSERT INTO flashcards (document_id, user_id, question, answer, topic_name, difficulty, status)
               VALUES (?, ?, ?, ?, ?, ?, ?)''',
            (
                doc_id,
                user_id,
                fc.get('question'),
                fc.get('answer'),
                fc.get('topic_name', 'General'),
                fc.get('difficulty', 'Medium'),
                fc.get('status', 'new')
            )
        )
        saved.append({
            'id': cursor.lastrowid,
            'document_id': doc_id,
            'user_id': user_id,
            'question': fc.get('question'),
            'answer': fc.get('answer'),
            'topic_name': fc.get('topic_name', 'General'),
            'difficulty': fc.get('difficulty', 'Medium'),
            'status': fc.get('status', 'new')
        })
    conn.commit()
    conn.close()
    return saved

def get_flashcards_by_doc(doc_id, user_id=None, limit=None, difficulty=None):
    conn = get_db()
    cursor = conn.cursor()
    
    query = 'SELECT * FROM flashcards WHERE document_id = ?'
    params = [doc_id]
    
    if user_id:
        query += ' AND user_id = ?'
        params.append(user_id)
        
    if difficulty and difficulty != 'Mixed':
        query += ' AND difficulty = ?'
        params.append(difficulty)
        
    query += ' ORDER BY id ASC'
    
    if limit and isinstance(limit, int) and limit > 0:
        query += ' LIMIT ?'
        params.append(limit)
        
    cursor.execute(query, tuple(params))
    cards = cursor.fetchall()
    
    # Fallback if filtered difficulty returns 0 cards
    if not cards and difficulty and difficulty != 'Mixed':
        fallback_query = 'SELECT * FROM flashcards WHERE document_id = ?'
        fallback_params = [doc_id]
        if user_id:
            fallback_query += ' AND user_id = ?'
            fallback_params.append(user_id)
        fallback_query += ' ORDER BY id ASC'
        if limit:
            fallback_query += ' LIMIT ?'
            fallback_params.append(limit)
        cursor.execute(fallback_query, tuple(fallback_params))
        cards = cursor.fetchall()

    conn.close()
    return [dict(c) for c in cards]

def update_flashcard_status(card_id, status, user_id=None):
    conn = get_db()
    cursor = conn.cursor()
    if user_id:
        cursor.execute('UPDATE flashcards SET status = ? WHERE id = ? AND user_id = ?', (status, card_id, user_id))
    else:
        cursor.execute('UPDATE flashcards SET status = ? WHERE id = ?', (status, card_id))
    conn.commit()
    conn.close()
    return True

def save_questions(doc_id, questions, user_id=1):
    conn = get_db()
    cursor = conn.cursor()
    saved = []
    for q in questions:
        cursor.execute(
            '''INSERT INTO questions (document_id, user_id, question, option_a, option_b, option_c, option_d, correct_option, explanation, topic_name)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
            (
                doc_id,
                user_id,
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
            'user_id': user_id,
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

def get_questions_by_doc(doc_id, user_id=None, limit=None, difficulty=None):
    conn = get_db()
    cursor = conn.cursor()
    
    query = 'SELECT * FROM questions WHERE document_id = ?'
    params = [doc_id]
    
    if user_id:
        query += ' AND user_id = ?'
        params.append(user_id)
        
    query += ' ORDER BY id ASC'
    
    if limit and isinstance(limit, int) and limit > 0:
        query += ' LIMIT ?'
        params.append(limit)
        
    cursor.execute(query, tuple(params))
    questions = cursor.fetchall()
    conn.close()
    return [dict(q) for q in questions]

def save_quiz_attempt(doc_id, total_questions, correct_answers, incorrect_answers, score_percentage, answers_data, user_id=1):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        '''INSERT INTO quiz_attempts (document_id, user_id, total_questions, correct_answers, incorrect_answers, score_percentage)
           VALUES (?, ?, ?, ?, ?, ?)''',
        (doc_id, user_id, total_questions, correct_answers, incorrect_answers, score_percentage)
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

def get_latest_quiz_attempt(doc_id, user_id=None):
    conn = get_db()
    cursor = conn.cursor()
    if user_id:
        cursor.execute(
            'SELECT * FROM quiz_attempts WHERE document_id = ? AND user_id = ? ORDER BY created_at DESC LIMIT 1',
            (doc_id, user_id)
        )
    else:
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

def get_topic_performance(doc_id, user_id=None):
    latest = get_latest_quiz_attempt(doc_id, user_id)
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
