# Getting Started with FridgeChef AI

Welcome! This guide will help you get FridgeChef AI running on your computer.

## What You Need

Before you start, make sure you have:

1. **Node.js** (version 18 or higher)
   - Download from: https://nodejs.org/
   - Check if installed: Open terminal and run `node --version`

2. **Anthropic API Key**
   - Sign up at: https://console.anthropic.com/
   - Create an API key from the dashboard
   - Keep it safe - you'll need it in a moment!

3. **A code editor** (optional but helpful)
   - VS Code: https://code.visualstudio.com/
   - Or any text editor to edit the .env file

## Installation (Choose Your Method)

### Method 1: Automated Setup (Recommended)

**Windows:**
1. Double-click `setup.bat`
2. Wait for installation to complete
3. Edit `server\.env` file and add your API key
4. Double-click `start-dev.bat`
5. Open http://localhost:5173 in your browser

**Mac/Linux:**
```bash
# Make scripts executable (first time only)
chmod +x setup.sh start-dev.sh

# Run setup
./setup.sh

# Edit the .env file
nano server/.env
# (Add your API key, save with Ctrl+X, Y, Enter)

# Start servers
./start-dev.sh
```

### Method 2: Manual Setup

**Step 1: Install Dependencies**

Open two terminal windows:

Terminal 1 (Backend):
```bash
cd fridge-chef-ai/server
npm install
```

Terminal 2 (Frontend):
```bash
cd fridge-chef-ai/client
npm install
```

**Step 2: Configure Environment**

Create `server/.env` file:
```bash
cd server
```

Windows:
```bash
copy .env.example .env
notepad .env
```

Mac/Linux:
```bash
cp .env.example .env
nano .env
```

Add your API key:
```env
ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**Step 3: Start Servers**

Terminal 1 (Backend):
```bash
cd server
npm run dev
```

Terminal 2 (Frontend):
```bash
cd client
npm run dev
```

**Step 4: Open Your Browser**

Navigate to: http://localhost:5173

## Your First Recipe

1. **Upload a Photo**
   - Click "Upload Fridge Photo"
   - Take a photo of your fridge or ingredients
   - Or use any food photo you have

2. **Analyze Ingredients**
   - Click "Analyze Ingredients"
   - Wait 10-15 seconds for AI to process
   - Review detected ingredients
   - Add or remove items as needed

3. **Choose Your Mode**
   - **Recipe Browser**: Filter by cuisine and explore recipes
   - **Health Assistant**: Get therapeutic recommendations

4. **Get Recipes!**
   - View personalized recipes
   - See what you have vs need to buy
   - Follow step-by-step instructions

## Testing on Your Phone

Want to test on your mobile device?

1. **Find Your Computer's IP Address**

   Windows (Command Prompt):
   ```bash
   ipconfig
   ```
   Look for "IPv4 Address" (e.g., 192.168.1.100)

   Mac (Terminal):
   ```bash
   ifconfig | grep inet
   ```

   Linux (Terminal):
   ```bash
   hostname -I
   ```

2. **Update Server Configuration**

   Edit `server/.env`:
   ```env
   CLIENT_URL=http://YOUR_IP_ADDRESS:5173
   ```
   Example: `CLIENT_URL=http://192.168.1.100:5173`

3. **Restart Servers**
   - Stop servers (Ctrl+C in both terminals)
   - Start them again

4. **Access on Phone**
   - Make sure phone is on same WiFi network
   - Open browser on phone
   - Visit: `http://YOUR_IP_ADDRESS:5173`
   - Example: `http://192.168.1.100:5173`

## Common Issues & Solutions

### "npm: command not found"
**Problem:** Node.js not installed
**Solution:** Download and install from https://nodejs.org/

### "Port 3001 already in use"
**Problem:** Another app is using that port
**Solution:** Change PORT in `server/.env` to 3002 or any available port

### "API key invalid"
**Problem:** Wrong or missing API key
**Solution:**
- Check you copied the complete API key
- Verify no extra spaces in .env file
- Make sure API key is active in Anthropic console

### "Cannot connect to server"
**Problem:** Backend not running
**Solution:**
- Check if backend terminal shows any errors
- Restart backend server
- Verify backend is running on http://localhost:3001/api/health

### Images won't upload
**Problem:** File too large or wrong format
**Solution:**
- Use images under 10MB
- Use JPG or PNG format
- Try a different image

### Blank white screen
**Problem:** Frontend not running properly
**Solution:**
- Check browser console (F12) for errors
- Clear browser cache
- Restart frontend server
- Try different browser

## Project Structure

```
fridge-chef-ai/
├── 📁 client/              Frontend React app
│   ├── 📁 src/
│   │   ├── 📁 components/  Reusable UI components
│   │   ├── 📁 pages/       Page components
│   │   ├── 📁 context/     State management
│   │   └── 📁 services/    API calls
│   └── 📄 package.json
│
├── 📁 server/              Backend Express API
│   ├── 📄 index.js         Main server file
│   ├── 📄 package.json
│   └── 📄 .env             Configuration (create this!)
│
└── 📄 Documentation files
```

## Next Steps

Once you have it running:

1. **Explore the App**
   - Try different types of ingredient photos
   - Test both Recipe Browser and Health Assistant modes
   - See how cuisine filtering works

2. **Read the Documentation**
   - [README.md](README.md) - Full project documentation
   - [DEPLOYMENT.md](DEPLOYMENT.md) - How to deploy online
   - [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Technical details

3. **Customize It**
   - Modify colors in `client/src/App.css`
   - Add new cuisines in `client/src/components/CuisineFilter.jsx`
   - Adjust AI prompts in `server/index.js`

## Need More Help?

- **Documentation Issues**: Check the README.md
- **Bugs**: Review error messages in browser console (F12)
- **Server Errors**: Check the terminal where servers are running
- **API Issues**: Visit https://console.anthropic.com/ to check API status

## Tips for Best Results

1. **Good Photos** 📸
   - Use good lighting
   - Make sure ingredients are visible
   - Don't worry about perfection - AI is smart!

2. **Be Specific in Health Chat** 💬
   - Describe your health concerns clearly
   - Mention any dietary restrictions
   - Ask follow-up questions

3. **Explore Cuisines** 🌍
   - Try selecting multiple cuisines
   - Mix and match for fusion recipes
   - Don't be afraid to experiment

4. **Edit Ingredients** ✏️
   - AI might miss some items
   - You can manually add forgotten ingredients
   - Remove items that aren't food

## Ready to Deploy?

When you're ready to share with others:
1. Read [DEPLOYMENT.md](DEPLOYMENT.md)
2. Deploy to Render.com (free tier available)
3. Share your URL with friends!

## Enjoy!

You're all set! Start uploading fridge photos and discovering amazing recipes.

Happy cooking! 👨‍🍳🍳

---

**Questions?** Check the README.md or create an issue on GitHub.
