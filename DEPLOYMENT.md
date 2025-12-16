# Deployment Guide - FridgeChef AI

This guide will walk you through deploying FridgeChef AI to Render.com for production use.

## Quick Deploy Checklist

- [ ] GitHub repository created and code pushed
- [ ] Anthropic API key ready
- [ ] Render account created
- [ ] Backend deployed
- [ ] Frontend deployed
- [ ] Environment variables configured
- [ ] App tested in production

## Detailed Deployment Steps

### Part 1: Prepare Your Repository

1. **Initialize Git** (if not already done):
   ```bash
   cd fridge-chef-ai
   git init
   git add .
   git commit -m "Initial commit: FridgeChef AI"
   ```

2. **Create GitHub Repository**:
   - Go to https://github.com/new
   - Create a new repository (e.g., `fridge-chef-ai`)
   - Don't initialize with README (you already have one)

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/fridge-chef-ai.git
   git branch -M main
   git push -u origin main
   ```

### Part 2: Deploy Backend to Render

1. **Sign up/Login to Render**:
   - Go to https://render.com
   - Sign up or log in (can use GitHub authentication)

2. **Create New Web Service**:
   - Click "New +" button in dashboard
   - Select "Web Service"
   - Connect your GitHub account if not already connected
   - Select your `fridge-chef-ai` repository

3. **Configure Backend Service**:

   **Basic Settings**:
   - Name: `fridge-chef-api` (or your preferred name)
   - Region: Choose closest to your users
   - Branch: `main`
   - Root Directory: `server`
   - Runtime: `Node`

   **Build & Deploy**:
   - Build Command: `npm install`
   - Start Command: `npm start`

   **Instance Type**:
   - Free (for testing)
   - Starter or higher (for production)

4. **Add Environment Variables**:
   Click "Advanced" → "Add Environment Variable":

   ```
   ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
   NODE_ENV=production
   PORT=3001
   CLIENT_URL=https://your-frontend-url.onrender.com
   ```

   **Note**: You'll update `CLIENT_URL` after deploying the frontend

5. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment to complete (5-10 minutes)
   - Copy your backend URL: `https://fridge-chef-api.onrender.com`

### Part 3: Deploy Frontend to Render

1. **Create New Static Site**:
   - Click "New +" button
   - Select "Static Site"
   - Select your `fridge-chef-ai` repository

2. **Configure Frontend Site**:

   **Basic Settings**:
   - Name: `fridge-chef-ai`
   - Branch: `main`
   - Root Directory: `client`

   **Build Settings**:
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

3. **Add Environment Variable**:

   ```
   VITE_API_URL=https://fridge-chef-api.onrender.com/api
   ```

   **Replace** `fridge-chef-api.onrender.com` with your actual backend URL

4. **Deploy**:
   - Click "Create Static Site"
   - Wait for deployment (3-5 minutes)
   - Copy your frontend URL: `https://fridge-chef-ai.onrender.com`

### Part 4: Update Backend CORS

1. **Go back to Backend Service**:
   - Navigate to your backend web service in Render
   - Go to "Environment" tab

2. **Update CLIENT_URL**:
   - Edit the `CLIENT_URL` environment variable
   - Set it to your frontend URL (from Part 3)
   - Example: `https://fridge-chef-ai.onrender.com`

3. **Redeploy**:
   - Click "Manual Deploy" → "Deploy latest commit"
   - Wait for redeployment

### Part 5: Test Your Deployment

1. **Visit Your App**:
   - Open your frontend URL in a browser
   - Test on both desktop and mobile

2. **Test Features**:
   - [ ] Landing page loads correctly
   - [ ] Image upload works
   - [ ] AI ingredient detection works
   - [ ] Recipe browser generates recipes
   - [ ] Health chat works
   - [ ] All navigation works
   - [ ] Mobile responsiveness works

3. **Check for Errors**:
   - Open browser console (F12)
   - Check for any red errors
   - Check Render logs if issues occur

## Free Tier Limitations

Render's free tier has some limitations:
- Services spin down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- 750 hours of usage per month (enough for light use)

**Solutions**:
- Upgrade to paid tier ($7/month) for always-on service
- Use a cron job to ping your server every 10 minutes
- Accept the cold start delay

## Environment Variables Reference

### Backend (.env)
```env
ANTHROPIC_API_KEY=your_anthropic_api_key
NODE_ENV=production
PORT=3001
CLIENT_URL=https://your-frontend-url.onrender.com
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

## Troubleshooting

### Backend won't start
- Check Render logs: Service → Logs tab
- Verify all environment variables are set
- Verify build completed successfully
- Check that Node version is compatible (18+)

### Frontend shows API errors
- Verify VITE_API_URL is correct
- Check backend is running (visit backend URL + /api/health)
- Verify CORS is configured with correct CLIENT_URL
- Check browser console for specific errors

### Images not uploading
- Check backend logs for errors
- Verify Anthropic API key is valid
- Check API key has sufficient credits
- Verify image size is under 10MB

### Slow performance
- Free tier spins down - upgrade to paid tier
- Check Anthropic API response times
- Consider adding caching for recipes

## Custom Domain (Optional)

To use your own domain:

1. **Purchase a domain** (from Namecheap, Google Domains, etc.)

2. **Add to Render**:
   - Go to your static site settings
   - Click "Custom Domain"
   - Follow instructions to add DNS records

3. **Update environment variables**:
   - Update backend `CLIENT_URL` with your custom domain
   - Redeploy backend

## Monitoring

### View Logs
- **Backend**: Service → Logs
- **Frontend**: Static Site → Logs

### Check Health
- Backend health: `https://your-backend-url.onrender.com/api/health`
- Should return: `{"status": "ok", "message": "FridgeChef AI Server is running"}`

### Monitor Usage
- Anthropic Console: https://console.anthropic.com/
- Check API usage and costs

## Costs

### Free Tier
- Render: Free (with limitations)
- Anthropic: Pay per API call (~$0.003 per image analysis, ~$0.015 per recipe generation)

### Estimated Monthly Costs
- **Light usage** (100 requests): ~$5/month
- **Medium usage** (1000 requests): ~$50/month
- Add Render paid tier: +$7/month for backend

## Updates & Maintenance

### Deploying Updates

1. **Make changes locally**
2. **Commit and push**:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```
3. **Render auto-deploys** from GitHub (if auto-deploy enabled)
4. Or manually trigger deploy in Render dashboard

### Backup Strategy
- Code is backed up in GitHub
- No database to backup (stateless app)
- Save important recipes locally if needed

## Security Best Practices

1. **Never commit .env files** (already in .gitignore)
2. **Rotate API keys** periodically
3. **Monitor API usage** for unusual activity
4. **Keep dependencies updated**:
   ```bash
   npm audit
   npm update
   ```

## Support Resources

- **Render Documentation**: https://render.com/docs
- **Anthropic API Docs**: https://docs.anthropic.com/
- **React Documentation**: https://react.dev/

## Success!

If you've completed all steps, your FridgeChef AI app should be live and accessible worldwide! 🎉

Share your URL and start helping people transform their fridges into delicious meals!

---

Need help? Open an issue on GitHub or check the README.md for more information.
