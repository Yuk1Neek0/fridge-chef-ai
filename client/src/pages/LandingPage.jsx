import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: '📸',
      title: 'AI Image Recognition',
      description: 'Upload a photo of your fridge and let AI identify all ingredients'
    },
    {
      icon: '🍳',
      title: 'Smart Recipe Matching',
      description: 'Get personalized recipes based on what you already have'
    },
    {
      icon: '💚',
      title: 'Therapeutic Recommendations',
      description: 'Receive health-focused meal suggestions for your specific needs'
    },
    {
      icon: '🌍',
      title: 'Global Cuisines',
      description: 'Explore recipes from Chinese, Italian, Japanese, and more'
    }
  ];

  return (
    <div className="landing-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="title-main">FridgeChef AI</span>
            <span className="title-emoji">🥘</span>
          </h1>
          <p className="hero-tagline">
            Transform your fridge into therapeutic, delicious meals
          </p>
          <button
            className="btn-cta"
            onClick={() => navigate('/upload')}
          >
            📷 Upload Fridge Photo
          </button>
          <p className="hero-hint">
            No account needed • Free to use • AI-powered
          </p>
        </div>
      </div>

      <div className="features-section">
        <h2 className="features-title">How It Works</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="cta-section">
        <h2>Ready to Get Started?</h2>
        <p>Turn your ingredients into amazing meals in minutes</p>
        <button
          className="btn-cta-secondary"
          onClick={() => navigate('/upload')}
        >
          Start Cooking Now
        </button>
      </div>

      <footer className="landing-footer">
        <p>Powered by Claude AI • Made with ❤️ for home cooks</p>
      </footer>
    </div>
  );
};

export default LandingPage;
