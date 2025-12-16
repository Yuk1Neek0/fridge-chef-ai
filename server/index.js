import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { HfInference } from '@huggingface/inference';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Get AI provider from environment (default to huggingface for free tier)
const AI_PROVIDER = process.env.AI_PROVIDER || 'huggingface';

// Initialize AI clients
const anthropic = process.env.ANTHROPIC_API_KEY ? new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
}) : null;

const hf = process.env.HUGGINGFACE_API_KEY ? new HfInference(process.env.HUGGINGFACE_API_KEY) : null;

console.log(`🤖 AI Provider: ${AI_PROVIDER}`);
console.log(`✅ Anthropic initialized: ${!!anthropic}`);
console.log(`✅ Hugging Face initialized: ${!!hf}`);

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
      mediaType = dataUrlMatch[1];
      base64Data = dataUrlMatch[2];
    } else {
      base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
      if (!mediaType) {
        mediaType = 'image/jpeg';
      }
    }

    let ingredients;

    // Route to appropriate AI provider
    if (AI_PROVIDER === 'huggingface' && hf) {
      console.log('🤗 Using Hugging Face for image analysis');
      ingredients = await analyzeImageWithHuggingFace(base64Data);
    } else if (AI_PROVIDER === 'claude' && anthropic) {
      console.log('🔮 Using Claude for image analysis');
      ingredients = await analyzeImageWithClaude(anthropic, mediaType, base64Data);
    } else {
      return res.status(500).json({
        error: `AI provider '${AI_PROVIDER}' not available. Check your API keys.`
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
 * Analyze image with Hugging Face (FREE but less accurate)
 */
async function analyzeImageWithHuggingFace(base64Data) {
  try {
    // Convert base64 to buffer
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // Use Hugging Face image classification
    const result = await hf.imageClassification({
      data: imageBuffer,
      model: 'nateraw/food' // Food-specific model
    });

    // Convert HF results to our ingredient format
    // Note: HF can only detect food types, not quantities/freshness
    const ingredients = result.slice(0, 10).map((item) => {
      const categories = {
        'vegetable': 'vegetables',
        'fruit': 'fruits',
        'meat': 'proteins',
        'dairy': 'dairy',
        'grain': 'grains',
      };

      const label = item.label.toLowerCase();
      let category = 'other';
      for (const [key, value] of Object.entries(categories)) {
        if (label.includes(key)) {
          category = value;
          break;
        }
      }

      return {
        name: item.label.replace(/_/g, ' '),
        quantity: 'Not specified', // HF can't estimate quantities
        category: category,
        freshness_days: 7 // Default estimate
      };
    }).filter(ing => ing.name.length > 0);

    console.log(`✅ Hugging Face detected ${ingredients.length} items`);
    return ingredients;

  } catch (error) {
    console.error('Hugging Face error:', error);
    // Fallback to mock data if HF fails
    return getMockIngredients();
  }
}

/**
 * Analyze image with Claude (PAID but very accurate)
 */
async function analyzeImageWithClaude(anthropic, mediaType, base64Data) {
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

  const responseText = message.content[0].text;
  const jsonMatch = responseText.match(/\[[\s\S]*\]/);
  return JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
}

/**
 * Mock data fallback for demos/presentations
 */
function getMockIngredients() {
  return [
    { name: "Tomatoes", quantity: "3 pieces", category: "vegetables", freshness_days: 5 },
    { name: "Chicken Breast", quantity: "500g", category: "proteins", freshness_days: 3 },
    { name: "Milk", quantity: "1 liter", category: "dairy", freshness_days: 7 },
    { name: "Eggs", quantity: "6 pieces", category: "proteins", freshness_days: 14 },
    { name: "Cheddar Cheese", quantity: "200g", category: "dairy", freshness_days: 21 },
    { name: "Carrots", quantity: "5 pieces", category: "vegetables", freshness_days: 10 },
    { name: "Onions", quantity: "3 pieces", category: "vegetables", freshness_days: 14 },
    { name: "Bell Peppers", quantity: "2 pieces", category: "vegetables", freshness_days: 7 },
  ];
}

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

    const ingredientsList = ingredients.map(ing =>
      typeof ing === 'string' ? ing : ing.name
    ).join(', ');

    let recipes;

    // For Hugging Face, use mock recipes (HF text generation is complex and costly)
    // For presentation purposes, this is actually better!
    if (AI_PROVIDER === 'huggingface') {
      console.log('🤗 Using mock recipes (Hugging Face mode)');
      recipes = generateMockRecipes(ingredients, cuisines);
    } else if (AI_PROVIDER === 'claude' && anthropic) {
      console.log('🔮 Using Claude for recipe generation');
      const cuisineFilter = cuisines && cuisines.length > 0
        ? `Focus on these cuisines: ${cuisines.join(', ')}.`
        : 'Include diverse cuisines.';

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
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      recipes = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
    } else {
      return res.status(500).json({
        error: `AI provider '${AI_PROVIDER}' not available. Check your API keys.`
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
 * Generate mock recipes for presentations/demos
 */
function generateMockRecipes(_ingredients, cuisines) {
  const allRecipes = [
    {
      name: "Classic Tomato & Chicken Pasta",
      cuisine: "Italian",
      ingredients_used: ["Tomatoes", "Chicken Breast", "Onions"],
      missing_ingredients: ["Pasta", "Olive Oil", "Garlic", "Basil"],
      cooking_time: 30,
      difficulty: "Easy",
      steps: [
        "Dice chicken breast and season with salt and pepper",
        "Heat olive oil in a large pan over medium heat",
        "Cook chicken until golden brown, about 5-7 minutes",
        "Add diced onions and garlic, cook until soft",
        "Add chopped tomatoes and simmer for 10 minutes",
        "Cook pasta according to package directions",
        "Toss pasta with sauce and garnish with fresh basil"
      ],
      nutritional_notes: "High in protein, rich in lycopene from tomatoes"
    },
    {
      name: "Vegetable Stir-Fry with Eggs",
      cuisine: "Chinese",
      ingredients_used: ["Eggs", "Carrots", "Bell Peppers", "Onions"],
      missing_ingredients: ["Soy Sauce", "Rice", "Sesame Oil"],
      cooking_time: 20,
      difficulty: "Easy",
      steps: [
        "Slice all vegetables into thin strips",
        "Beat eggs in a bowl with a pinch of salt",
        "Heat oil in a wok over high heat",
        "Stir-fry vegetables for 3-4 minutes",
        "Push vegetables to the side, scramble eggs",
        "Mix everything together, add soy sauce",
        "Serve over steamed rice"
      ],
      nutritional_notes: "Rich in vitamins A and C, good source of protein"
    },
    {
      name: "Cheese & Vegetable Omelet",
      cuisine: "French",
      ingredients_used: ["Eggs", "Cheddar Cheese", "Bell Peppers", "Onions"],
      missing_ingredients: ["Butter", "Herbs"],
      cooking_time: 15,
      difficulty: "Easy",
      steps: [
        "Dice bell peppers and onions finely",
        "Beat eggs with salt and pepper",
        "Melt butter in a non-stick pan",
        "Sauté vegetables until soft",
        "Pour eggs over vegetables",
        "Add grated cheese on one half",
        "Fold omelet and cook until set"
      ],
      nutritional_notes: "High in protein and calcium, low carb option"
    },
    {
      name: "Chicken & Vegetable Soup",
      cuisine: "Mediterranean",
      ingredients_used: ["Chicken Breast", "Carrots", "Onions", "Tomatoes"],
      missing_ingredients: ["Chicken Stock", "Herbs", "Lemon"],
      cooking_time: 45,
      difficulty: "Medium",
      steps: [
        "Cut chicken into bite-sized pieces",
        "Chop all vegetables",
        "Heat oil in a large pot",
        "Brown chicken pieces",
        "Add vegetables and sauté for 5 minutes",
        "Pour in chicken stock and bring to boil",
        "Simmer for 30 minutes",
        "Season with herbs and lemon juice"
      ],
      nutritional_notes: "Anti-inflammatory, immune-boosting, rich in vitamins"
    },
    {
      name: "Veggie-Loaded Cheese Quesadillas",
      cuisine: "Mexican",
      ingredients_used: ["Cheddar Cheese", "Bell Peppers", "Onions", "Tomatoes"],
      missing_ingredients: ["Tortillas", "Salsa", "Sour Cream"],
      cooking_time: 15,
      difficulty: "Easy",
      steps: [
        "Dice bell peppers, onions, and tomatoes",
        "Grate cheese",
        "Heat a large skillet over medium heat",
        "Place tortilla in pan",
        "Add cheese and vegetables on half",
        "Fold tortilla and cook until golden",
        "Flip and cook other side",
        "Serve with salsa and sour cream"
      ],
      nutritional_notes: "Good source of calcium and vitamin C"
    }
  ];

  // Filter by cuisine if specified
  if (cuisines && cuisines.length > 0) {
    return allRecipes.filter(recipe =>
      cuisines.some(c => recipe.cuisine.toLowerCase().includes(c.toLowerCase()))
    );
  }

  return allRecipes;
}

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
