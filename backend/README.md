# Backend - AI & Data Science Chatbot Workshop

This is the backend server for the chatbot. It connects to LM Studio running locally.

## Setup
1. Navigate into the `backend/` folder.
2. Install Python dependencies:
    pip install -r requirements.txt

    - Make a python venv if needed: refer here if needed https://sebastianyepez.github.io/Project_Webpages/ai_workshops/#/workshop1

    MacOS/Linux
    ```bash
        python3 -m venv chatenv
        source chatenv/bin/activate
    ```

    Windows
    ```powershell
        python -m venv chatenv 		
        chatenv\Scripts\Activate 
    ```

    Then...
    ```bash
        pip install -r requirements.txt
    ```

3. Start the backend:
    python app.py

4. Make sure LM Studio is running and the model `llama-3.2-3b-instruct` is **loaded**.

5. Flask will be running at:
    http://localhost:5000/chat

The frontend will send messages to this endpoint.