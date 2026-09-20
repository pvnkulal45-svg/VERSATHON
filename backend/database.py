import sqlite3
import os
from config import DATABASE_PATH

def get_db():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def add_column_if_not_exists(cursor, table, column_def):
    col_name = column_def.split()[0]
    cursor.execute(f"PRAGMA table_info({table})")
    cols = [row[1] for row in cursor.fetchall()]
    if col_name not in cols:
        cursor.execute(f"ALTER TABLE {table} ADD COLUMN {column_def}")

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    # 1. Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            token TEXT UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # 2. Documents table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS documents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER DEFAULT 1,
            filename TEXT NOT NULL,
            original_name TEXT NOT NULL,
            page_count INTEGER DEFAULT 1,
            char_count INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
    ''')
    add_column_if_not_exists(cursor, 'documents', 'user_id INTEGER DEFAULT 1')
    
    # 3. Topics table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS topics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            document_id INTEGER NOT NULL,
            user_id INTEGER DEFAULT 1,
            title TEXT NOT NULL,
            summary TEXT,
            importance TEXT DEFAULT 'Medium',
            description TEXT,
            simple_explanation TEXT,
            detailed_explanation TEXT,
            example TEXT,
            key_points TEXT,
            exam_tip TEXT,
            memory_tip TEXT,
            FOREIGN KEY (document_id) REFERENCES documents (id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
    ''')
    add_column_if_not_exists(cursor, 'topics', 'user_id INTEGER DEFAULT 1')
    add_column_if_not_exists(cursor, 'topics', 'summary TEXT')
    add_column_if_not_exists(cursor, 'topics', "importance TEXT DEFAULT 'Medium'")
    add_column_if_not_exists(cursor, 'topics', 'simple_explanation TEXT')
    add_column_if_not_exists(cursor, 'topics', 'detailed_explanation TEXT')
    add_column_if_not_exists(cursor, 'topics', 'example TEXT')
    add_column_if_not_exists(cursor, 'topics', 'key_points TEXT')
    add_column_if_not_exists(cursor, 'topics', 'exam_tip TEXT')
    add_column_if_not_exists(cursor, 'topics', 'memory_tip TEXT')
    
    # 4. Flashcards table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS flashcards (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            document_id INTEGER NOT NULL,
            user_id INTEGER DEFAULT 1,
            topic_id INTEGER,
            question TEXT NOT NULL,
            answer TEXT NOT NULL,
            topic_name TEXT,
            difficulty TEXT DEFAULT 'Medium',
            status TEXT DEFAULT 'new',
            FOREIGN KEY (document_id) REFERENCES documents (id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
    ''')
    add_column_if_not_exists(cursor, 'flashcards', 'user_id INTEGER DEFAULT 1')
    add_column_if_not_exists(cursor, 'flashcards', "difficulty TEXT DEFAULT 'Medium'")
    add_column_if_not_exists(cursor, 'flashcards', "status TEXT DEFAULT 'new'")
    
    # 5. Questions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS questions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            document_id INTEGER NOT NULL,
            user_id INTEGER DEFAULT 1,
            topic_id INTEGER,
            question TEXT NOT NULL,
            option_a TEXT NOT NULL,
            option_b TEXT NOT NULL,
            option_c TEXT NOT NULL,
            option_d TEXT NOT NULL,
            correct_option TEXT NOT NULL,
            explanation TEXT,
            topic_name TEXT,
            FOREIGN KEY (document_id) REFERENCES documents (id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
    ''')
    add_column_if_not_exists(cursor, 'questions', 'user_id INTEGER DEFAULT 1')
    
    # 6. Quiz attempts table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS quiz_attempts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            document_id INTEGER NOT NULL,
            user_id INTEGER DEFAULT 1,
            total_questions INTEGER NOT NULL,
            correct_answers INTEGER NOT NULL,
            incorrect_answers INTEGER NOT NULL,
            score_percentage REAL NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (document_id) REFERENCES documents (id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
    ''')
    add_column_if_not_exists(cursor, 'quiz_attempts', 'user_id INTEGER DEFAULT 1')
    
    # 7. Quiz answers table
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
    print("Database initialized successfully with users and rich topic schemas.")
