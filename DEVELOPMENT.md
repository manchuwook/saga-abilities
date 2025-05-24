# Development Guide

This document provides guidelines and instructions for developing and contributing to the Saga Abilities application.

## Development Environment Setup

### Prerequisites

- [Node.js](https://nodejs.org/) v16 or higher
- [pnpm](https://pnpm.io/) v10 or higher (preferred package manager)
- A code editor ([VS Code](https://code.visualstudio.com/) recommended)

### Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/saga-abilities.git
   cd saga-abilities
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Start the development server**:
   ```bash
   pnpm dev
   ```

4. **Access the application**:
   Open your browser and navigate to http://localhost:5173

## Project Structure

The project follows a standard React + Vite structure with TypeScript:

```
saga-abilities/
├── public/                 # Static assets
│   ├── assets/
│   ├── abilities.json         # Spell data
│   └── abilities.tags.json    # Spell tags data
├── src/
│   ├── components/         # Reusable UI components
│   ├── context/            # React context providers
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── pages/              # Page components
│   ├── styles/             # Global styles
│   ├── types/              # TypeScript type definitions
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── abilities.zod.ts           # Zod schema for spell data validation
└── vite.config.ts          # Vite configuration
```

## Key Technologies

- **React**: UI library
- **TypeScript**: Type-safe JavaScript
- **Vite**: Build tool and development server
- **Mantine**: UI component library
- **React Router**: Client-side routing
- **React Query**: Data fetching and caching
- **Zod**: Schema validation
- **jsPDF**: PDF generation
- **HTML2Canvas**: HTML to image conversion for PDF exports

## Development Workflow

### Adding New Features

1. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and ensure they work as expected
3. Write tests if applicable
4. Submit a pull request

### Code Style and Conventions

- Use TypeScript for all new code
- Follow the existing project structure
- Use functional components with hooks
- Use Mantine components for UI elements
- Validate data with Zod schemas

### Working with Spell Data

The application uses two main data files:

- `public/abilities.json`: Contains all spell information
- `public/abilities.tags.json`: Contains tag information for filtering

Spell data is validated against the schema defined in `abilities.zod.ts`.

To add or modify abilities:

1. Edit the `abilities.json` file in the `public` directory
2. Ensure the new data conforms to the schema in `abilities.zod.ts`
3. Update tag information in `abilities.tags.json` if necessary

## State Management

The application uses React Context for global state management:

- `AbilityManualsContext`: Manages user-created AbilityManuals
- `ThemeContext`: Manages theme settings and preferences

Local component state is managed using React's `useState` and `useEffect` hooks.

## Adding New Components

1. Create a new component file in the appropriate directory
2. Import necessary dependencies
3. Define the component using the existing pattern
4. Export the component
5. Import and use it where needed

Example:

```tsx
// src/components/NewComponent.tsx
import { useState } from 'react';
import { Button, Text } from '@mantine/core';

interface NewComponentProps {
  label: string;
  onClick: () => void;
}

export function NewComponent({ label, onClick }: NewComponentProps) {
  const [clicked, setClicked] = useState(false);
  
  const handleClick = () => {
    setClicked(true);
    onClick();
  };
  
  return (
    <div>
      <Text>{label}</Text>
      <Button onClick={handleClick}>
        {clicked ? 'Clicked!' : 'Click Me'}
      </Button>
    </div>
  );
}
```

## Testing

Although tests are not currently implemented, adding them is encouraged. Consider using:

- Jest for unit tests
- React Testing Library for component tests
- Cypress for end-to-end tests

## Building for Production

The application uses a highly optimized build process:

```bash
# Standard build
pnpm build

# Production optimized build with cleaning
pnpm build:prod

# Build with bundle analysis
pnpm build:analyze
```

The optimized build process includes:

- **Code Splitting**: Automatically splits code into smaller chunks that are loaded on demand
- **Tree Shaking**: Eliminates unused code from the final bundle
- **Lazy Loading**: Components are loaded only when needed using React.lazy()
- **Asset Optimization**: 
  - Images are compressed and optimized
  - CSS is minified and optimized with CSSNano
  - JavaScript is minified with Terser
- **Progressive Web App (PWA)**: Build includes service worker and manifest for offline capabilities
- **Compression**: Outputs both Gzip and Brotli compressed versions of assets
- **Bundle Analysis**: Generates reports to identify optimization opportunities

These optimizations result in significantly smaller bundle sizes and faster load times, especially for first-time visitors.

To preview the production build locally:

```bash
pnpm preview
```

## Build Analysis

To analyze the bundle size and composition:

1. Run `pnpm build:analyze`
2. Open `dist/stats.html` in your browser
3. Review the visualization to identify large dependencies or opportunities for optimization

## PDF Export Functionality

The application provides PDF export capability through two implementations:

1. `pdfExport.ts`: Basic PDF export using jsPDF and autoTable
2. `pdfExport.enhanced.ts`: Enhanced PDF export with formatting and styling

To modify PDF export functionality, edit these files in the `src/lib` directory.

## Data Persistence

AbilityManuals are stored in the browser's localStorage. Changes to the storage structure should be backward compatible or include a migration strategy.

## Contributing Guidelines

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request with a clear description of the changes

Please ensure your code:
- Has been tested
- Follows the project's coding style
- Includes appropriate documentation
- Does not break existing functionality

## Getting Help

If you encounter issues or have questions, please:
1. Check existing documentation
2. Search for related issues
3. Create a new issue with clear details about your problem

Happy coding!
