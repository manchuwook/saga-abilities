# Saga Abilities

An abilities management application for the SAGA tabletop role-playing game system. This web-based tool helps players and game masters manage abilities, create AbilityManuals for characters, and export ability information for reference during gameplay.

![Saga Abilities App](./public/assets/img/parchment1.png)

## Features

- **Comprehensive Ability Browser**: Browse, search, and filter the complete SAGA ability database
- **Custom AbilityManuals**: Create and manage AbilityManuals for your characters
- **Advanced Filtering**: Filter abilities by class, Discipline, and keywords
- **PDF Export**: Export ability lists and AbilityManuals to PDF for easy printing and reference
- **Dark/Light Mode**: Toggle between light and dark themes for comfortable viewing
- **Offline Support**: Access your abilities and AbilityManuals even without an internet connection
- **Progressive Web App**: Install on your device for quick access and offline functionality
- **Optimized Performance**: Fast loading times with code splitting and lazy loading

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [pnpm](https://pnpm.io/) (v10 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/saga-abilities.git
   cd saga-abilities
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Open your browser and navigate to http://localhost:5173

### Building for Production

To create an optimized production build:

```bash
pnpm build:prod
```

## CI/CD Workflows

This project uses GitHub Actions for continuous integration and deployment:

### Main CI Workflow

- Runs type checking, testing, and building in parallel jobs
- Uses dependency caching for faster workflow execution
- Uploads test coverage and build artifacts
- Optimized for PNPM and modern Node.js

### Performance Testing

- Runs Lighthouse performance tests automatically
- Generates detailed reports with performance metrics
- Adds report summaries as PR comments
- Enforces performance, accessibility, and PWA standards

### Security Scanning

- Automatically scans dependencies for vulnerabilities
- Creates GitHub issues for critical security problems
- Runs on schedule and when dependencies change

### Deployment Options

We've set up automated deployment to two platforms:

- **GitHub Pages**: Zero-configuration deployment with GitHub's hosting
- **Cloudflare Pages**: High-performance global CDN deployment

See [CI_CD.md](./CI_CD.md) for detailed information about our CI/CD setup.

## Development

To run these workflows locally before pushing:

```bash
# Run tests
pnpm test

# Build the app
pnpm build

# Run Lighthouse tests
pnpm lighthouse
```

For more details on the CI/CD setup, see [CI_CD.md](CI_CD.md).
For deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

This will:
- Clean the previous build
- Type check all TypeScript code
- Bundle and optimize all assets
- Apply code splitting and lazy loading
- Compress assets (Gzip and Brotli)
- Optimize images
- Generate bundle analysis (available at dist/stats.html)

To preview the production build locally:

```bash
pnpm preview
```

## Usage

### Viewing Abilities

The main page displays all available abilities. Use the filter panel to narrow down abilities by:
- Ability class
- Discipline
- Keywords
- Text search

### Creating AbilityManuals

1. Navigate to the AbilityManuals page
2. Click "New AbilityManual"
3. Enter a name, character name, and optional description
4. Add abilities to your AbilityManual from the main abilities page

### Exporting

- Export individual abilities or entire AbilityManuals to PDF
- Customize the export format with different layout options

## Data Storage

All AbilityManuals are stored in your browser's local storage. To prevent data loss:
- Use the export feature regularly to back up your AbilityManuals
- Do not clear your browser data without exporting first

## Contributing

Contributions are welcome! See [DEVELOPMENT.md](./DEVELOPMENT.md) for details on setting up the development environment and contributing guidelines.

## Deployment

For information on deploying this application to production, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Acknowledgments

- Built with [React](https://reactjs.org/), [Vite](https://vitejs.dev/), and [Mantine UI](https://mantine.dev/)
- PDF generation powered by [jsPDF](https://parall.ax/products/jspdf) and [jsPDF-AutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable)
- Inspired by the SAGA TTRPG system
