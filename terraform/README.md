# Terraform Deployment for SupplySight

This directory contains Terraform configuration for deploying the SupplySight application to Render.

## 🚀 Prerequisites

1. **Terraform** (version >= 1.0)
2. **Render API Token**
3. **GitHub Repository** access

## 📋 Setup Instructions

### 1. Install Terraform

```bash
# macOS
brew install terraform

# Ubuntu/Debian
sudo apt-get update && sudo apt-get install -y gnupg software-properties-common
wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update && sudo apt install terraform

# Windows
# Download from https://www.terraform.io/downloads.html
```

### 2. Get Render API Token

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click on your profile → "Account Settings"
3. Go to "API Keys" section
4. Click "Create API Key"
5. Copy the generated token

### 3. Configure Terraform

```bash
# Navigate to terraform directory
cd terraform

# Copy example configuration
cp terraform.tfvars.example terraform.tfvars

# Edit terraform.tfvars with your values
nano terraform.tfvars
```

Update `terraform.tfvars`:
```hcl
github_repo_url = "https://github.com/aliyousafzai183/SupplySight"
render_token    = "your-actual-render-api-token"
environment     = "prod"
region          = "us-east-1"
```

### 4. Initialize Terraform

```bash
terraform init
```

### 5. Plan Deployment

```bash
terraform plan
```

This will show you what resources will be created.

### 6. Deploy

```bash
terraform apply
```

Type `yes` when prompted to confirm.

## 🔄 GitHub Actions Integration

### 1. Add GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:
- `RENDER_TOKEN`: Your Render API token

### 2. Automatic Deployment

The GitHub Actions workflow will automatically:
- Run on pushes to main branch
- Plan Terraform changes
- Apply changes automatically
- Output the service URLs

## 📊 Infrastructure Overview

### Resources Created

1. **Backend Service** (`supplysight-backend`)
   - Type: Web Service
   - Plan: Free
   - Build: `cd apps/server && npm install && npm run build`
   - Start: `cd apps/server && npm start`

2. **Frontend Service** (`supplysight-frontend`)
   - Type: Static Site
   - Plan: Free
   - Build: `cd apps/web && npm install && npm run build`
   - Publish: `apps/web/dist`

### Environment Variables

**Backend:**
- `NODE_ENV`: production
- `PORT`: 10000

**Frontend:**
- `VITE_GRAPHQL_URL`: Points to backend GraphQL endpoint
- `VITE_SENTRY_DSN`: (empty)

## 🛠️ Management Commands

### View Current State
```bash
terraform show
```

### View Outputs
```bash
terraform output
```

### Destroy Infrastructure
```bash
terraform destroy
```

### Update Configuration
```bash
# Edit terraform files
terraform plan
terraform apply
```

## 🔧 Troubleshooting

### Common Issues

1. **API Token Issues**
   ```bash
   export RENDER_TOKEN="your-token"
   terraform plan
   ```

2. **State Lock Issues**
   ```bash
   terraform force-unlock <lock-id>
   ```

3. **Provider Issues**
   ```bash
   terraform init -upgrade
   ```

### Debug Commands

```bash
# Check Terraform version
terraform version

# Validate configuration
terraform validate

# Format code
terraform fmt

# Check plan without applying
terraform plan -out=tfplan
```

## 🌐 URLs

After deployment, you'll get:
- **Backend**: `https://supplysight-backend.onrender.com`
- **Frontend**: `https://supplysight-frontend.onrender.com`
- **GraphQL Playground**: `https://supplysight-backend.onrender.com/graphql`

## 💰 Cost Management

- **Free tier**: 750 hours/month per service
- **Auto-sleep**: Enabled by default
- **Monitoring**: Check Render dashboard for usage

## 🔒 Security

- **API Token**: Stored as GitHub secret
- **State**: Consider using remote state storage
- **Variables**: Sensitive values marked as `sensitive = true`

## 📝 Best Practices

1. **Version Control**: All Terraform files are version controlled
2. **State Management**: Consider using remote state for team collaboration
3. **Variables**: Use variables for environment-specific values
4. **Documentation**: Keep this README updated
5. **Testing**: Use `terraform plan` before applying changes
