variable "github_repo_url" {
  description = "GitHub repository URL"
  type        = string
  default     = "https://github.com/aliyousafzai183/SupplySight"
}

variable "render_token" {
  description = "Render API token"
  type        = string
  sensitive   = true
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "prod"
}

variable "region" {
  description = "Render region for deployment"
  type        = string
  default     = "us-east-1"
}
