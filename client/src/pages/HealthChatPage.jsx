import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { sendHealthChatMessage } from '../services/api';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import LoadingSpinner from '../components/LoadingSpinner';

const HealthChatPage = () => {
  const navigate = useNavigate();
  const {
    detectedIngredients,
    chatHistory,
    addChatMessage,
  } = useApp();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showIngredients, setShowIngredients] = useState(false);
  const chatEndRef = useRef(null);

  const quickPrompts = [
    { text: 'Lower back pain', emoji: '🦴' },
    { text: 'Fatigue / Low energy', emoji: '😴' },
    { text: 'Digestive issues', emoji: '🫃' },
    { text: 'Stress / Anxiety', emoji: '😰' },
    { text: 'Poor sleep', emoji: '🌙' },
    { text: 'General wellness', emoji: '✨' },
  ];

  useEffect(() => {
    // Redirect if no ingredients
    if (detectedIngredients.length === 0) {
      navigate('/upload');
      return;
    }

    // Add initial AI greeting if chat is empty
    if (chatHistory.length === 0) {
      addChatMessage(
        'assistant',
        "Hi! I'm your therapeutic cooking assistant. I can recommend recipes based on your health needs using the ingredients you have. What's bothering you today, or what health goal would you like to work towards?"
      );
    }
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoading]);

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    // Add user message to chat
    addChatMessage('user', message);
    setError(null);
    setIsLoading(true);

    try {
      // Prepare messages for API (include all chat history)
      const messages = [...chatHistory, { role: 'user', content: message }];

      // Send to API
      const response = await sendHealthChatMessage(messages, detectedIngredients);

      // Add AI response to chat
      addChatMessage('assistant', response.response);

      // If there are embedded recipes, they'll be displayed by ChatMessage component

    } catch (err) {
      setError(err.message);
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (promptText) => {
    handleSendMessage(promptText);
  };

  return (
    <div className="health-chat-page">
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate('/mode-selector')}>
          ← Back
        </button>
        <h1>Health Assistant</h1>
        <button className="btn-switch" onClick={() => navigate('/recipe-browser')}>
          🍳 Switch to Recipe Browser
        </button>
      </div>

      <div className="chat-container">
        <div className="ingredients-panel">
          <button
            className="ingredients-toggle"
            onClick={() => setShowIngredients(!showIngredients)}
          >
            <span>Your Ingredients ({detectedIngredients.length})</span>
            <span>{showIngredients ? '▲' : '▼'}</span>
          </button>
          {showIngredients && (
            <div className="ingredients-list-compact">
              {detectedIngredients.map((ing, index) => (
                <span key={index} className="ingredient-chip">
                  {typeof ing === 'string' ? ing : ing.name}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="chat-messages">
          {chatHistory.map((message, index) => {
            // Check if this assistant message has embedded recipes
            const recipeMatches = message.role === 'assistant'
              ? [...message.content.matchAll(/RECIPE_START\s*([\s\S]*?)\s*RECIPE_END/g)]
              : [];

            const recipes = recipeMatches.map(match => {
              try {
                return JSON.parse(match[1]);
              } catch (e) {
                return null;
              }
            }).filter(Boolean);

            return (
              <ChatMessage
                key={index}
                message={message}
                recipes={recipes}
              />
            );
          })}

          {isLoading && (
            <div className="chat-loading">
              <LoadingSpinner message="Thinking..." />
            </div>
          )}

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <p>{error}</p>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {chatHistory.length === 1 && !isLoading && (
          <div className="quick-prompts">
            <p className="quick-prompts-label">Quick suggestions:</p>
            <div className="quick-prompts-grid">
              {quickPrompts.map((prompt, index) => (
                <button
                  key={index}
                  className="quick-prompt-btn"
                  onClick={() => handleQuickPrompt(prompt.text)}
                >
                  <span className="prompt-emoji">{prompt.emoji}</span>
                  <span className="prompt-text">{prompt.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="chat-input-container">
          <ChatInput onSend={handleSendMessage} disabled={isLoading} />
        </div>

        <div className="medical-disclaimer">
          <p>
            <strong>Medical Disclaimer:</strong> This assistant provides general nutritional
            information and should not replace professional medical advice. Consult a
            healthcare provider for specific health concerns.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HealthChatPage;
