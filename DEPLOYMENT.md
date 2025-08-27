# 🚀 Deployment Guide

## Heroku Deployment

### Prerequisites
- Heroku account
- Heroku CLI installed
- Git repository access

### Quick Setup

1. **Install Heroku CLI**
   ```bash
   # macOS
   brew tap heroku/brew && brew install heroku
   
   # Or download from: https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Apps**
   ```bash
   # Backend
   heroku create supplysight-backend --buildpack heroku/nodejs
   
   # Frontend
   heroku create supplysight-frontend --buildpack heroku/nodejs
   ```

4. **Configure Environment Variables**
   ```bash
   # Backend
   heroku config:set NODE_ENV=production -a supplysight-backend
   
   # Frontend (replace with your actual backend URL)
   heroku config:set VITE_GRAPHQL_URL=https://supplysight-backend-XXXXX.herokuapp.com/graphql -a supplysight-frontend
   ```

5. **Connect GitHub Repository**
   - Go to Heroku Dashboard
   - Select each app
   - Go to "Deploy" tab
   - Connect GitHub repository
   - Set root directory:
     - Backend: `apps/server`
     - Frontend: `apps/web`
   - Enable auto-deploy

### URLs
- **Backend**: `https://supplysight-backend-XXXXX.herokuapp.com`
- **Frontend**: `https://supplysight-frontend-XXXXX.herokuapp.com`
- **GraphQL Playground**: `https://supplysight-backend-XXXXX.herokuapp.com/graphql`

### Troubleshooting

#### Check Logs
```bash
# Backend logs
heroku logs --tail -a supplysight-backend

# Frontend logs
heroku logs --tail -a supplysight-frontend
```

#### Common Issues
1. **Build failures**: Check if all dependencies are installed
2. **Port issues**: Heroku sets `$PORT` automatically
3. **Missing files**: Ensure build scripts copy all necessary files

### Development
```bash
# Install dependencies
npm install

# Run development servers
npm run dev

# Build for production
npm run build
```
