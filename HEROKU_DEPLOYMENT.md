# 🚀 Heroku Deployment Guide

## Overview
Deploy your SupplySight backend and frontend to Heroku's free tier.

## Prerequisites
1. **Heroku Account** (free)
2. **Heroku CLI** installed
3. **Git** repository connected

## 🎯 Deployment Strategy

### Option 1: Separate Apps (Recommended)
- **Backend**: `supplysight-backend` (Web Dyno)
- **Frontend**: `supplysight-frontend` (Web Dyno)

### Option 2: Single App with Buildpacks
- One app with multiple buildpacks

---

## 📋 Step-by-Step Deployment

### Step 1: Install Heroku CLI
```bash
# macOS
brew tap heroku/brew && brew install heroku

# Windows
# Download from: https://devcenter.heroku.com/articles/heroku-cli
```

### Step 2: Login to Heroku
```bash
heroku login
```

### Step 3: Deploy Backend

#### 3.1 Create Backend App
```bash
# Navigate to backend directory
cd apps/server

# Create Heroku app
heroku create supplysight-backend

# Set buildpack for Node.js
heroku buildpacks:set heroku/nodejs
```

#### 3.2 Configure Backend
```bash
# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set PORT=10000

# Deploy
git add .
git commit -m "Add Heroku backend configuration"
git push heroku main
```

#### 3.3 Get Backend URL
```bash
heroku info -s | grep web_url
# Copy this URL for frontend configuration
```

### Step 4: Deploy Frontend

#### 4.1 Create Frontend App
```bash
# Navigate to frontend directory
cd apps/web

# Create Heroku app
heroku create supplysight-frontend

# Set buildpack for Node.js
heroku buildpacks:set heroku/nodejs
```

#### 4.2 Configure Frontend
```bash
# Set environment variables (replace with your backend URL)
heroku config:set VITE_GRAPHQL_URL=https://supplysight-backend.herokuapp.com/graphql
heroku config:set VITE_SENTRY_DSN=""

# Deploy
git add .
git commit -m "Add Heroku frontend configuration"
git push heroku main
```

---

## 🔧 Configuration Files

### Backend (apps/server/Procfile)
```
web: npm start
```

### Frontend (apps/web/Procfile)
```
web: npm run serve
```

### Frontend Package.json (updated)
```json
{
  "scripts": {
    "serve": "vite preview --port $PORT --host 0.0.0.0"
  }
}
```

---

## 🌐 URLs After Deployment

- **Backend**: `https://supplysight-backend.herokuapp.com`
- **Frontend**: `https://supplysight-frontend.herokuapp.com`
- **GraphQL Playground**: `https://supplysight-backend.herokuapp.com/graphql`

---

## 🔍 Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Check build logs
heroku logs --tail

# Rebuild
heroku builds:cancel
git push heroku main
```

#### 2. Port Issues
- Heroku sets `$PORT` automatically
- Backend uses `process.env.PORT || 10000`
- Frontend uses `$PORT` in serve script

#### 3. Environment Variables
```bash
# Check current config
heroku config

# Set missing variables
heroku config:set VARIABLE_NAME=value
```

#### 4. Free Dyno Sleep
- Free dynos sleep after 30 minutes
- First request after sleep takes longer
- Consider upgrading for production

---

## 📊 Monitoring

### Check App Status
```bash
# Backend
heroku ps -a supplysight-backend

# Frontend
heroku ps -a supplysight-frontend
```

### View Logs
```bash
# Backend logs
heroku logs --tail -a supplysight-backend

# Frontend logs
heroku logs --tail -a supplysight-frontend
```

---

## 🎉 Success!

Your SupplySight application is now deployed on Heroku's free tier!

- ✅ **Backend**: GraphQL API running
- ✅ **Frontend**: React app connected to backend
- ✅ **Free Tier**: No payment required
- ✅ **Auto-deploy**: Connected to GitHub

---

## 🔄 Updates

To update your application:
```bash
# Make changes to your code
git add .
git commit -m "Update application"
git push origin main

# Deploy to Heroku
git push heroku main
```
