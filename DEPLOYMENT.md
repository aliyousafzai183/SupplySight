# Deployment Guide - Render

This guide will help you deploy the SupplySight application to Render for free.

## 🚀 Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **GitHub Secrets**: You'll need to add some secrets to your GitHub repository

## 📋 Step-by-Step Deployment

### Step 1: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account
3. Verify your email address

### Step 2: Deploy Backend (GraphQL Server)

1. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

2. **Configure Backend Service**
   - **Name**: `supplysight-backend`
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: Leave empty (root)
   - **Build Command**: `cd apps/server && npm install && npm run build`
   - **Start Command**: `cd apps/server && npm start`

3. **Environment Variables**
   - `NODE_ENV`: `production`
   - `PORT`: `10000`

4. **Click "Create Web Service"**

### Step 3: Deploy Frontend (React App)

1. **Create New Static Site**
   - Click "New +" → "Static Site"
   - Connect your GitHub repository (same repo)

2. **Configure Frontend Service**
   - **Name**: `supplysight-frontend`
   - **Branch**: `main`
   - **Root Directory**: Leave empty (root)
   - **Build Command**: `cd apps/web && npm install && npm run build`
   - **Publish Directory**: `apps/web/dist`

3. **Environment Variables**
   - `VITE_GRAPHQL_URL`: `https://supplysight-backend.onrender.com/graphql`
   - `VITE_SENTRY_DSN`: (leave empty)

4. **Click "Create Static Site"**

### Step 4: Get Service IDs

1. **Backend Service ID**
   - Go to your backend service dashboard
   - Copy the Service ID from the URL or settings

2. **Frontend Service ID**
   - Go to your frontend service dashboard
   - Copy the Service ID from the URL or settings

### Step 5: Get Render API Token

1. Go to your Render dashboard
2. Click on your profile → "Account Settings"
3. Go to "API Keys" section
4. Click "Create API Key"
5. Copy the generated token

### Step 6: Configure GitHub Secrets

1. Go to your GitHub repository
2. Click "Settings" → "Secrets and variables" → "Actions"
3. Add the following secrets:

```
RENDER_TOKEN: your-render-api-token
RENDER_SERVICE_ID_BACKEND: your-backend-service-id
RENDER_SERVICE_ID_FRONTEND: your-frontend-service-id
```

### Step 7: Test Deployment

1. **Backend Test**
   - Visit: `https://supplysight-backend.onrender.com/graphql`
   - You should see the GraphQL Playground

2. **Frontend Test**
   - Visit: `https://supplysight-frontend.onrender.com`
   - You should see the SupplySight dashboard

## 🔄 Automatic Deployment

Once configured, every push to the `main` branch will automatically:
1. Run all CI checks (lint, test, typecheck, build)
2. Deploy backend to Render
3. Deploy frontend to Render

## 🌐 Custom Domain (Optional)

1. **Backend Domain**
   - Go to backend service settings
   - Click "Custom Domains"
   - Add your domain (e.g., `api.yourdomain.com`)

2. **Frontend Domain**
   - Go to frontend service settings
   - Click "Custom Domains"
   - Add your domain (e.g., `yourdomain.com`)

3. **Update Environment Variables**
   - Update `VITE_GRAPHQL_URL` to point to your custom backend domain

## 📊 Monitoring

### Render Dashboard
- **Logs**: View real-time logs for both services
- **Metrics**: Monitor performance and usage
- **Deployments**: Track deployment history

### GitHub Actions
- **CI/CD**: Monitor build and deployment status
- **Logs**: View detailed deployment logs

## 🔧 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check build logs in Render dashboard
   - Verify build commands are correct
   - Ensure all dependencies are in package.json

2. **CORS Errors**
   - Verify CORS configuration in backend
   - Check frontend URL is in allowed origins

3. **Environment Variables**
   - Ensure all required variables are set
   - Check variable names match code expectations

4. **Service Not Starting**
   - Check start command is correct
   - Verify port configuration
   - Review application logs

### Debug Commands

```bash
# Check backend logs
curl https://supplysight-backend.onrender.com/graphql

# Check frontend build
curl https://supplysight-frontend.onrender.com

# Test GraphQL endpoint
curl -X POST https://supplysight-backend.onrender.com/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ products { id name } }"}'
```

## 💰 Cost Management

### Free Tier Limits
- **750 hours/month** per service
- **Auto-sleep** after 15 minutes of inactivity
- **512MB RAM** per service
- **Shared CPU** resources

### Optimization Tips
- **Auto-sleep** is enabled by default (good for free tier)
- **Monitor usage** in Render dashboard
- **Scale up** only when needed

## 🎉 Success!

Your SupplySight application is now deployed and will automatically update on every push to main!

- **Frontend**: https://supplysight-frontend.onrender.com
- **Backend**: https://supplysight-backend.onrender.com/graphql
- **GraphQL Playground**: https://supplysight-backend.onrender.com/graphql
