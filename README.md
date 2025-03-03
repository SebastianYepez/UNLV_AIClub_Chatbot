# AI & Data Science Chatbot Workshop

Welcome to the AI & Data Science Club Chatbot Workshop!

## Structure
- `frontend/` - React frontend (chat UI)
- `backend/` - Flask backend (handles messages, talks to LM Studio)

## Prerequisites
- Python 3.10+ (for backend)
- Node.js 18+ (for frontend)
- LM Studio (for hosting the AI model)

## Quickstart
1. Install & start backend (Flask):
    cd backend
    pip install -r requirements.txt
    python app.py
    - (may need to make a virtual environment)

2. Start frontend (React):
    cd frontend
    npm install
    npm start

3. Make sure LM Studio is running and has `llama-3.2-3b-instruct` model loaded.

4. Open the chatbot in your browser at:
    http://localhost:3000