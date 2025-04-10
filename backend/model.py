from flask import Flask, request, jsonify
from openai import OpenAI
from flask_cors import CORS
from dotenv import load_dotenv
import os
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import json

PORT = 8001

app = Flask(__name__)
CORS(app)

# File path to store chat data
CHAT_DATA_FILE = 'chat_data.json'

# Define the models that we can use
MODEL = {
    'GPT-3.5-TURBO': "gpt-3.5-turbo",
    'GPT-4': "gpt-4",
}

# Setup rate limiter
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["100 per day", "25 per hour"]
)

# Load environment variables and setup OpenAI client
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("API key not found. Please check your .env file.")
client = OpenAI(api_key=api_key)

# Helper function to read chat data from JSON
def read_chat_data():
    if os.path.exists(CHAT_DATA_FILE):
        with open(CHAT_DATA_FILE, 'r') as file:
            return json.load(file)
    else: 
        # Create the file if it doesn't exist
        with open(CHAT_DATA_FILE, 'w') as file:
            json.dump([], file)
        
    return []

# Helper function to write chat data to JSON
def write_chat_data(data):
    with open(CHAT_DATA_FILE, 'w') as file:
        json.dump(data, file, indent=2)

# API endpoint to get chat data
@app.route('/api/chat', methods=['GET'])
def get_chat_history():
    try:
        chat_history = read_chat_data()
        return jsonify({"messages": chat_history})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
        

# API endpoint to send a message and get AI response
@app.route('/api/chat', methods=['POST'])
@limiter.limit("10 per minute")  # Adjust this limit as needed
def chat():
    user_message = request.json.get('message')
    
    try:
        #Load previous chat data
        chat_data = read_chat_data()
    #    print('chat_data: ', chat_data)

        # Add user message to chat data
        chat_data.append({"role": "user", "content": user_message})

        response = client.chat.completions.create(
            model=MODEL['GPT-3.5-TURBO'],
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": user_message}
            ],
            max_tokens=500
        )
        
        ai_message = response.choices[0].message.content.strip()
    #    print('ai_message:', ai_message)

        # Add AI message to chat data
        chat_data.append({"role": "ai", "content": ai_message})

        # Save chat data
        write_chat_data(chat_data)
    #    print('Write successfully')

        return jsonify({"message": ai_message})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# API endpoint to clear chat history
@app.route('/api/chat', methods=['DELETE'])
def clear_chat_history():
    try:
        # Clear chat history by overwriting the file with an empty array
        write_chat_data([])
        return jsonify({"message": "Chat history cleared."})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=PORT)