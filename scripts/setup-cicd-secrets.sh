#!/bin/bash
# setup-cicd-secrets.sh - Script to set up GitHub Actions secrets for CI/CD

echo "SAGA Abilities GitHub Actions Secret Setup"
echo "======================================="
echo "This script will help you set up the required secrets for GitHub Actions CI/CD."
echo

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "GitHub CLI (gh) is not installed. Please install it first:"
    echo "https://cli.github.com/manual/installation"
    exit 1
fi

# Check if logged in to GitHub CLI
if ! gh auth status &> /dev/null; then
    echo "You are not logged in to GitHub CLI. Please login first:"
    echo "gh auth login"
    exit 1
fi

# Get the repository name from the current git remote, or ask the user
REPO=$(git remote get-url origin 2>/dev/null | sed -n 's/.*github.com[:/]\(.*\).git/\1/p')
if [ -z "$REPO" ]; then
    read -p "Enter the GitHub repository name (format: username/repo): " REPO
fi

echo
echo "Setting up secrets for repository: $REPO"
echo

# Setup secrets for Cloudflare Pages
echo "Cloudflare Pages Deployment Setup"
echo "--------------------------------"
echo "To deploy to Cloudflare Pages, you need to provide your Cloudflare API token and account ID."
echo

read -p "Do you want to set up Cloudflare Pages deployment? (y/n): " SETUP_CLOUDFLARE
if [[ "$SETUP_CLOUDFLARE" =~ ^[Yy]$ ]]; then
    read -p "Enter your Cloudflare API token: " CF_API_TOKEN
    read -p "Enter your Cloudflare account ID: " CF_ACCOUNT_ID
    
    echo "Setting up Cloudflare secrets..."
    gh secret set CLOUDFLARE_API_TOKEN --body "$CF_API_TOKEN" --repo "$REPO"
    gh secret set CLOUDFLARE_ACCOUNT_ID --body "$CF_ACCOUNT_ID" --repo "$REPO"
    
    echo "Cloudflare Pages secrets set successfully!"
fi

echo
echo "GitHub Actions Workflow Configuration"
echo "------------------------------------"
echo "Would you like to enable any of the following workflows?"
echo

# Enable/disable GitHub workflows
read -p "Enable CI workflow (build, test, lint)? (y/n): " ENABLE_CI
if [[ "$ENABLE_CI" =~ ^[Yy]$ ]]; then
    gh workflow enable ci.yml --repo "$REPO"
    echo "CI workflow enabled!"
fi

read -p "Enable Lighthouse performance testing? (y/n): " ENABLE_LIGHTHOUSE
if [[ "$ENABLE_LIGHTHOUSE" =~ ^[Yy]$ ]]; then
    gh workflow enable lighthouse.yml --repo "$REPO"
    echo "Lighthouse workflow enabled!"
fi

read -p "Enable security audit workflow? (y/n): " ENABLE_SECURITY
if [[ "$ENABLE_SECURITY" =~ ^[Yy]$ ]]; then
    gh workflow enable security-audit.yml --repo "$REPO"
    echo "Security audit workflow enabled!"
fi

read -p "Enable GitHub Pages deployment? (y/n): " ENABLE_GITHUB_PAGES
if [[ "$ENABLE_GITHUB_PAGES" =~ ^[Yy]$ ]]; then
    gh workflow enable deploy-gh-pages.yml --repo "$REPO"
    echo "GitHub Pages deployment workflow enabled!"
    echo "Note: You need to configure GitHub Pages in your repository settings."
    echo "Go to Settings > Pages > Source > select 'GitHub Actions'"
fi

read -p "Enable Cloudflare Pages deployment? (y/n): " ENABLE_CLOUDFLARE_DEPLOY
if [[ "$ENABLE_CLOUDFLARE_DEPLOY" =~ ^[Yy]$ ]]; then
    gh workflow enable deploy-cloudflare.yml --repo "$REPO"
    echo "Cloudflare Pages deployment workflow enabled!"
fi

echo
echo "Setup complete! Your GitHub Actions workflows are now configured."
echo "You can run workflows manually from the Actions tab in your GitHub repository."
echo
echo "For more information, see the CI_CD.md and DEPLOYMENT.md documents."
