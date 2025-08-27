#!/bin/bash

# Manual Terraform Deployment Script
set -e

echo "🚀 Manual Terraform Deployment for SupplySight"
echo "=============================================="

# Check if required environment variables are set
if [ -z "$RENDER_API_KEY" ]; then
    echo "❌ Error: RENDER_API_KEY environment variable is not set"
    echo ""
    echo "Please set it with:"
    echo "export RENDER_API_KEY='your_api_key_here'"
    echo ""
    echo "Get your API key from: https://dashboard.render.com/account/api-keys"
    exit 1
fi

if [ -z "$RENDER_OWNER_ID" ]; then
    echo "❌ Error: RENDER_OWNER_ID environment variable is not set"
    echo ""
    echo "Please set it with:"
    echo "export RENDER_OWNER_ID='usr-d2nmogjipnbc738cstfg'"
    exit 1
fi

echo "✅ Environment variables are set"
echo "   RENDER_API_KEY: ${RENDER_API_KEY:0:10}..."
echo "   RENDER_OWNER_ID: $RENDER_OWNER_ID"
echo ""

# Validate configuration
echo "🔧 Step 1: Validating Terraform configuration..."
terraform validate

# Format check
echo "📝 Step 2: Checking Terraform formatting..."
terraform fmt -check -recursive .

# Initialize (if needed)
echo "🚀 Step 3: Initializing Terraform..."
terraform init

# Plan
echo "📋 Step 4: Creating deployment plan..."
terraform plan -out=tfplan

echo ""
echo "🔍 Review the plan above. If everything looks correct, proceed with deployment."
echo ""
read -p "Do you want to proceed with deployment? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Step 5: Deploying to Render..."
    terraform apply -auto-approve tfplan
    
    echo ""
    echo "✅ Deployment completed!"
    echo ""
    echo "📊 Service URLs:"
    echo "   Backend: $(terraform output -raw backend_url)"
    echo "   Frontend: $(terraform output -raw frontend_url)"
    echo "   GraphQL Playground: $(terraform output -raw graphql_playground_url)"
    echo ""
    echo "🎉 Your SupplySight application is now deployed!"
else
    echo "❌ Deployment cancelled."
    exit 0
fi
