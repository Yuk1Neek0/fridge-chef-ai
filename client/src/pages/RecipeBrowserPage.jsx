import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { generateRecipes } from '../services/api';
import CuisineFilter from '../components/CuisineFilter';
import RecipeCard from '../components/RecipeCard';
import LoadingSpinner from '../components/LoadingSpinner';

const RecipeBrowserPage = () => {
  const navigate = useNavigate();
  const {
    detectedIngredients,
    selectedCuisines,
    toggleCuisine,
    currentRecipes,
    setCurrentRecipes,
  } = useApp();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('match'); // match, time, difficulty

  useEffect(() => {
    // Redirect if no ingredients
    if (detectedIngredients.length === 0) {
      navigate('/upload');
      return;
    }

    // Auto-generate recipes on first load
    if (currentRecipes.length === 0) {
      handleGenerateRecipes();
    }
  }, []);

  const handleGenerateRecipes = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const recipes = await generateRecipes(detectedIngredients, selectedCuisines);
      setCurrentRecipes(recipes);
    } catch (err) {
      setError(err.message);
      console.error('Recipe generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCuisineChange = (cuisine) => {
    toggleCuisine(cuisine);
  };

  const getSortedRecipes = () => {
    if (!currentRecipes || currentRecipes.length === 0) return [];

    const sorted = [...currentRecipes];

    switch (sortBy) {
      case 'time':
        return sorted.sort((a, b) => (a.cooking_time || 0) - (b.cooking_time || 0));
      case 'difficulty':
        const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
        return sorted.sort((a, b) =>
          (difficultyOrder[a.difficulty] || 2) - (difficultyOrder[b.difficulty] || 2)
        );
      case 'match':
      default:
        return sorted.sort((a, b) => {
          const aMatch = (a.ingredients_used?.length || 0);
          const bMatch = (b.ingredients_used?.length || 0);
          return bMatch - aMatch;
        });
    }
  };

  const sortedRecipes = getSortedRecipes();

  return (
    <div className="recipe-browser-page">
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate('/mode-selector')}>
          ← Back
        </button>
        <h1>Browse Recipes</h1>
        <button className="btn-switch" onClick={() => navigate('/health-chat')}>
          💚 Switch to Health Chat
        </button>
      </div>

      <div className="browser-content">
        <div className="filters-section">
          <CuisineFilter
            selectedCuisines={selectedCuisines}
            onToggle={handleCuisineChange}
          />
          <button
            className="btn-regenerate"
            onClick={handleGenerateRecipes}
            disabled={isLoading}
          >
            {isLoading ? '⏳ Generating...' : '🔄 Regenerate Recipes'}
          </button>
        </div>

        {isLoading && <LoadingSpinner message="Finding delicious recipes for you..." />}

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <p>{error}</p>
            <button className="btn-retry" onClick={handleGenerateRecipes}>
              Try Again
            </button>
          </div>
        )}

        {!isLoading && sortedRecipes.length > 0 && (
          <>
            <div className="sort-controls">
              <label>Sort by:</label>
              <div className="sort-buttons">
                <button
                  className={`sort-btn ${sortBy === 'match' ? 'active' : ''}`}
                  onClick={() => setSortBy('match')}
                >
                  Best Match
                </button>
                <button
                  className={`sort-btn ${sortBy === 'time' ? 'active' : ''}`}
                  onClick={() => setSortBy('time')}
                >
                  Quickest
                </button>
                <button
                  className={`sort-btn ${sortBy === 'difficulty' ? 'active' : ''}`}
                  onClick={() => setSortBy('difficulty')}
                >
                  Easiest
                </button>
              </div>
            </div>

            <div className="recipes-grid">
              {sortedRecipes.map((recipe, index) => (
                <RecipeCard
                  key={index}
                  recipe={recipe}
                  ingredients={detectedIngredients}
                />
              ))}
            </div>
          </>
        )}

        {!isLoading && !error && sortedRecipes.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🍳</div>
            <h3>No recipes yet</h3>
            <p>Click "Regenerate Recipes" to get personalized suggestions</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeBrowserPage;
