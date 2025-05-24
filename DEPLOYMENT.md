# Deployment Guide

This document provides instructions for deploying the Saga Abilities application to various hosting platforms.

## Prerequisites

Before deploying, ensure you have:

1. The latest production build of your application
2. Git repository with your project (GitHub, GitLab, or Bitbucket)
3. Accounts for your chosen hosting platform (Cloudflare, GitHub, etc.)

## Automated Deployment with GitHub Actions

We've configured GitHub Actions to automatically build and deploy the application. You have two main deployment options:

### Option 1: GitHub Pages Deployment

The workflow in `.github/workflows/deploy-gh-pages.yml` automatically deploys to GitHub Pages:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy to'
        required: true
        default: 'github-pages'
        type: choice
        options:
          - github-pages
          - staging
```

#### Setting up GitHub Pages Deployment:

1. **Enable GitHub Pages**:
   - Go to your repository settings
   - Navigate to "Pages"
   - Set the source to "GitHub Actions"

2. **Required Secrets**: None - GitHub Pages uses the built-in `GITHUB_TOKEN`

3. **Triggering Deployment**:
   - Automatic: Push to the `main` branch
   - Manual: Use the "Run workflow" button in the Actions tab with optional environment selection

4. **Environment Variables**: None required

### Option 2: Cloudflare Pages Deployment

The workflow in `.github/workflows/deploy-cloudflare.yml` deploys to Cloudflare Pages:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy to'
        required: true
        default: 'production'
        type: choice
        options:
          - production
          - staging
```

#### Setting up Cloudflare Pages Deployment:

1. **Create a Cloudflare Pages Project**:
   - Log in to your Cloudflare dashboard
   - Navigate to "Pages"
   - Click "Create a project"
   - You can either connect your GitHub repository or set up direct uploads

2. **Required Secrets**:
   - `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token with Pages edit permissions
   - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID

3. **Adding Secrets to GitHub**:
   - Go to your GitHub repository settings
   - Navigate to "Secrets and variables" → "Actions"
   - Add the required secrets

4. **Triggering Deployment**:
   - Automatic: Push to the `main` branch
   - Manual: Use the "Run workflow" button in the Actions tab with environment selection (production or staging)

## Building the Production Version

Create an optimized production build of the application:

```bash
# Install dependencies (if not already installed)
pnpm install

# Build the optimized production version
pnpm build:prod
```

This will generate a `dist` folder containing the fully optimized build ready for deployment, with:
- Code splitting for optimal loading performance
- Lazy-loaded components to reduce initial bundle size
- Compressed assets (both Gzip and Brotli formats)
- Optimized images
- Minified CSS and JavaScript
- Tree-shaken unused code
- Service worker for offline functionality

You can analyze the bundle size distribution by running:

```bash
pnpm build:analyze
```

## Manual Deployment Options

### Manual Deployment to Cloudflare Pages

If you prefer to deploy manually or use a different CI/CD pipeline:

1. **Build the project locally**:
   ```bash
   pnpm build:prod
   ```

2. **Install Cloudflare Wrangler CLI**:
   ```bash
   pnpm dlx wrangler
   ```

3. **Authenticate with Cloudflare**:
   ```bash
   pnpm dlx wrangler login
   ```

4. **Deploy to Cloudflare Pages**:
   ```bash
   pnpm dlx wrangler pages deploy dist --project-name=saga-abilities
   ```

### Manual Deployment to GitHub Pages

For manual deployment to GitHub Pages:

1. **Build the project locally**:
   ```bash
   pnpm build:prod
   ```

2. **Create a gh-pages branch** (if it doesn't exist):
   ```bash
   git checkout -b gh-pages
   ```

3. **Prepare the branch**:
   ```bash
   git rm -rf .
   git clean -fxd
   ```

4. **Copy the dist folder content**:
   ```bash
   cp -r dist/* .
   ```

5. **Create a .nojekyll file** (to ensure proper handling of files starting with underscore):
   ```bash
   touch .nojekyll
   ```

6. **Commit and push**:
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push -f origin gh-pages
   ```

## Custom Domain Setup

### Custom Domain with GitHub Pages

1. Go to your repository settings
2. Navigate to "Pages"
3. Under "Custom domain", enter your domain
4. Follow the instructions to configure DNS settings

### Custom Domain with Cloudflare Pages

1. Navigate to your Pages project in the Cloudflare dashboard
2. Go to the "Custom domains" tab
3. Click "Set up a custom domain"
4. Follow the instructions to configure your domain

## Environment Configuration

Each deployment can include environment-specific configuration:

### Production vs. Staging Environments

Both deployment workflows support different environments:

- GitHub Pages: "github-pages" (production) or "staging"
- Cloudflare Pages: "production" or "staging"

When using manual workflow dispatch, you can select the environment to deploy to.

## Deployment Metadata

Each deployment includes metadata in a `deployment-info.json` file with:
- Version (Git commit SHA)
- Branch name
- Build timestamp
- Environment name

This is useful for debugging and identifying which version is deployed.

## Post-Deployment Verification

After deploying, verify that:

1. The application loads correctly at the provided URL
2. All abilities and data are displayed properly
3. The filter functionality works
4. AbilityManuals can be created and managed
5. PDF exports work as expected
6. PWA functionality works (app can be installed and used offline)

## Troubleshooting

If you encounter issues with your deployment:

- **Blank Page**: Check if the build output directory is set correctly 
- **Missing Assets**: Ensure all assets are properly referenced with relative paths
- **API Errors**: Verify that the spell data JSON files are included in the build
- **Route Errors**: Ensure proper handling of client-side routing

For GitHub Pages, make sure you have:
- A `.nojekyll` file to prevent GitHub from processing the site with Jekyll
- Correct base path in the Vite configuration for repository deployment

For Cloudflare Pages:
- Check the deployment logs in the Cloudflare dashboard
- Verify that the correct build command and output directory are configured

## Cache Considerations

### GitHub Pages Cache

GitHub Pages sets cache headers automatically. To ensure users get the latest version:
- Use versioned filenames for assets (Vite handles this automatically)
- Set up proper cache invalidation in your service worker

### Cloudflare Cache

Cloudflare aggressively caches content for performance. To ensure users get the latest version:
- Use versioned filenames for assets (Vite handles this automatically)
- Set appropriate cache headers for dynamic content
- For the service worker, use `Cache-Control: no-cache` to ensure it's always fresh
- When making significant updates, consider purging the cache in Cloudflare dashboard
