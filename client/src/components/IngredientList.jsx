import React, { useState } from 'react';

const IngredientList = ({ ingredients, onAdd, onRemove, onUpdate, editable = true }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newIngredient, setNewIngredient] = useState({
    name: '',
    quantity: '',
    category: 'other',
    freshness_days: 7
  });
  const [editingIndex, setEditingIndex] = useState(null);

  const categories = {
    vegetables: '🥬',
    fruits: '🍎',
    proteins: '🥩',
    dairy: '🥛',
    grains: '🌾',
    condiments: '🧂',
    other: '📦'
  };

  const getCategoryColor = (category) => {
    const colors = {
      vegetables: '#10b981',
      fruits: '#f59e0b',
      proteins: '#ef4444',
      dairy: '#3b82f6',
      grains: '#92400e',
      condiments: '#8b5cf6',
      other: '#6b7280'
    };
    return colors[category] || colors.other;
  };

  const getFreshnessClass = (days) => {
    if (days <= 2) return 'freshness-critical';
    if (days <= 5) return 'freshness-warning';
    return 'freshness-good';
  };

  const handleAddIngredient = () => {
    if (!newIngredient.name.trim()) return;
    onAdd(newIngredient);
    setNewIngredient({ name: '', quantity: '', category: 'other', freshness_days: 7 });
    setShowAddForm(false);
  };

  const handleSaveEdit = (index) => {
    setEditingIndex(null);
  };

  // Group ingredients by category
  const groupedIngredients = ingredients.reduce((acc, ing, index) => {
    const category = ing.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push({ ...ing, originalIndex: index });
    return acc;
  }, {});

  return (
    <div className="ingredient-list">
      <div className="ingredient-header">
        <h3>Your Ingredients ({ingredients.length})</h3>
        {editable && (
          <button
            className="btn-add-ingredient"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? '✕' : '+ Add'}
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="add-ingredient-form">
          <input
            type="text"
            placeholder="Ingredient name"
            value={newIngredient.name}
            onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
            className="input"
          />
          <input
            type="text"
            placeholder="Quantity (e.g., 2 pieces)"
            value={newIngredient.quantity}
            onChange={(e) => setNewIngredient({ ...newIngredient, quantity: e.target.value })}
            className="input"
          />
          <select
            value={newIngredient.category}
            onChange={(e) => setNewIngredient({ ...newIngredient, category: e.target.value })}
            className="select"
          >
            {Object.keys(categories).map(cat => (
              <option key={cat} value={cat}>
                {categories[cat]} {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
          <button onClick={handleAddIngredient} className="btn-primary">
            Add Ingredient
          </button>
        </div>
      )}

      {ingredients.length === 0 ? (
        <div className="empty-state">
          <p>No ingredients detected yet</p>
        </div>
      ) : (
        <div className="ingredient-categories">
          {Object.keys(groupedIngredients).sort().map(category => (
            <div key={category} className="ingredient-category">
              <h4 className="category-title">
                <span className="category-icon">{categories[category]}</span>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </h4>
              <div className="ingredient-items">
                {groupedIngredients[category].map(({ originalIndex, name, quantity, freshness_days }) => (
                  <div
                    key={originalIndex}
                    className="ingredient-item"
                    style={{ borderLeftColor: getCategoryColor(category) }}
                  >
                    <div className="ingredient-info">
                      <span className="ingredient-name">{name}</span>
                      {quantity && <span className="ingredient-quantity">{quantity}</span>}
                      {freshness_days !== undefined && (
                        <span className={`ingredient-freshness ${getFreshnessClass(freshness_days)}`}>
                          {freshness_days}d left
                        </span>
                      )}
                    </div>
                    {editable && (
                      <button
                        onClick={() => onRemove(originalIndex)}
                        className="btn-remove"
                        aria-label="Remove ingredient"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IngredientList;
