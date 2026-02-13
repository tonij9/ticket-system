# Deployment Guide

This guide will help you deploy your ticket system to make it publicly accessible.

## Prerequisites

1. Create accounts on:
   - [GitHub](https://github.com) - for code hosting
   - [Railway](https://railway.app) - for backend hosting
   - [Vercel](https://vercel.com) - for frontend hosting

## Step 1: Prepare Your Code

### Initialize Git Repository (if not already done)

```bash
cd C:\Users\Toni_\ticket-system
git init
git add .
git commit -m "Initial commit"
```

### Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Create a new repository named `ticket-system`
3. Don't initialize with README (we already have code)
4. Copy the repository URL

### Push to GitHub

```bash
git remote add origin YOUR_GITHUB_REPO_URL
git branch -M main
git push -u origin main
```

## Step 2: Deploy Backend to Railway

### 2.1: Sign Up and Create Project

1. Go to [Railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your `ticket-system` repository
6. Railway will detect it's a Python project

### 2.2: Configure Backend

1. In Railway dashboard, click on your service
2. Go to "Settings" > "Environment Variables"
3. Add these variables:
   ```
   PORT=8000
   FRONTEND_URL=https://your-frontend-url.vercel.app
   SECRET_KEY=generate-a-random-secret-key-here
   DATABASE_URL=postgresql://... (Railway will provide this if you add PostgreSQL)
   ```

### 2.3: Add PostgreSQL Database (Optional but Recommended)

1. In your Railway project, click "+ New"
2. Select "Database" > "PostgreSQL"
3. Railway will automatically set the DATABASE_URL environment variable
4. Your backend will connect to it automatically

### 2.4: Deploy

1. Railway will automatically deploy your backend
2. Once deployed, copy your backend URL (e.g., `https://your-app.up.railway.app`)
3. You'll need this for the frontend

## Step 3: Deploy Frontend to Vercel

### 3.1: Sign Up and Import Project

1. Go to [Vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New..." > "Project"
4. Import your `ticket-system` repository
5. Vercel will detect it's a Vite project

### 3.2: Configure Frontend

1. Set the "Root Directory" to `frontend`
2. Framework Preset: Vite
3. Build Command: `npm run build`
4. Output Directory: `dist`

### 3.3: Add Environment Variables

In the "Environment Variables" section, add:
```
VITE_API_URL=https://your-backend-url.up.railway.app/api
```

Replace `your-backend-url` with your actual Railway URL from Step 2.4

### 3.4: Deploy

1. Click "Deploy"
2. Wait for deployment to complete (1-2 minutes)
3. You'll get a URL like `https://ticket-system.vercel.app`

## Step 4: Update Backend CORS

1. Go back to Railway
2. Update the `FRONTEND_URL` environment variable with your Vercel URL:
   ```
   FRONTEND_URL=https://ticket-system.vercel.app
   ```
3. Railway will automatically redeploy

## Step 5: Test Your Deployment

1. Visit your Vercel URL (e.g., `https://ticket-system.vercel.app`)
2. You should see the login page
3. Try logging in with your credentials
4. Create a test ticket to verify everything works

## Updating Your Website After Deployment

### To update the website:

1. Make changes locally
2. Test locally to ensure everything works
3. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```
4. Both Railway and Vercel will automatically redeploy with your changes!

## Troubleshooting

### Backend not connecting to database
- Check that DATABASE_URL is set correctly in Railway
- Make sure PostgreSQL addon is added to your Railway project

### Frontend can't reach backend
- Verify VITE_API_URL is set correctly in Vercel
- Check that FRONTEND_URL is set correctly in Railway (for CORS)
- Make sure both URLs use HTTPS

### Login not working
- Check browser console for errors
- Verify API_URL in frontend matches your Railway backend URL
- Check that SECRET_KEY is set in Railway backend

## Environment Variables Summary

### Backend (Railway):
- `PORT` - Port number (Railway sets this automatically)
- `FRONTEND_URL` - Your Vercel frontend URL
- `SECRET_KEY` - Random secret for JWT tokens
- `DATABASE_URL` - PostgreSQL connection (Railway sets if you add database)

### Frontend (Vercel):
- `VITE_API_URL` - Your Railway backend URL + /api

## Need Help?

If you encounter issues:
1. Check Railway logs: Railway Dashboard > Your Service > Deployments > Logs
2. Check Vercel logs: Vercel Dashboard > Your Project > Deployments > View Logs
3. Check browser console for frontend errors (F12 in browser)

## Cost

Both Railway and Vercel offer free tiers:
- **Railway**: Free $5/month credit (enough for small apps)
- **Vercel**: Free for personal projects

Your ticket system should easily run on free tiers!
