# Deploy Four Cs Bank to Railway

## STEP 1: Push to GitHub

```bash
cd /Users/zacharycritchfield/Desktop/Projects/Bank\ App/BankApp

git remote add origin https://github.com/Critchfieldz21/four-cs-bank.git
git branch -M main
git push -u origin main
```

---

## STEP 2: Create Railway Account

1. Go to https://railway.app
2. Click **Sign Up**
3. Choose **GitHub** (recommended)
4. Authorize Railway to access your GitHub account
5. Complete setup

---

## STEP 3: Create New Project

1. Go to Railway Dashboard
2. Click **New Project**
3. Click **Deploy from GitHub repo**
4. Select your `four-cs-bank` repository
5. Click **Deploy**

---

## STEP 4: Railway Will Auto-Detect

Railway automatically detects:
- ✅ Node.js/React frontend
- ✅ Python/Flask backend
- ✅ Creates PostgreSQL database
- ✅ Sets up environment variables

Wait for deployment (5-10 minutes)

---

## STEP 5: Get Your Backend URL

1. Go to Railway Dashboard
2. Click your project
3. Click the **api** (or Flask) service
4. Go to **Settings**
5. Find **Domains** section
6. Copy the domain URL

Example: `https://four-cs-bank-production.up.railway.app`

---

## STEP 6: Update Environment Variables

1. Go to Railway project
2. Click your **frontend** service
3. Go to **Variables**
4. Add variable:
   - **Name:** `REACT_APP_API_URL`
   - **Value:** `https://your-railway-backend-url.up.railway.app`
   - (Use the URL from Step 5)
5. Click **Save**

---

## STEP 7: Redeploy

1. Go to Railway dashboard
2. Click **Deployments** tab
3. Click **Redeploy** on latest deployment
4. Wait for completion

---

## STEP 8: Test Your App

1. Go to your Railway project
2. Click **frontend** service
3. Click the **Domains** link
4. Your app should load

Test:
- Register a new account
- Login
- View dashboard
- Transfer funds
- Change password

---

## STEP 9: View Database

1. Railway automatically created PostgreSQL
2. Go to your project
3. Click **postgres** service
4. View tables and data

No setup needed! ✅

---

## STEP 10: Custom Domain (Optional)

1. Go to Railway project
2. Click your **frontend** service
3. Go to **Settings** → **Domains**
4. Click **Add Domain**
5. Enter your domain: `bank.yourdomain.com`
6. Follow DNS instructions
7. Wait 5-10 minutes

---

## Troubleshooting

### API calls return 404
**Solution:**
- Check `REACT_APP_API_URL` is set correctly
- Make sure it's the backend domain, not frontend
- Redeploy frontend after updating variable

### Cannot connect to database
**Solution:**
- Railway automatically creates PostgreSQL
- Check in **postgres** service
- Verify `DATABASE_URL` env var exists

### Build failed
**Solution:**
- Check build logs in Railway dashboard
- Verify all dependencies are in package.json
- Check Python version compatibility

### Changes not showing
**Solution:**
- Push to GitHub
- Railway auto-redeploys on push
- Check Deployments tab to see progress

---

## Environment Variables Reference

Railway automatically sets these (no action needed):

```
DATABASE_URL = (auto-generated PostgreSQL connection)
```

You only need to add:

```
REACT_APP_API_URL = https://your-backend-url.up.railway.app
```

---

## Key Differences from Vercel

| Feature | Vercel | Railway |
|---------|--------|---------|
| Frontend + Backend | Separate config | Works together |
| Database | Manual setup | Built-in PostgreSQL |
| Setup time | 10-15 min | 5 min |
| Free tier | Yes | Yes |
| Custom domain | Yes | Yes |
| Easier | Harder | **Easier** ✅ |

---

## Done! 🎉

Your app is now deployed on Railway!

**What's Included:**
- ✅ React Frontend
- ✅ Flask Backend
- ✅ PostgreSQL Database
- ✅ Auto SSL/HTTPS
- ✅ Custom domains
- ✅ Auto-redeploy on GitHub push

**Next Steps:**
- Share your Railway URL
- Monitor performance in dashboard
- Set up custom domain
- Configure backups

---

## Railway Dashboard Tips

**In Railway Dashboard you can:**
- View logs (click service → **Logs**)
- Check environment variables (click service → **Variables**)
- Redeploy anytime (click **Deployments** → **Redeploy**)
- Scale resources (click service → **Settings**)
- Monitor metrics (click service → **Metrics**)

---

## Getting Help

- Railway Docs: https://docs.railway.app
- Discord Community: https://discord.gg/railway
- GitHub Issues: Check your repo for any errors
