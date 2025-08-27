terraform {
  required_providers {
    render = {
      source  = "render-oss/render"
      version = "~> 1.0"
    }
  }
  required_version = ">= 1.0"
}

# Configure the Render Provider
provider "render" {
  # API token will be read from RENDER_TOKEN environment variable
}

# Backend GraphQL Service
resource "render_service" "backend" {
  name   = "supplysight-backend"
  type   = "web_service"
  plan   = "free"
  repo   = var.github_repo_url
  branch = "main"

  build_command = "cd apps/server && npm install && npm run build"
  start_command = "cd apps/server && npm start"

  env_vars = [
    {
      key   = "NODE_ENV"
      value = "production"
    },
    {
      key   = "PORT"
      value = "10000"
    }
  ]

  health_check_path = "/graphql"
}

# Frontend Static Site
resource "render_service" "frontend" {
  name   = "supplysight-frontend"
  type   = "static_site"
  plan   = "free"
  repo   = var.github_repo_url
  branch = "main"

  build_command = "cd apps/web && npm install && npm run build"
  publish_dir   = "apps/web/dist"

  env_vars = [
    {
      key   = "VITE_GRAPHQL_URL"
      value = "https://${render_service.backend.service_id}.onrender.com/graphql"
    },
    {
      key   = "VITE_SENTRY_DSN"
      value = ""
    }
  ]
}

# Output the service URLs
output "backend_url" {
  description = "Backend GraphQL service URL"
  value       = "https://${render_service.backend.service_id}.onrender.com"
}

output "frontend_url" {
  description = "Frontend static site URL"
  value       = "https://${render_service.frontend.service_id}.onrender.com"
}

output "graphql_playground_url" {
  description = "GraphQL Playground URL"
  value       = "https://${render_service.backend.service_id}.onrender.com/graphql"
}
