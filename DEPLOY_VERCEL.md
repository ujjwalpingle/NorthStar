# Deploy to Vercel - Auto Deployment Guide

## Step 1: Push Code to GitHub

### Option A: If you already have a GitHub repo
```bash
cd c:\Users\pingl\OneDrive\Documents\NorthStar
git add .
git commit -m "feat: add supabase database and authentication"
git push origin main
```

### Option B: Create a new GitHub repo
1. Go to https://github.com/new
2. Name it `NorthStar` (or any name you prefer)
3. **DO NOT** initialize with README (you have one already)
4. Create the repository
5. Run these commands in VS Code terminal:
```bash
cd c:\Users\pingl\OneDrive\Documents\NorthStar
git remote add origin https://github.com/YOUR_USERNAME/NorthStar.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy to Vercel

### Method 1: Import from GitHub (Recommended - Auto Deploy)
1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Paste your GitHub repo URL: `https://github.com/YOUR_USERNAME/NorthStar`
5. Click **"Import"**
6. Configure environment variables:
   - Click **"Environment Variables"**
   - Add these:
     - `NEXT_PUBLIC_SUPABASE_URL` = (from Supabase dashboard)
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (from Supabase dashboard)
7. Click **"Deploy"**
8. Wait 2-3 minutes for deployment to complete

### Result
- ✅ Your app is live at `https://yourapp.vercel.app`
- ✅ Auto-deploys whenever you push to GitHub
- ✅ Preview deploys for pull requests

---

## Step 3: Verify Auto-Deployment

1. Make a small change in your code (e.g., update README)
2. Push to GitHub:
   ```bash
   git add .
   git commit -m "test: verify auto deployment"
   git push
   ```
3. Go to https://vercel.com/dashboard
4. Watch the deployment automatically start
5. Check your live URL in 1-2 minutes

---

## Environment Variables on Vercel

**Important:** Your `.env.local` is in `.gitignore` (not committed)

So on Vercel, you MUST set environment variables manually:

1. Go to **Project Settings** → **Environment Variables**
2. Add:
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJxxx...
   ```
3. Click **"Save"**
4. Redeploy (click **"Deployments"** → right-click latest → **"Redeploy"**)

---

## Troubleshooting

### "Build failed" error
- Check environment variables are set in Vercel
- Make sure `package.json` is in the root (it is ✓)
- Check `next.config.ts` for any path issues

### "Cannot find module" errors
- Clear Vercel cache: **Settings** → **Git** → **Clear Cache** → **Redeploy**

### App works locally but not on Vercel
- Supabase variables not set → Add them in Vercel Settings
- Check Supabase API is accessible from Vercel (should be ✓)

---

## Quick Command Reference

```bash
# Stage all changes
git add .

# Commit with message
git commit -m "your message here"

# Push to GitHub
git push

# View git log
git log --oneline

# Check git status
git status
```

---

## Your Deployment URLs

After deployment:
- **Production**: `https://northstar-xxxxx.vercel.app`
- **Git Repo**: `https://github.com/YOUR_USERNAME/NorthStar`
- **Vercel Dashboard**: https://vercel.com/dashboard

---

## Next Steps

1. ✅ Push code to GitHub (see Step 1)
2. ✅ Deploy to Vercel (see Step 2)
3. ✅ Verify auto-deployment (see Step 3)
4. Share your live app with others!

**Need help?** 
- Vercel docs: https://vercel.com/docs
- GitHub docs: https://docs.github.com
