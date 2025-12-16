import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { identifyIngredients } from '../services/api';
import ImageUploader from '../components/ImageUploader';
import IngredientList from '../components/IngredientList';
import LoadingSpinner from '../components/LoadingSpinner';

const UploadPage = () => {
  const navigate = useNavigate();
  const {
    imagePreview,
    setImagePreview,
    detectedIngredients,
    setDetectedIngredients,
    addIngredient,
    removeIngredient,
    setUploadedImage,
  } = useApp();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const handleImageSelect = async (imageData, imageType) => {
    setImagePreview(imageData);
    setUploadedImage({ data: imageData, type: imageType });
    setError(null);
    setDetectedIngredients([]);
  };

  const handleAnalyze = async () => {
    if (!imagePreview) {
      setError('Please upload an image first');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const ingredients = await identifyIngredients(imagePreview, 'image/jpeg');
      setDetectedIngredients(ingredients);
    } catch (err) {
      setError(err.message);
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleContinue = () => {
    if (detectedIngredients.length === 0) {
      setError('Please add at least one ingredient before continuing');
      return;
    }
    navigate('/mode-selector');
  };

  return (
    <div className="upload-page">
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate('/')}>
          ← Back
        </button>
        <h1>Upload Your Fridge</h1>
      </div>

      <div className="upload-container">
        <ImageUploader onImageSelect={handleImageSelect} preview={imagePreview} />

        {imagePreview && !isAnalyzing && detectedIngredients.length === 0 && (
          <button className="btn-primary btn-analyze" onClick={handleAnalyze}>
            🔍 Analyze Ingredients
          </button>
        )}

        {isAnalyzing && (
          <LoadingSpinner message="Analyzing your ingredients with AI..." />
        )}

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {detectedIngredients.length > 0 && (
          <div className="ingredients-section">
            <IngredientList
              ingredients={detectedIngredients}
              onAdd={addIngredient}
              onRemove={removeIngredient}
              editable={true}
            />
            <button className="btn-primary btn-continue" onClick={handleContinue}>
              Continue to Next Step →
            </button>
          </div>
        )}
      </div>

      {!imagePreview && (
        <div className="upload-tips">
          <h3>📋 Tips for Best Results:</h3>
          <ul>
            <li>Take a clear, well-lit photo of your fridge or pantry</li>
            <li>Make sure ingredients are visible and not hidden</li>
            <li>You can upload multiple photos one at a time</li>
            <li>Edit the detected ingredients after analysis</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
