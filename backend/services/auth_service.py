import os
import secrets
from werkzeug.security import generate_password_hash, check_password_hash
from database import get_db

class AuthError(Exception):
    pass

def register_user(name: str, email: str, password: str):
    name = (name or '').strip()
    email = (email or '').strip().lower()
    password = (password or '').strip()

    if not name or not email or not password:
        raise AuthError("Name, email, and password are required.")

    if len(password) < 6:
        raise AuthError("Password must be at least 6 characters long.")

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
    if cursor.fetchone():
        conn.close()
        raise AuthError("An account with this email address already exists.")

    password_hash = generate_password_hash(password)
    token = secrets.token_hex(24)

    cursor.execute(
        "INSERT INTO users (name, email, password_hash, token) VALUES (?, ?, ?, ?)",
        (name, email, password_hash, token)
    )
    user_id = cursor.lastrowid
    conn.commit()

    cursor.execute("SELECT id, name, email, created_at FROM users WHERE id = ?", (user_id,))
    user = dict(cursor.fetchone())
    conn.close()

    return {"user": user, "token": token}

def login_user(email: str, password: str):
    email = (email or '').strip().lower()
    password = (password or '').strip()

    if not email or not password:
        raise AuthError("Email and password are required.")

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    user_row = cursor.fetchone()

    if not user_row or not check_password_hash(user_row["password_hash"], password):
        conn.close()
        raise AuthError("Invalid email or password.")

    token = secrets.token_hex(24)
    cursor.execute("UPDATE users SET token = ? WHERE id = ?", (token, user_row["id"]))
    conn.commit()

    user = {
        "id": user_row["id"],
        "name": user_row["name"],
        "email": user_row["email"],
        "created_at": user_row["created_at"]
    }
    conn.close()

    return {"user": user, "token": token}

def get_user_from_token(token: str):
    if not token:
        return None

    # Strip 'Bearer ' if present
    if token.startswith("Bearer "):
        token = token[7:].strip()

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, email, created_at FROM users WHERE token = ?", (token,))
    user_row = cursor.fetchone()
    conn.close()

    return dict(user_row) if user_row else None
