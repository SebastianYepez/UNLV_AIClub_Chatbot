import React, { useState, useRef, useEffect } from "react";
import './chatbot.css'; // Import chatbot-specific styles
import logo from './logo.jpg'; // Import the chatbot logo image

/**
 * Chatbot Component
 * This component handles the user interface and message flow for the AI & Data Science Club Chatbot.
 */
function Chatbot() {
    // State to hold all chat messages (both user and bot)
    const [messages, setMessages] = useState([
        { sender: "bot", text: "Hello! 👋 I'm the AI & Data Science Club Bot. How can I help you today?" }
    ]);

    // State to track the current input value (what the user is typing)
    const [input, setInput] = useState("");

    // State to track whether we are waiting for a response from the backend
    const [waitingForResponse, setWaitingForResponse] = useState(false);

    // Ref for the textarea so we can auto-resize it based on content
    const textareaRef = useRef(null);

    /**
     * useEffect - Runs after each render, adjusts the textarea height to fit its content.
     * This creates the "auto-expand" effect when the user types multiple lines.
     */
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [input]);  // Re-run this effect whenever `input` changes

    /**
     * handleSendMessage - Called when the user sends a message (either by pressing Enter or clicking Send).
     * This sends the user's message to the backend Flask API, updates the message list, and handles the bot's response.
     */
    const handleSendMessage = async () => {
        if (input.trim() === "") return;  // Don't send empty messages

        // Add the user's message to the chat history
        const userMessage = { sender: "user", text: input };
        setMessages(prev => [...prev, userMessage, { sender: "bot", text: "Thinking..." }]);

        // Clear the input field
        setInput("");
        setWaitingForResponse(true);  // Show the "Waiting..." state in the UI

        try {
            // Send the message to the Flask backend
            const response = await fetch("http://127.0.0.1:5000/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: input }),
            });

            // Parse the response from the backend
            const data = await response.json();

            // Replace the "Thinking..." message with the actual bot response
            setMessages(prev => [
                ...prev.slice(0, prev.length - 1),
                { sender: "bot", text: data.response }
            ]);
        } catch (error) {
            console.error("Error sending message:", error);

            // Replace "Thinking..." with an error message if the fetch fails
            setMessages(prev => [
                ...prev.slice(0, prev.length - 1),
                { sender: "bot", text: "Oops! Something went wrong. Please be sure the Flask app is running, as well as LM Studio." }
            ]);
        } finally {
            setWaitingForResponse(false);  // Re-enable the input after response arrives
        }
    };

    /**
     * handleKeyDown - Allows the user to press Enter to send a message.
     * Shift+Enter allows for adding a newline instead.
     */
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Render the full chatbot UI
    return (
        <div className="chatbot-page">
            <div className="chat-container">
                {/* Header with logo and title */}
                <header className="chat-header">
                    <img src={logo} alt="Chatbot Logo" className="chat-logo" />
                    <h3>AI & Data Science Chatbot</h3>
                    <img src={logo} alt="Chatbot Logo" className="chat-logo" />
                </header>

                {/* Message display area */}
                <div className="chat-box">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.sender}`}>
                            <div className="message-text">{msg.text}</div>
                        </div>
                    ))}
                </div>

                {/* Input area with growing textarea and send button */}
                <div className="input-area">
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message..."
                        className="chat-textarea"
                        rows={1}
                        disabled={waitingForResponse}
                    />
                    <button onClick={handleSendMessage} className="send-button" disabled={waitingForResponse}>
                        {waitingForResponse ? "Waiting..." : "Send"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Chatbot;
