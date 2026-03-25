# BankApp Railway Configuration

## Deployment Structure

Railway will auto-detect your project as a monorepo with both Node.js (frontend) and Python (backend).

### Frontend (React)
- **Framework Detection:** Create React App
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start` (development) or served from build folder
- **Port:** 3000 (development) or 5000 (production)

### Backend (Flask)
- **Framework Detection:** Python with Flask
- **Start Command:** `gunicorn -w 4 -b 0.0.0.0:$PORT app:app`
- **Port:** 5000 (exposed as Railway service)
- **Requirements File:** `backend/requirements.txt`

## Environment Variables Required

### Frontend Service
```
REACT_APP_API_URL=<backend-service-url>
PORT=3000
NODE_ENV=production
```

### Backend Service
```
FLASK_ENV=production
DATABASE_URL=<postgresql-url-from-railway>
PORT=5000
SECRET_KEY=<generate-strong-secret-key>
```

## How Railway Deploys This

1. **Detects monorepo structure** (frontend/ + backend/)
2. **Creates two services:**
   - Web service (Node.js) for frontend
   - API service (Python) for backend
3. **Auto-creates PostgreSQL database** (if needed)
4. **Sets up networking** between services
5. **Assigns public URLs** to each service

## Important Notes

- Gunicorn is now in `backend/requirements.txt`
- Procfile tells Railway how to start backend
- Frontend build is served as static files
- Backend API handles all /api/* routes
- Database URL auto-injected by Railway

## Troubleshooting

If services don't start:
1. Check Railway logs for each service
2. Verify environment variables are set
3. Ensure `requirements.txt` has gunicorn
4. Check that Procfile exists in root

---

**Status:** ✅ Ready for Railway
