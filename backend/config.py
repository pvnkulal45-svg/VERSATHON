import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
DATABASE_PATH = os.path.join(BASE_DIR, 'app.db')
MAX_CONTENT_LENGTH = 50 * 1024 * 1024  # 50 MB max file size
ALLOWED_EXTENSIONS = {'pdf', 'txt'}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
