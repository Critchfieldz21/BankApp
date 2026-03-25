# Four Cs Bank - Full Stack Application

A modern banking application built with React frontend and Python Flask backend, optimized for deployment on Vercel.

## Features

✨ **User Authentication** - Secure login and registration system
💰 **Account Management** - View balance, account details, and transaction history
📊 **Transactions** - Deposits, withdrawals, and fund transfers
🎨 **Modern UI** - Responsive design with creamsicle color scheme
🚀 **Production Ready** - Configured for Vercel deployment

## Project Structure

```
Four-Cs-Bank/
├── frontend/              # React application (Create React App)
├── backend/               # Python Flask API (local development)
├── api/                   # Flask serverless function (Vercel)
├── vercel.json            # Vercel configuration
├── package.json           # Root project configuration
├── DEPLOYMENT.md          # Deployment guide
└── README.md              # This file
```

## Tech Stack

**Frontend:**
- React 19.2.4
- Axios for API calls
- CSS3 with gradients and animations
- React Hooks for state management

**Backend:**
- Python 3.11+
- Flask 2.3.3
- SQLAlchemy ORM
- SQLite (development) / PostgreSQL (production)
- Flask-CORS for cross-origin requests

## Getting Started

### Local Development

#### 1. Frontend Setup
```bash
cd frontend
npm install
npm start
```
Frontend runs on: `http://localhost:3001`

#### 2. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python3 app.py
```
Backend runs on: `http://localhost:5000`

#### 3. Run Both Concurrently
```bash
npm run dev
```

### Environment Setup

Create `frontend/.env.local` for local development:
```
REACT_APP_API_URL=http://localhost:5000
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on deploying to Vercel.

Quick start:
1. Push code to GitHub
2. Import repository to Vercel
3. Set environment variables
4. Deploy!

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - User login

### Transactions
- `GET /api/transactions/<user_id>` - Get user transactions
- `POST /api/transactions/<user_id>` - Create transaction (deposit/withdrawal/transfer)

### User
- `GET /api/user/<user_id>` - Get user details
- `GET /api/user/search` - Search user by username and email
- `POST /api/user/reset-password` - Reset user password

### Health
- `GET /api/health` - Check backend status
- `GET /api/user/profile` - Get user profile

## Technology Stack

- **Frontend**: React, Axios, CSS3
- **Backend**: Python, Flask, SQLite
- **Database**: SQLite (Development)

## Development

Both frontend and backend run in parallel. Make sure to start both servers before testing.
