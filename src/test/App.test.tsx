/// <reference types="vitest" />
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';
import { BrowserRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';

// Mock the dependencies
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    Outlet: () => <div data-testid="outlet">Outlet Content</div>,
    useLocation: () => ({ pathname: '/' }),
  };
});

vi.mock('../context/ThemeContext', () => ({
  useTheme: () => ({
    colors: {
      imageEnabled: false,
      borderRadius: 4,
      fontScale: 1,
      primaryColor: 'blue',
      accentColor: 'blue.6'
    }
  })
}));

vi.mock('../components/ThemeCustomizer', () => ({
  ThemeCustomizer: () => <div data-testid="theme-customizer">Theme Customizer</div>
}));

vi.mock('../components/ColorSchemeToggle', () => ({
  ColorSchemeToggle: () => <div data-testid="color-scheme-toggle">Color Scheme Toggle</div>
}));

vi.mock('../components/ThemeToggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle">Theme Toggle</div>
}));

vi.mock('../components/Prefetcher', () => ({
  Prefetcher: () => <div data-testid="prefetcher">Prefetcher</div>
}));

// Mock the Mantine hooks
vi.mock('@mantine/core', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useMantineColorScheme: () => ({
      colorScheme: 'dark',
      setColorScheme: vi.fn(),
      toggleColorScheme: vi.fn(),
    }),
  };
});

describe('App', () => {
  it('renders the main layout correctly', () => {
    // Use a custom wrapper that includes MantineProvider and BrowserRouter
    render(
      <BrowserRouter>
        <MantineProvider>
          <App />
        </MantineProvider>
      </BrowserRouter>
    );
    
    // Check that the title is rendered
    expect(screen.getByText('SAGA Abilities Manager')).toBeInTheDocument();
    
    // Check that the navigation links are rendered
    expect(screen.getByText('Abilities Library')).toBeInTheDocument();
    expect(screen.getByText('My AbilityManuals')).toBeInTheDocument();
    
    // Check that the mocked components are rendered
    expect(screen.getByTestId('color-scheme-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('theme-customizer')).toBeInTheDocument();
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('prefetcher')).toBeInTheDocument();
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });
});
