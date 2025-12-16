import React from 'react';

const CuisineFilter = ({ selectedCuisines, onToggle }) => {
  const cuisines = [
    { name: 'Chinese', emoji: '🥟' },
    { name: 'French', emoji: '🥖' },
    { name: 'Italian', emoji: '🍝' },
    { name: 'Japanese', emoji: '🍱' },
    { name: 'Mexican', emoji: '🌮' },
    { name: 'Indian', emoji: '🍛' },
    { name: 'Mediterranean', emoji: '🫒' },
    { name: 'Korean', emoji: '🍜' },
  ];

  return (
    <div className="cuisine-filter">
      <h3 className="filter-title">Filter by Cuisine</h3>
      <div className="cuisine-chips">
        {cuisines.map(({ name, emoji }) => (
          <button
            key={name}
            className={`cuisine-chip ${selectedCuisines.includes(name) ? 'selected' : ''}`}
            onClick={() => onToggle(name)}
          >
            <span className="cuisine-emoji">{emoji}</span>
            <span className="cuisine-name">{name}</span>
          </button>
        ))}
      </div>
      {selectedCuisines.length > 0 && (
        <button
          className="btn-clear-filters"
          onClick={() => selectedCuisines.forEach(onToggle)}
        >
          Clear filters ({selectedCuisines.length})
        </button>
      )}
    </div>
  );
};

export default CuisineFilter;
