import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' })); // Support large base64 images
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'FridgeChef AI Server is running' });
});

/**
 * POST /api/identify-ingredients
 * Analyzes an uploaded image to identify ingredients
 * Body: { imageData: base64 string, imageType: string (e.g., 'image/jpeg') }
 */
app.post('/api/identify-ingredients', async (req, res) => {
  try {
    const { imageData, imageType } = req.body;

    // Validate input
    if (!imageData) {
      return res.status(400).json({
        error: 'Missing required field: imageData'
      });
    }

    // Extract media type from data URL or use provided imageType
    let mediaType = imageType;
    let base64Data = imageData;

    // Check if imageData contains data URL prefix
    const dataUrlMatch = imageData.match(/^data:(image\/\w+);base64,(.+)$/);
    if (dataUrlMatch) {
      mediaType = dataUrlMatch[1]; // Extract actual media type (e.g., 'image/png')
      base64Data = dataUrlMatch[2]; // Extract base64 data
    } else {
      // Remove any remaining prefix
      base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
      // If no media type provided, default to jpeg
      if (!mediaType) {
        mediaType = 'image/jpeg';
      }
    }

    // Create message with vision capability
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: base64Data,
              },
            },
            {
              type: 'text',
              text: `Analyze this image and identify all food ingredients visible. For each ingredient, provide:
- name: the ingredient name
- quantity: estimated amount (e.g., "2 pieces", "1 cup", "500g")
- category: one of [vegetables, fruits, proteins, dairy, grains, condiments, other]
- freshness_days: estimated days until it goes bad (number)

Return ONLY a JSON array of ingredients, no other text. Format:
[{"name": "...", "quantity": "...", "category": "...", "freshness_days": ...}]`
            }
          ],
        },
      ],
    });

    // Extract the response text
    const responseText = message.content[0].text;

    // Parse JSON from response
    let ingredients;
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      ingredients = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
    } catch (parseError) {
      console.error('Failed to parse AI response:', responseText);
      return res.status(500).json({
        error: 'Failed to parse ingredient data from AI response',
        details: responseText
      });
    }

    res.json({ ingredients });

  } catch (error) {
    console.error('Error identifying ingredients:', error);
    res.status(500).json({
      error: 'Failed to identify ingredients',
      message: error.message
    });
  }
});

/**
 * POST /api/generate-recipes
 * Generates recipe recommendations based on available ingredients
 * Body: { ingredients: array, cuisines: array }
 */
app.post('/api/generate-recipes', async (req, res) => {
  try {
    const { ingredients, cuisines } = req.body;

    // Validate input
    if (!ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({
        error: 'Missing or invalid ingredients array'
      });
    }

    const cuisineFilter = cuisines && cuisines.length > 0
      ? `Focus on these cuisines: ${cuisines.join(', ')}.`
      : 'Include diverse cuisines.';

    const ingredientsList = ingredients.map(ing =>
      typeof ing === 'string' ? ing : ing.name
    ).join(', ');

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: `I have these ingredients: ${ingredientsList}

${cuisineFilter}

Generate 5 recipe recommendations. For each recipe, provide:
- name: dish name
- cuisine: cuisine type
- ingredients_used: array of my ingredients used
- missing_ingredients: array of ingredients I need to buy
- cooking_time: time in minutes (number)
- difficulty: "Easy", "Medium", or "Hard"
- steps: array of cooking instructions
- nutritional_notes: brief health benefits

Return ONLY a JSON array of recipes, no other text. Format:
[{"name": "...", "cuisine": "...", "ingredients_used": [...], "missing_ingredients": [...], "cooking_time": ..., "difficulty": "...", "steps": [...], "nutritional_notes": "..."}]`
        },
      ],
    });

    const responseText = message.content[0].text;

    let recipes;
    try {
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      recipes = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
    } catch (parseError) {
      console.error('Failed to parse AI response:', responseText);
      return res.status(500).json({
        error: 'Failed to parse recipe data from AI response',
        details: responseText
      });
    }

    res.json({ recipes });

  } catch (error) {
    console.error('Error generating recipes:', error);
    res.status(500).json({
      error: 'Failed to generate recipes',
      message: error.message
    });
  }
});

/**
 * POST /api/health-chat
 * Handles health-focused chat for therapeutic recipe recommendations
 * Body: { messages: array, ingredients: array }
 */
app.post('/api/health-chat', async (req, res) => {
  try {
    const { messages, ingredients } = req.body;

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: 'Missing or invalid messages array'
      });
    }

    if (!ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({
        error: 'Missing or invalid ingredients array'
      });
    }

    const ingredientsList = ingredients.map(ing =>
      typeof ing === 'string' ? ing : ing.name
    ).join(', ');

    // System prompt for therapeutic cooking assistant
    const systemPrompt = `You are a therapeutic cooking assistant specializing in evidence-based nutritional recommendations.

Available ingredients: ${ingredientsList}

Your role:
- Recommend recipes that address the user's health concerns using their available ingredients
- Explain the therapeutic benefits of ingredients (e.g., anti-inflammatory properties, vitamins, minerals)
- Provide practical, evidence-based nutritional advice
- When recommending recipes, include: name, ingredients (marking which they have vs need to buy), steps, cooking time, and specific health benefits
- Be empathetic and supportive while staying scientifically accurate
- Include medical disclaimer when appropriate

Format recipe recommendations as embedded JSON objects in your response like this:
RECIPE_START
{"name": "...", "ingredients_used": [...], "missing_ingredients": [...], "steps": [...], "cooking_time": ..., "difficulty": "...", "health_benefits": "..."}
RECIPE_END

Keep responses conversational and helpful.`;

    // Convert chat history to Anthropic format
    const anthropicMessages = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 3000,
      system: systemPrompt,
      messages: anthropicMessages,
    });

    const responseText = message.content[0].text;

    // Extract embedded recipes if present
    const recipeMatches = [...responseText.matchAll(/RECIPE_START\s*([\s\S]*?)\s*RECIPE_END/g)];
    const recipes = recipeMatches.map(match => {
      try {
        return JSON.parse(match[1]);
      } catch (e) {
        return null;
      }
    }).filter(Boolean);

    res.json({
      response: responseText,
      recipes: recipes
    });

  } catch (error) {
    console.error('Error in health chat:', error);
    res.status(500).json({
      error: 'Failed to process chat message',
      message: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 FridgeChef AI Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints:`);
  console.log(`   - POST /api/identify-ingredients`);
  console.log(`   - POST /api/generate-recipes`);
  console.log(`   - POST /api/health-chat`);
});
