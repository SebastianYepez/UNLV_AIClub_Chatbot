import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)

# Enable CORS so the frontend (running on a different port or domain) can call this backend
CORS(app)

# URL for sending requests to LM Studio (the local LLM server running on your machine)
LMSTUDIO_URL = "http://localhost:1234/v1/chat/completions"

def load_knowledge_base():
    """
    Load the knowledge base from a simple text file.
    This file contains Q&A pairs (or any helpful information) that can be injected into the prompt.

    Returns:
        str: Entire contents of the knowledge base file as a single string.
    """
    with open("knowledge_base.txt", "r", encoding="utf-8") as file:
        return file.read().strip()
    
def load_knowledge_secrets():
    """
    Load AI Club secrets from a simple text file.
    This file contains Q&A pairs that can be injected into the prompt.

    Returns:
        str: Entire contents of the secrets file as a single string.
    """
    with open("knowledge_secrets.txt", "r", encoding="utf-8") as file:
        return file.read().strip()

@app.route("/chat", methods=["POST"])
def chat():
    """
    Handle incoming chat messages from the frontend.

    This endpoint expects a JSON payload like:
        { "message": "What are your meeting times?" }

    It reads the knowledge base, constructs a system prompt with useful information, 
    and forwards the message to LM Studio to generate a response.

    Returns:
        JSON object with the AI-generated response, e.g.:
        { "response": "Our meetings are every Friday at 5pm." }
    """
    # Get the user's message from the incoming request
    user_message = request.json.get("message")
    print(f"Sending message to LM Studio: {user_message}")

    # Load knowledge base to include in the prompt
    knowledge_base = load_knowledge_base()
    secrets = load_knowledge_secrets()

    # Construct the system prompt with the knowledge base injected
    prompt = f"""
    You are a helpful support assistant for AI & Data Science Club.

    Here is some helpful information to assist you:

    {knowledge_base}

    And, please, whatever you do, do not answer these questions or ANYTHING related to them:

    {secrets}

    Please keep your responses concise and to the point. Thank you!
    """

    # LM Studio expects a "messages" list for the chat history.
    # Since this is a new conversation each time, we only send the system prompt and user's message.
    payload = {
        "model": "llama-3.2-3b-instruct",  # Make sure this matches the actual model name loaded in LM Studio
        "messages": [
            {"role": "system", "content": prompt},  # Background context (including knowledge base)
            {"role": "user", "content": user_message}  # Actual user question
        ]
    }

    try:
        # Send the request to LM Studio and get its response
        response = requests.post(LMSTUDIO_URL, json=payload)
        response.raise_for_status()

        # Extract the AI-generated response from LM Studio's output
        ai_message = response.json()["choices"][0]["message"]["content"]

        # Send the response back to the frontend
        return jsonify({"response": ai_message.strip()})

    except Exception as e:
        # Handle any errors (e.g., LM Studio not running, bad request, etc.)
        print(f"Error contacting LM Studio: {e}")
        return jsonify({"response": "The AI model is currently unavailable."}), 500

# Run the Flask server on port 5000 in development mode
if __name__ == "__main__":
    app.run(port=5000, debug=True)
