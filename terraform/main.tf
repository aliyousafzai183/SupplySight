# Terraform configuration is in versions.tf

# Configure the Render Provider
provider "render" {
  # API token will be read from RENDER_API_KEY environment variable
  # Owner ID will be read from RENDER_OWNER_ID environment variable
}

# Backend GraphQL Service
resource "render_web_service" "backend" {
  name   = "supplysight-backend"
  plan   = "starter"
  region = "oregon"

  runtime_source = {
    native_runtime = {
      repo_url      = var.github_repo_url
      branch        = "main"
      build_command = "cd apps/server && npm install && npm run build"
      runtime       = "node"
    }
  }

  start_command = "cd apps/server && npm start"

  env_vars = {
    NODE_ENV = {
      value = "production"
    }
    PORT = {
      value = "10000"
    }
  }

  health_check_path = "/graphql"
}

# Frontend Static Site
resource "render_static_site" "frontend" {
  name     = "supplysight-frontend"
  repo_url = var.github_repo_url
  branch   = "main"

  build_command = "cd apps/web && npm install && npm run build"

  env_vars = {
    VITE_GRAPHQL_URL = {
      value = "https://${render_web_service.backend.id}.onrender.com/graphql"
    }
    VITE_SENTRY_DSN = {
      value = ""
    }
  }
}

# Output the service URLs
output "backend_url" {
  description = "Backend GraphQL service URL"
  value       = "https://${render_web_service.backend.id}.onrender.com"
}

output "frontend_url" {
  description = "Frontend static site URL"
  value       = "https://${render_static_site.frontend.id}.onrender.com"
}

output "graphql_playground_url" {
  description = "GraphQL Playground URL"
  value       = "https://${render_web_service.backend.id}.onrender.com/graphql"
}
