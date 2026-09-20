import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

import config
from database import init_db
from routes.api import api_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(config)
    
    # Enable CORS for frontend requests
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Initialize SQLite database
    with app.app_context():
        init_db()
        
    # Register API blueprint
    app.register_blueprint(api_bp, url_prefix='/api')
    
    return app

app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"Starting Learn From Your Notes backend on http://0.0.0.0:{port}")
    app.run(host='0.0.0.0', port=port, debug=True)
