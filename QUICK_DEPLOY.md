# Quick Deployment Guide

## 🚀 Deploy to Render in 3 Steps

### Step 1: Set Environment Variable

```bash
# Set your Render API key as environment variable
export RENDER_API_KEY=
```

### Step 2: Run Deployment Script

```bash
# Navigate to terraform directory
cd terraform

# Run the deployment script
./deploy.sh
```

### Step 3: Add GitHub Secret (for automatic deployments)

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Add new secret:
   - **Name**: `RENDER_API_KEY`
   - **Value**: ``

## 🎯 What Happens

The deployment script will:
1. ✅ Check if API key is set
2. 📋 Initialize Terraform
3. 📋 Create deployment plan
4. 🤔 Ask for confirmation
5. 🚀 Deploy to Render
6. 🌐 Show your application URLs

## 🌐 Your URLs

After deployment, you'll get:
- **Frontend**: `https://supplysight-frontend.onrender.com`
- **Backend**: `https://supplysight-backend.onrender.com`
- **GraphQL Playground**: `https://supplysight-backend.onrender.com/graphql`

## 🔄 Automatic Deployment

Once you add the GitHub secret, every push to main will automatically deploy your changes!

## 🛠️ Manual Commands (Alternative)

If you prefer manual commands:

```bash
cd terraform

# Initialize
terraform init

# Plan
terraform plan -var="render_token="

# Apply
terraform apply -var="render_token="
```

## 💰 Cost: $0

- **Free tier** on Render
- **750 hours/month** per service
- **Auto-sleep** when not in use
