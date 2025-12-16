import React, { useState } from 'react';

const ChatInput = ({ onSend, disabled }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form className="chat-input-form" onSubmit={handleSubmit}>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Describe your health concern or ask for recipe advice..."
        className="chat-input"
        rows="2"
        disabled={disabled}
      />
      <button
        type="submit"
        className="btn-send"
        disabled={!message.trim() || disabled}
      >
        Send
      </button>
    </form>
  );
};

export default ChatInput;
