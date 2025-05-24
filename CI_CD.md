# CI/CD Configuration

This document explains the Continuous Integration and Continuous Deployment (CI/CD) setup for the SAGA Abilities project.

## GitHub Actions Workflows

### Main Workflow (`ci.yml`)

This workflow runs on each push to the main branch and on pull requests:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint-typecheck:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Setup PNPM
        uses: pnpm/action-setup@v3
        with:
          version: 10
          
      - name: Get pnpm store directory
        id: pnpm-cache
        shell: bash
        run: |
          echo "STORE_PATH=$(pnpm store path)" >> $GITHUB_OUTPUT
      
      - name: Setup pnpm cache
        uses: actions/cache@v4
        with:
          path: ${{ steps.pnpm-cache.outputs.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-pnpm-store-
      
      - name: Install dependencies
        run: pnpm install --no-frozen-lockfile
        
      - name: Run typecheck
        run: pnpm typecheck
  
  test:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      # ... other setup steps with caching ...
        
      - name: Run tests
        run: pnpm test
        
      - name: Upload test coverage
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: test-coverage
          path: ./coverage
          if-no-files-found: ignore
  
  build:
    runs-on: ubuntu-latest
    needs: [lint-typecheck, test]
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      # ... other setup steps with caching ...
        
      - name: Build
        run: pnpm build:prod
        
      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: production-build
          path: ./dist
```

#### Key Features:

- **Uses modern GitHub Actions syntax**
- **Parallel jobs** for faster CI execution:
  - Type checking
  - Testing
  - Building (only runs after type checking and tests pass)
- **Dependency caching** for faster workflow execution
- **Artifact uploads** for test coverage and build outputs
- **Uses PNPM v10** for faster package management

### Release Workflow (`release.yml`)

This workflow runs when a new release is published on GitHub:

```yaml
name: Release PWA

on:
  release:
    types: [published]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      # ... setup steps with caching ...
        
      - name: Build
        run: pnpm build:prod
        
      - name: Create version.json
        run: |
          echo "{\"version\": \"${{ github.event.release.tag_name }}\", \"releaseDate\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\"}" > dist/version.json
        
      - name: Zip artifacts
        run: |
          cd dist
          zip -r ../saga-abilities-${{ github.event.release.tag_name }}.zip .
          cd ..
      
      - name: Generate checksum
        run: |
          sha256sum saga-abilities-${{ github.event.release.tag_name }}.zip > saga-abilities-${{ github.event.release.tag_name }}.zip.sha256
      
      - name: Upload artifacts to release
        uses: softprops/action-gh-release@v2
        with:
          files: |
            saga-abilities-${{ github.event.release.tag_name }}.zip
            saga-abilities-${{ github.event.release.tag_name }}.zip.sha256
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

#### Key Features:

- **Automated Releases**: Triggered on release publication
- **Build Automation**: Creates a production-ready build
- **Version Information**: Adds a version.json file with release details
- **Asset Packaging**: Creates a ZIP file of the build
- **Security**: Generates SHA256 checksum for download verification
- **Release Attachment**: Attaches the artifacts to the GitHub release

### Lighthouse CI Workflow (`lighthouse.yml`)

This workflow runs performance tests on your application:

```yaml
name: Lighthouse CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 0 * * 1' # Run weekly on Mondays

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      # ... setup steps with caching ...
        
      - name: Run Lighthouse CI
        id: lighthouse
        uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            http://localhost:3000
          uploadArtifacts: false
          temporaryPublicStorage: true
          configPath: './.github/lighthouse/config.json'
          
      # ... results processing and reporting ...
```

#### Key Features:

- **Performance Testing**: Analyzes your application using Google Lighthouse
- **Scheduled Runs**: Tests weekly, plus on each PR and push to main
- **Enhanced Reporting**: Generates detailed reports with tabular data
- **PR Comments**: Adds Lighthouse reports as comments on PRs
- **Artifact Handling**: Better handling of large reports

### Security Audit Workflow (`security-audit.yml`)

This workflow scans dependencies for security vulnerabilities:

```yaml
name: Security Audit

on:
  push:
    branches: [main]
    paths:
      - 'package.json'
      - 'pnpm-lock.yaml'
  pull_request:
    branches: [main]
    paths:
      - 'package.json'
      - 'pnpm-lock.yaml'
  schedule:
    - cron: '0 0 * * 0' # Run weekly on Sundays
  workflow_dispatch:

jobs:
  security-audit:
    runs-on: ubuntu-latest
    
    steps:
      # ... setup steps ...
        
      - name: Run security audit
        run: pnpm audit
        continue-on-error: true
        
      # ... reporting and issue creation ...
```

#### Key Features:

- **Dependency Scanning**: Checks for vulnerabilities in dependencies
- **Automatic Reporting**: Creates issues for critical vulnerabilities
- **Scheduled Scans**: Runs weekly and on dependency changes
- **Manual Trigger**: Can be run on-demand with workflow_dispatch

### Cache Invalidation Workflow (`cache-invalidation.yml`)

This workflow cleans up GitHub Actions caches periodically:

```yaml
name: Cache Invalidation

on:
  schedule:
    - cron: '0 0 * * 1' # Run weekly on Mondays
  workflow_dispatch:

jobs:
  cleanup:
    runs-on: ubuntu-latest
    
    steps:
      - name: Cleanup GitHub Actions cache
        uses: actions/github-script@v7
        with:
          script: |
            # ... cache deletion script ...
```

#### Key Features:

- **Cache Management**: Prevents stale caches from accumulating
- **Scheduled Cleanup**: Runs weekly to maintain system health
- **Manual Trigger**: Can be run on-demand when needed

## Deployment Workflows

### GitHub Pages Deployment (`deploy-gh-pages.yml`)

This workflow deploys the application to GitHub Pages:

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

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      # ... setup steps with caching ...
        
      - name: Build
        run: pnpm build:prod
        
      - name: Create deployment info file
        run: |
          cat > dist/deployment-info.json << EOL
          {
            "version": "${{ github.sha }}",
            "branch": "${{ github.ref_name }}",
            "buildTime": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
            "environment": "${{ github.event.inputs.environment || 'github-pages' }}"
          }
          EOL
        
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
          
  deploy:
    environment:
      name: ${{ github.event.inputs.environment || 'github-pages' }}
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
      
      # ... deployment notification ...
```

#### Key Features:

- **Environment Selection**: Can deploy to different environments
- **Deployment Tracking**: Adds deployment metadata to the build
- **Automated Notifications**: Comments on PRs after deployment
- **Manual Triggering**: Can be run on-demand
- **Modern Actions**: Uses the latest GitHub Actions versions

### Cloudflare Pages Deployment (`deploy-cloudflare.yml`)

This workflow deploys the application to Cloudflare Pages:

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

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      # ... setup steps with caching ...
        
      - name: Build
        run: pnpm build:prod
        
      - name: Create deployment info file
        run: |
          cat > dist/deployment-info.json << EOL
          {
            "version": "${{ github.sha }}",
            "branch": "${{ github.ref_name }}",
            "buildTime": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
            "environment": "${{ github.event.inputs.environment || 'production' }}"
          }
          EOL
        
      - name: Publish to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy dist --project-name=saga-abilities ${{ github.event.inputs.environment == 'staging' && '--branch=staging' || '' }}
        
      # ... deployment notification ...
```

#### Key Features:

- **Environment Selection**: Can deploy to production or staging
- **Deployment Tracking**: Adds deployment metadata to the build
- **Branch-based Deployments**: Uses Cloudflare Pages branches for environments
- **Automated Notifications**: Comments on PRs after deployment
- **Secret Management**: Uses repository secrets for API credentials

## Lighthouse Configuration

The Lighthouse configuration in `.github/lighthouse/config.json` defines:

```json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "startServerCommand": "pnpm dlx serve -s dist",
      "url": ["http://localhost:3000"]
    },
    "assert": {
      "assertions": {
        "categories:performance": ["warn", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "categories:best-practices": ["warn", {"minScore": 0.9}],
        "categories:seo": ["warn", {"minScore": 0.9}],
        "categories:pwa": ["warn", {"minScore": 0.9}],
        "first-contentful-paint": ["warn", {"maxNumericValue": 2000}],
        "interactive": ["warn", {"maxNumericValue": 3500}],
        "largest-contentful-paint": ["warn", {"maxNumericValue": 2500}]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

## PNPM Workspace Configuration

This project uses PNPM workspaces. The `pnpm-workspace.yaml` file is configured as:

```yaml
packages:
  - '.'  # Root package

ignoredBuiltDependencies:
  - gifsicle
  - jpegtran-bin
  - mozjpeg
  - pngquant-bin
onlyBuiltDependencies:
  - cwebp-bin
  - esbuild
  - optipng-bin
```

## Secrets and Environment Variables

### Required Secrets for Deployment

For GitHub Pages deployment:
- No additional secrets required

For Cloudflare Pages deployment:
- `CLOUDFLARE_API_TOKEN` - Your Cloudflare API token
- `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID

### Adding Environment Variables

For sensitive data like API keys, add them as GitHub Secrets and reference them in workflows:

```yaml
env:
  MY_API_KEY: ${{ secrets.MY_API_KEY }}
```

## Running Locally

To simulate CI/CD workflows locally:

```bash
# Type checking
pnpm typecheck

# Test
pnpm test

# Build
pnpm build:prod

# Performance testing
pnpm lighthouse
```

## Best Practices

1. **Always run tests locally** before pushing
2. **Keep dependencies updated** using the security audit workflow
3. **Monitor GitHub Actions runs** for failures
4. **Check Lighthouse scores** to maintain performance
5. **Use PR comments** to review performance changes
6. **Utilize caching** to speed up workflows
7. **Schedule regular maintenance tasks** using the scheduled workflows

## Setting Up Deployment

1. Choose your preferred deployment platform (GitHub Pages or Cloudflare Pages)
2. Configure the required secrets in your GitHub repository settings
3. For GitHub Pages:
   - Go to repository Settings → Pages
   - Set source to "GitHub Actions"
4. For Cloudflare Pages:
   - Create a project in Cloudflare Pages dashboard
   - Set your repository as the source
   - Configure the build settings to match your workflow
