from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os

app = Flask(__name__)
CORS(app)  # Allow CORS for all domains

genai.configure('AIzaSyAEAh4mufNHAh_FiMwD_4nE8xng8Elll6w')

model = genai.GenerativeModel('gemini-1.5-flash')

@app.route("/gemini", methods=['POST'])
def get_gemini_response():
    try:
        data = request.get_json()
        prompt = data.get('prompt')
        history = data.get('history')
        
        chat = model.start_chat(
            history
        )
        
        print('prompt:', prompt)
        return jsonify({'response': 'this is the response'})
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run()
