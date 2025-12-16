import React from 'react';
import { useNavigate } from 'react-router-dom';

const RecipeCard = ({ recipe, ingredients }) => {
  const navigate = useNavigate();

  const getDifficultyColor = (difficulty) => {
    const colors = {
      Easy: '#10b981',
      Medium: '#f59e0b',
      Hard: '#ef4444',
    };
    return colors[difficulty] || '#6b7280';
  };

  const ingredientsUsed = recipe.ingredients_used?.length || 0;
  const totalIngredients = ingredientsUsed + (recipe.missing_ingredients?.length || 0);
  const matchPercentage = totalIngredients > 0 ? Math.round((ingredientsUsed / totalIngredients) * 100) : 0;

  const handleViewRecipe = () => {
    navigate('/recipe-detail', { state: { recipe } });
  };

  return (
    <div className="recipe-card">
      <div className="recipe-card-header">
        <h3 className="recipe-title">{recipe.name}</h3>
        <span className="recipe-cuisine">{recipe.cuisine}</span>
      </div>

      <div className="recipe-meta">
        <div className="meta-item">
          <span className="meta-icon">⏱️</span>
          <span>{recipe.cooking_time} min</span>
        </div>
        <div className="meta-item">
          <span
            className="difficulty-badge"
            style={{ backgroundColor: getDifficultyColor(recipe.difficulty) }}
          >
            {recipe.difficulty}
          </span>
        </div>
      </div>

      <div className="ingredient-match">
        <div className="match-bar-container">
          <div
            className="match-bar-fill"
            style={{ width: `${matchPercentage}%` }}
          ></div>
        </div>
        <p className="match-text">
          Uses {ingredientsUsed}/{totalIngredients} ingredients ({matchPercentage}% match)
        </p>
      </div>

      {recipe.missing_ingredients && recipe.missing_ingredients.length > 0 && (
        <div className="missing-ingredients">
          <p className="missing-title">🛒 Need to buy:</p>
          <p className="missing-list">
            {recipe.missing_ingredients.slice(0, 3).join(', ')}
            {recipe.missing_ingredients.length > 3 && ` +${recipe.missing_ingredients.length - 3} more`}
          </p>
        </div>
      )}

      {recipe.health_benefits && (
        <div className="health-benefits">
          <p className="benefits-icon">💚</p>
          <p className="benefits-text">{recipe.health_benefits}</p>
        </div>
      )}

      <button className="btn-view-recipe" onClick={handleViewRecipe}>
        View Recipe
      </button>
    </div>
  );
};

export default RecipeCard;
