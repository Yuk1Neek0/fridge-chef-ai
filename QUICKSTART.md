# Quick Start Guide - FridgeChef AI

Get your FridgeChef AI app running locally in 5 minutes!

## Prerequisites

- Node.js 18 or higher installed
- Anthropic API key ([Get one here](https://console.anthropic.com/))

## Installation Steps

### 1. Install Dependencies

Open two terminal windows/tabs:

**Terminal 1 - Backend:**
```bash
cd fridge-chef-ai/server
npm install
```

**Terminal 2 - Frontend:**
```bash
cd fridge-chef-ai/client
npm install
```

### 2. Configure Environment

In the `server` folder, create a `.env` file:

```bash
cd server
```

**Windows:**
```bash
copy .env.example .env
```

**Mac/Linux:**
```bash
cp .env.example .env
```

Edit `.env` and add your Anthropic API key:
```env
ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 3. Start the Servers

**Terminal 1 - Backend:**
```bash
npm run dev
```
✅ Server running on http://localhost:3001

**Terminal 2 - Frontend:**
```bash
npm run dev
```
✅ App running on http://localhost:5173

### 4. Open Your Browser

Navigate to: http://localhost:5173

## Quick Test

1. Click "Upload Fridge Photo"
2. Upload a test image (or drag and drop)
3. Click "Analyze Ingredients"
4. Wait for AI to detect ingredients
5. Click "Continue to Next Step"
6. Choose "Browse Recipes" or "Health Assistant"
7. Enjoy your personalized recipes!

## Test Images

Don't have a fridge photo handy? Try these:
- Take a photo of your actual fridge
- Use any food/ingredient photo
- Search online for "fridge contents photo"

## Common Issues

### "Command not found: npm"
Install Node.js from https://nodejs.org/

### "API key invalid"
- Check you copied the full API key
- Verify key is active in Anthropic console
- Make sure no extra spaces in .env file

### Port already in use
Change the port in `server/.env`:
```env
PORT=3002
```

### Can't connect to API
- Make sure backend server is running
- Check the backend terminal for errors
- Verify CLIENT_URL matches frontend port

## Mobile Testing

To test on your phone (same WiFi network):

1. Find your computer's IP address:
   - **Windows**: `ipconfig` (look for IPv4)
   - **Mac**: `ifconfig | grep inet`
   - **Linux**: `ip addr`

2. Update `server/.env`:
   ```env
   CLIENT_URL=http://YOUR_IP:5173
   ```

3. On your phone, visit:
   ```
   http://YOUR_IP:5173
   ```

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check [DEPLOYMENT.md](DEPLOYMENT.md) to deploy to production
- Customize the app to your needs

## Need Help?

- Check the README.md for troubleshooting
- Review the code comments for implementation details
- Open an issue on GitHub

---

Happy cooking! 👨‍🍳
