import sqlite3
import os
from config import DATABASE_PATH

def get_db():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    # Documents table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS documents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT NOT NULL,
            original_name TEXT NOT NULL,
            page_count INTEGER DEFAULT 1,
            char_count INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Topics table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS topics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            document_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            FOREIGN KEY (document_id) REFERENCES documents (id) ON DELETE CASCADE
        )
    ''')
    
    # Flashcards table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS flashcards (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            document_id INTEGER NOT NULL,
            topic_id INTEGER,
            question TEXT NOT NULL,
            answer TEXT NOT NULL,
            topic_name TEXT,
            FOREIGN KEY (document_id) REFERENCES documents (id) ON DELETE CASCADE
        )
    ''')
    
    # Questions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS questions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            document_id INTEGER NOT NULL,
            topic_id INTEGER,
            question TEXT NOT NULL,
            option_a TEXT NOT NULL,
            option_b TEXT NOT NULL,
            option_c TEXT NOT NULL,
            option_d TEXT NOT NULL,
            correct_option TEXT NOT NULL,
            explanation TEXT,
            topic_name TEXT,
            FOREIGN KEY (document_id) REFERENCES documents (id) ON DELETE CASCADE
        )
    ''')
    
    # Quiz attempts table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS quiz_attempts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            document_id INTEGER NOT NULL,
            total_questions INTEGER NOT NULL,
            correct_answers INTEGER NOT NULL,
            incorrect_answers INTEGER NOT NULL,
            score_percentage REAL NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (document_id) REFERENCES documents (id) ON DELETE CASCADE
        )
    ''')
    
    # Quiz answers table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS quiz_answers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            attempt_id INTEGER NOT NULL,
            question_id INTEGER NOT NULL,
            topic_name TEXT NOT NULL,
            selected_option TEXT NOT NULL,
            is_correct INTEGER NOT NULL,
            FOREIGN KEY (attempt_id) REFERENCES quiz_attempts (id) ON DELETE CASCADE,
            FOREIGN KEY (question_id) REFERENCES questions (id) ON DELETE CASCADE
        )
    ''')
    
    conn.commit()
    conn.close()

if __name__ == '__main__':
    init_db()
    print("Database initialized successfully.")
