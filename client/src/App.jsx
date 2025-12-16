import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import LandingPage from './pages/LandingPage';
import UploadPage from './pages/UploadPage';
import ModeSelectorPage from './pages/ModeSelectorPage';
import RecipeBrowserPage from './pages/RecipeBrowserPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import HealthChatPage from './pages/HealthChatPage';
import './App.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/mode-selector" element={<ModeSelectorPage />} />
            <Route path="/recipe-browser" element={<RecipeBrowserPage />} />
            <Route path="/recipe-detail" element={<RecipeDetailPage />} />
            <Route path="/health-chat" element={<HealthChatPage />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
