# Vercel Deployment - Step by Step Guide

## Prerequisites
- GitHub account with your code pushed
- Vercel account (free at vercel.com)
- PostgreSQL database (optional but recommended)

---

## Step 1: Push Code to GitHub

```bash
cd /Users/zacharycritchfield/Desktop/Projects/Bank\ App/BankApp

git remote add origin https://github.com/YOUR_USERNAME/four-cs-bank.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

---

## Step 2: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click **Sign Up**
3. Choose **Continue with GitHub**
4. Authorize Vercel to access your GitHub account
5. Complete the setup

---

## Step 3: Import Project to Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Click **Import Git Repository**
4. Find and select `four-cs-bank` repository
5. Click **Import**

---

## Step 4: Configure Build Settings

On the "Configure Project" page:

### Framework Preset
- Leave as **Other** (Vercel will auto-detect)

### Root Directory
- Leave as **default** (should be `/`)

### Build Command
- Leave as: `npm run build`

### Output Directory  
- Leave as: `frontend/build`

### Install Command
- Leave as: `npm install`

Click **Deploy** to proceed (you can set environment variables next)

---

## Step 5: Set Environment Variables

After clicking Deploy, you'll see a screen for "Environment Variables".

**Add these variables:**

### For Frontend
```
REACT_APP_API_URL = https://your-vercel-domain.vercel.app
```

### For Backend (Optional - only if using database)
```
DATABASE_URL = postgresql://user:password@host:port/dbname
SECRET_KEY = your-random-secret-key-here
```

**To get your Vercel domain:**
- It will be shown as: `https://four-cs-bank-xxxxx.vercel.app`
- Use this as your `REACT_APP_API_URL`

Click **Deploy** after adding variables.

---

## Step 6: Wait for Deployment

Vercel will:
1. Build your frontend (React)
2. Deploy your backend (Flask serverless)
3. Connect everything together

This takes 2-5 minutes. You'll see a progress indicator.

---

## Step 7: Test Your Application

Once deployment completes:

1. Click the **Visit** button or go to your deployment URL
2. You should see the Four Cs Bank login page
3. Test the following:
   - **Register**: Create a new account
   - **Login**: Sign in with credentials
   - **Dashboard**: View account and balance
   - **Transfer**: Test fund transfer
   - **Settings**: View account settings
   - **Password Reset**: Test forgot password flow

---

## Step 8: Set Up Custom Domain (Optional)

1. Go to your Vercel project settings
2. Click **Domains**
3. Click **Add Domain**
4. Enter your custom domain (e.g., `bank.yourdomain.com`)
5. Follow instructions to update DNS records

---

## Step 9: Configure Database (Recommended for Production)

**If using SQLite** (default):
- Your data will be stored on Vercel's ephemeral storage
- Data may be lost on redeployment
- Only good for testing

**If using PostgreSQL** (recommended):

### Option A: Use Vercel Postgres
1. Go to Vercel Dashboard
2. Click **Storage** → **Create Database** → **Postgres**
3. Copy the connection string
4. Add to Environment Variables as `DATABASE_URL`

### Option B: Use External Database
1. Create PostgreSQL database on:
   - [Heroku](https://www.heroku.com)
   - [Railway](https://railway.app)
   - [Render](https://render.com)
   - [AWS RDS](https://aws.amazon.com/rds)
2. Get connection string
3. Add to Environment Variables as `DATABASE_URL`

### Update Environment Variable
1. Go to Vercel Project Settings
2. Click **Environment Variables**
3. Add/Update `DATABASE_URL`
4. Click **Save**
5. Redeploy (click **Deployments** → **Redeploy**)

---

## Step 10: Monitor and Manage

### View Logs
1. Go to Vercel Dashboard
2. Click your project
3. Go to **Functions** tab to see backend logs

### Monitor Analytics
1. Click **Analytics** tab
2. View page speed, errors, and traffic

### Check Database
1. If using Vercel Postgres: Go to **Storage** → **Postgres** → **Dashboard**
2. View data, backups, and usage

---

## Troubleshooting

### API calls failing after deployment
**Problem**: "Cannot GET /api/..."
**Solution**: 
- Check `REACT_APP_API_URL` is set in environment variables
- Make sure it matches your Vercel domain

### Database connection error
**Problem**: "could not connect to server"
**Solution**:
- Verify `DATABASE_URL` is correct
- Check database is running and accessible
- Try with SQLite first to test

### Build failed
**Problem**: "Build process exited with code 1"
**Solution**:
- Check build logs for errors
- Ensure all dependencies are in `requirements.txt`
- Check Node.js version compatibility

### 404 on API routes
**Problem**: "Cannot POST /api/auth/login"
**Solution**:
- Verify `vercel.json` is in root directory
- Check `api/index.py` exists
- Rebuild and redeploy

---

## After Deployment Checklist

- [ ] Visit your deployed URL
- [ ] Test user registration
- [ ] Test user login
- [ ] Test dashboard page
- [ ] Test transactions
- [ ] Test fund transfer
- [ ] Test settings page
- [ ] Test password reset
- [ ] Check browser console for errors
- [ ] Set up custom domain (optional)
- [ ] Configure production database
- [ ] Enable monitoring/analytics
- [ ] Share your app!

---

## Key URLs and Information

**Your Application URLs:**
- Frontend: `https://your-vercel-domain.vercel.app`
- API: `https://your-vercel-domain.vercel.app/api`

**Important Endpoints:**
- Auth: `https://your-vercel-domain.vercel.app/api/auth/login`
- Transactions: `https://your-vercel-domain.vercel.app/api/transactions/`
- Health: `https://your-vercel-domain.vercel.app/api/health`

---

## Environment Variables Reference

| Variable | Value | Required |
|----------|-------|----------|
| `REACT_APP_API_URL` | Your Vercel domain | Yes |
| `DATABASE_URL` | PostgreSQL connection | No (uses SQLite if not set) |
| `SECRET_KEY` | Random secure string | No (has default) |

---

## Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **React Docs**: https://react.dev
- **Flask Docs**: https://flask.palletsprojects.com
- **Project Files**: Check `DEPLOYMENT.md` in your repository

---

**You're ready to deploy! 🚀**
