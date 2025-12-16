import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const RecipeDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const recipe = location.state?.recipe;

  if (!recipe) {
    return (
      <div className="recipe-detail-page">
        <div className="page-header">
          <button className="btn-back" onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>
        <div className="error-message">
          <p>Recipe not found. Please go back and select a recipe.</p>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const shareText = `Check out this recipe: ${recipe.name}\n\nIngredients:\n${[
      ...(recipe.ingredients_used || []),
      ...(recipe.missing_ingredients || [])
    ].join('\n')}\n\nMade with FridgeChef AI`;

    if (navigator.share) {
      navigator.share({
        title: recipe.name,
        text: shareText,
      }).catch(err => console.log('Share cancelled'));
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Recipe copied to clipboard!');
    }
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      Easy: '#10b981',
      Medium: '#f59e0b',
      Hard: '#ef4444',
    };
    return colors[difficulty] || '#6b7280';
  };

  return (
    <div className="recipe-detail-page">
      <div className="page-header no-print">
        <button className="btn-back" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div className="header-actions">
          <button className="btn-icon" onClick={handlePrint} title="Print recipe">
            🖨️
          </button>
          <button className="btn-icon" onClick={handleShare} title="Share recipe">
            📤
          </button>
        </div>
      </div>

      <div className="recipe-detail-content">
        <div className="recipe-header">
          <h1 className="recipe-name">{recipe.name}</h1>
          <div className="recipe-badges">
            <span className="cuisine-badge">{recipe.cuisine}</span>
            <span
              className="difficulty-badge"
              style={{ backgroundColor: getDifficultyColor(recipe.difficulty) }}
            >
              {recipe.difficulty}
            </span>
          </div>
        </div>

        <div className="recipe-meta-info">
          <div className="meta-info-item">
            <span className="meta-icon">⏱️</span>
            <div>
              <strong>Cooking Time</strong>
              <p>{recipe.cooking_time} minutes</p>
            </div>
          </div>
          {recipe.nutritional_notes && (
            <div className="meta-info-item">
              <span className="meta-icon">💚</span>
              <div>
                <strong>Nutritional Highlights</strong>
                <p>{recipe.nutritional_notes}</p>
              </div>
            </div>
          )}
          {recipe.health_benefits && (
            <div className="meta-info-item">
              <span className="meta-icon">🌿</span>
              <div>
                <strong>Health Benefits</strong>
                <p>{recipe.health_benefits}</p>
              </div>
            </div>
          )}
        </div>

        <div className="recipe-section">
          <h2>Ingredients</h2>

          {recipe.ingredients_used && recipe.ingredients_used.length > 0 && (
            <div className="ingredients-group">
              <h3 className="ingredients-group-title">
                ✅ Ingredients You Have
              </h3>
              <ul className="ingredients-list">
                {recipe.ingredients_used.map((ingredient, index) => (
                  <li key={index} className="ingredient-item-detail">
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {recipe.missing_ingredients && recipe.missing_ingredients.length > 0 && (
            <div className="ingredients-group">
              <h3 className="ingredients-group-title missing">
                🛒 Ingredients to Buy
              </h3>
              <ul className="ingredients-list">
                {recipe.missing_ingredients.map((ingredient, index) => (
                  <li key={index} className="ingredient-item-detail missing">
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="recipe-section">
          <h2>Instructions</h2>
          <ol className="instructions-list">
            {recipe.steps && recipe.steps.length > 0 ? (
              recipe.steps.map((step, index) => (
                <li key={index} className="instruction-step">
                  <span className="step-number">{index + 1}</span>
                  <p className="step-text">{step}</p>
                </li>
              ))
            ) : (
              <li className="instruction-step">
                <p>No instructions available for this recipe.</p>
              </li>
            )}
          </ol>
        </div>

        {recipe.tips && (
          <div className="recipe-section tips-section">
            <h2>Chef's Tips 👨‍🍳</h2>
            <div className="tips-content">
              {Array.isArray(recipe.tips) ? (
                <ul>
                  {recipe.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              ) : (
                <p>{recipe.tips}</p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="recipe-actions no-print">
        <button className="btn-secondary" onClick={() => navigate(-1)}>
          ← Back to Recipes
        </button>
      </div>
    </div>
  );
};

export default RecipeDetailPage;
