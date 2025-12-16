import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const ModeSelectorPage = () => {
  const navigate = useNavigate();
  const { detectedIngredients, clearChat } = useApp();

  React.useEffect(() => {
    // Redirect if no ingredients
    if (detectedIngredients.length === 0) {
      navigate('/upload');
    }
  }, [detectedIngredients, navigate]);

  const handleRecipeBrowser = () => {
    navigate('/recipe-browser');
  };

  const handleHealthChat = () => {
    clearChat(); // Clear previous chat history
    navigate('/health-chat');
  };

  return (
    <div className="mode-selector-page">
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate('/upload')}>
          ← Back
        </button>
        <h1>Choose Your Path</h1>
      </div>

      <div className="mode-cards">
        <div className="mode-card" onClick={handleRecipeBrowser}>
          <div className="mode-icon">🍳</div>
          <h2 className="mode-title">Browse Recipes</h2>
          <p className="mode-description">
            Get recipe ideas filtered by cuisine type. Perfect for exploring different cooking styles.
          </p>
          <div className="mode-features">
            <div className="feature-item">✓ Multiple cuisine options</div>
            <div className="feature-item">✓ Filter by difficulty & time</div>
            <div className="feature-item">✓ Ingredient matching</div>
          </div>
          <button className="btn-mode">Explore Recipes →</button>
        </div>

        <div className="mode-card" onClick={handleHealthChat}>
          <div className="mode-icon">💚</div>
          <h2 className="mode-title">Health Assistant</h2>
          <p className="mode-description">
            Chat for therapeutic recipe recommendations based on your health needs.
          </p>
          <div className="mode-features">
            <div className="feature-item">✓ Personalized suggestions</div>
            <div className="feature-item">✓ Evidence-based nutrition</div>
            <div className="feature-item">✓ Address specific concerns</div>
          </div>
          <button className="btn-mode">Start Chat →</button>
        </div>
      </div>

      <div className="ingredients-summary">
        <p>
          <strong>{detectedIngredients.length} ingredients</strong> detected and ready to use
        </p>
      </div>
    </div>
  );
};

export default ModeSelectorPage;
