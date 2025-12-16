import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 seconds for image processing
});

/**
 * Identifies ingredients from an uploaded image
 * @param {string} imageData - Base64 encoded image data
 * @param {string} imageType - MIME type of the image (e.g., 'image/jpeg')
 * @returns {Promise<Array>} Array of identified ingredients
 */
export const identifyIngredients = async (imageData, imageType) => {
  try {
    const response = await api.post('/identify-ingredients', {
      imageData,
      imageType,
    });
    return response.data.ingredients;
  } catch (error) {
    console.error('Error identifying ingredients:', error);
    throw new Error(
      error.response?.data?.error || 'Failed to identify ingredients. Please try again.'
    );
  }
};

/**
 * Generates recipe recommendations based on ingredients and cuisine preferences
 * @param {Array} ingredients - Array of ingredient objects or strings
 * @param {Array} cuisines - Array of selected cuisine types
 * @returns {Promise<Array>} Array of recipe recommendations
 */
export const generateRecipes = async (ingredients, cuisines = []) => {
  try {
    const response = await api.post('/generate-recipes', {
      ingredients,
      cuisines,
    });
    return response.data.recipes;
  } catch (error) {
    console.error('Error generating recipes:', error);
    throw new Error(
      error.response?.data?.error || 'Failed to generate recipes. Please try again.'
    );
  }
};

/**
 * Sends a chat message for health-focused recipe recommendations
 * @param {Array} messages - Array of chat messages with role and content
 * @param {Array} ingredients - Array of available ingredients
 * @returns {Promise<Object>} Chat response with optional recipe recommendations
 */
export const sendHealthChatMessage = async (messages, ingredients) => {
  try {
    const response = await api.post('/health-chat', {
      messages,
      ingredients,
    });
    return response.data;
  } catch (error) {
    console.error('Error in health chat:', error);
    throw new Error(
      error.response?.data?.error || 'Failed to send message. Please try again.'
    );
  }
};

export default api;
