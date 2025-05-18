from flask import Flask
from flask_cors import CORS

from .routes import main

def create_app():
    app = Flask(__name__)
    app.register_blueprint(main)
    CORS(app)
    return app