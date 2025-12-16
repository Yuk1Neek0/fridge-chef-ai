# FridgeChef AI

Transform your fridge into therapeutic, delicious meals with AI-powered recipe recommendations.

## Overview

FridgeChef AI is an intelligent fridge-to-recipe assistant that uses Claude AI's vision capabilities to identify ingredients from photos and generate personalized recipe recommendations. The app offers two modes:

- **Recipe Browser**: Explore recipes filtered by cuisine type with ingredient matching
- **Health Assistant**: Get therapeutic recipe recommendations based on your health needs

## Features

- 📸 AI-powered ingredient recognition from photos
- 🍳 Smart recipe matching based on available ingredients
- 💚 Therapeutic meal recommendations for specific health concerns
- 🌍 Multiple cuisine options (Chinese, French, Italian, Japanese, Mexican, Indian, Mediterranean, Korean)
- 📱 Fully responsive and mobile-optimized design
- 🎯 Ingredient freshness tracking
- 🔍 Recipe filtering and sorting

## Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Styling with mobile-first approach

### Backend
- **Express.js** - Web server
- **Anthropic Claude API** - AI-powered image analysis and recipe generation
- **CORS** - Cross-origin resource sharing

## Prerequisites

- Node.js 18+ and npm
- Anthropic API key (get one at https://console.anthropic.com/)

## Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd fridge-chef-ai
```

### 2. Install server dependencies

```bash
cd server
npm install
```

### 3. Install client dependencies

```bash
cd ../client
npm install
```

### 4. Set up environment variables

Create a `.env` file in the `server` directory:

```bash
cd ../server
cp .env.example .env
```

Edit the `.env` file and add your Anthropic API key:

```env
ANTHROPIC_API_KEY=your_actual_api_key_here
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

## Development

### Running locally

1. Start the backend server (from `server` directory):

```bash
cd server
npm run dev
```

The server will start on http://localhost:3001

2. Start the frontend development server (from `client` directory):

```bash
cd client
npm run dev
```

The client will start on http://localhost:5173

3. Open your browser and navigate to http://localhost:5173

### Testing on mobile devices

To test on your mobile device while on the same network:

1. Find your computer's local IP address:
   - Windows: `ipconfig` (look for IPv4 Address)
   - Mac/Linux: `ifconfig` or `ip addr`

2. Update the server's `.env` file to accept connections from your network:
   ```env
   CLIENT_URL=http://your-ip-address:5173
   ```

3. Access the app on your mobile device:
   ```
   http://your-ip-address:5173
   ```

## Building for Production

### Build the client

```bash
cd client
npm run build
```

This creates a `dist` folder with optimized production files.

### Run the production server

```bash
cd server
npm start
```

## Deployment to Render

### Prerequisites
- GitHub account
- Render account (https://render.com)

### Step 1: Prepare your repository

1. Push your code to GitHub
2. Make sure `.env` is in `.gitignore` (already configured)

### Step 2: Deploy the backend

1. Go to https://dashboard.render.com/
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `fridge-chef-api`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or choose paid plan)

5. Add environment variables:
   - `ANTHROPIC_API_KEY`: Your Anthropic API key
   - `NODE_ENV`: `production`
   - `CLIENT_URL`: (will add after deploying frontend)

6. Click "Create Web Service"
7. Copy your backend URL (e.g., `https://fridge-chef-api.onrender.com`)

### Step 3: Deploy the frontend

1. Click "New +" → "Static Site"
2. Connect your GitHub repository
3. Configure the site:
   - **Name**: `fridge-chef-ai`
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. Add environment variable:
   - `VITE_API_URL`: Your backend URL from Step 2

5. Click "Create Static Site"
6. Copy your frontend URL

### Step 4: Update backend CORS

1. Go back to your backend service on Render
2. Update the `CLIENT_URL` environment variable with your frontend URL
3. Trigger a manual deploy

### Step 5: Test your deployed app

Visit your frontend URL and test all features!

## Project Structure

```
fridge-chef-ai/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── context/       # React Context for state management
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service functions
│   │   ├── App.jsx        # Main app component
│   │   ├── App.css        # Global styles
│   │   └── main.jsx       # React entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                # Backend Express server
│   ├── index.js          # Server entry point with API routes
│   ├── package.json
│   └── .env.example      # Environment variables template
├── .gitignore
└── README.md
```

## API Endpoints

### POST /api/identify-ingredients
Analyzes an uploaded image to identify ingredients.

**Request:**
```json
{
  "imageData": "base64_encoded_image",
  "imageType": "image/jpeg"
}
```

**Response:**
```json
{
  "ingredients": [
    {
      "name": "Tomato",
      "quantity": "3 pieces",
      "category": "vegetables",
      "freshness_days": 5
    }
  ]
}
```

### POST /api/generate-recipes
Generates recipe recommendations based on ingredients.

**Request:**
```json
{
  "ingredients": ["tomato", "cheese", "pasta"],
  "cuisines": ["Italian", "Mediterranean"]
}
```

**Response:**
```json
{
  "recipes": [
    {
      "name": "Caprese Pasta",
      "cuisine": "Italian",
      "ingredients_used": ["tomato", "cheese", "pasta"],
      "missing_ingredients": ["basil", "olive oil"],
      "cooking_time": 20,
      "difficulty": "Easy",
      "steps": ["...", "..."],
      "nutritional_notes": "High in protein and calcium"
    }
  ]
}
```

### POST /api/health-chat
Handles health-focused chat for therapeutic recommendations.

**Request:**
```json
{
  "messages": [
    {"role": "user", "content": "I have lower back pain"}
  ],
  "ingredients": ["salmon", "spinach", "turmeric"]
}
```

**Response:**
```json
{
  "response": "For lower back pain, I recommend anti-inflammatory foods...",
  "recipes": [...]
}
```

## Usage Tips

1. **Best Photo Results**: Take clear, well-lit photos of your fridge or ingredients
2. **Manual Editing**: You can add, remove, or modify detected ingredients
3. **Cuisine Filtering**: Select multiple cuisines for more diverse recipe options
4. **Health Chat**: Be specific about your health concerns for better recommendations
5. **Mobile Camera**: The app supports direct camera access on mobile devices

## Troubleshooting

### Images not uploading
- Check that image size is under 10MB
- Ensure image format is JPG or PNG
- Try refreshing the page

### No recipes generated
- Verify you have at least one ingredient added
- Check your internet connection
- Check server logs for API errors

### API errors
- Verify your Anthropic API key is correct
- Check your API key has sufficient credits
- Check server logs: `cd server && npm run dev`

## Performance Optimization

The app includes several optimizations:
- Image compression before upload (recommended to add)
- Lazy loading of recipe images
- Mobile-first responsive design
- Efficient state management with React Context
- Smooth scrolling and animations

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License.

## Credits

- Powered by [Anthropic Claude AI](https://www.anthropic.com/)
- Built with React and Express.js
- Designed for modern mobile browsers

## Support

For issues or questions, please open an issue on the GitHub repository.

---

Made with ❤️ for home cooks everywhere
