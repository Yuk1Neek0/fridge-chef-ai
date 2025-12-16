import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Image upload state
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Ingredients state
  const [detectedIngredients, setDetectedIngredients] = useState([]);

  // Recipe state
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [currentRecipes, setCurrentRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Chat state
  const [chatHistory, setChatHistory] = useState([]);

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper function to reset all state
  const resetApp = () => {
    setUploadedImage(null);
    setImagePreview(null);
    setDetectedIngredients([]);
    setSelectedCuisines([]);
    setCurrentRecipes([]);
    setSelectedRecipe(null);
    setChatHistory([]);
    setIsLoading(false);
    setError(null);
  };

  // Helper function to add ingredient
  const addIngredient = (ingredient) => {
    setDetectedIngredients(prev => [...prev, ingredient]);
  };

  // Helper function to remove ingredient
  const removeIngredient = (index) => {
    setDetectedIngredients(prev => prev.filter((_, i) => i !== index));
  };

  // Helper function to update ingredient
  const updateIngredient = (index, updatedIngredient) => {
    setDetectedIngredients(prev =>
      prev.map((ing, i) => (i === index ? updatedIngredient : ing))
    );
  };

  // Helper function to toggle cuisine selection
  const toggleCuisine = (cuisine) => {
    setSelectedCuisines(prev =>
      prev.includes(cuisine)
        ? prev.filter(c => c !== cuisine)
        : [...prev, cuisine]
    );
  };

  // Helper function to add chat message
  const addChatMessage = (role, content) => {
    setChatHistory(prev => [...prev, { role, content }]);
  };

  // Helper function to clear chat history
  const clearChat = () => {
    setChatHistory([]);
  };

  const value = {
    // State
    uploadedImage,
    imagePreview,
    detectedIngredients,
    selectedCuisines,
    currentRecipes,
    selectedRecipe,
    chatHistory,
    isLoading,
    error,

    // Setters
    setUploadedImage,
    setImagePreview,
    setDetectedIngredients,
    setSelectedCuisines,
    setCurrentRecipes,
    setSelectedRecipe,
    setChatHistory,
    setIsLoading,
    setError,

    // Helpers
    resetApp,
    addIngredient,
    removeIngredient,
    updateIngredient,
    toggleCuisine,
    addChatMessage,
    clearChat,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
