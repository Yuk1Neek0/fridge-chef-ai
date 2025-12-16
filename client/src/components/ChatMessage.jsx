import React from 'react';
import RecipeCard from './RecipeCard';

const ChatMessage = ({ message, recipes }) => {
  const isUser = message.role === 'user';

  // Remove RECIPE_START and RECIPE_END markers from display
  const cleanContent = message.content.replace(/RECIPE_START[\s\S]*?RECIPE_END/g, '').trim();

  return (
    <div className={`chat-message ${isUser ? 'user-message' : 'assistant-message'}`}>
      <div className="message-avatar">
        {isUser ? '👤' : '🤖'}
      </div>
      <div className="message-content">
        <div className="message-text">
          {cleanContent.split('\n').map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
        {recipes && recipes.length > 0 && (
          <div className="message-recipes">
            {recipes.map((recipe, index) => (
              <RecipeCard key={index} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
