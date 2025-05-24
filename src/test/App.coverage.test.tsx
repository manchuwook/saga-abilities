/// <reference types="vitest" />
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';
import { MantineProvider } from '@mantine/core';

// Mock modules with consistent naming
const mockUseLocation = vi.fn().mockReturnValue({ pathname: '/' });

vi.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Outlet: () => <div data-testid="outlet">Outlet Content</div>,
  Link: ({ to, children, ...props }: { to: string, children: React.ReactNode }) => (
    <a href={to} data-testid={`link-${to}`} {...props}>{children}</a>
  ),
  useLocation: () => mockUseLocation(),
}));

// Mock for ThemeContext to test different theme configurations
const mockTheme = {
  colors: {
    imageEnabled: false,
    borderRadius: 4,
    fontScale: 1,
    primaryColor: 'blue',
    accentColor: 'blue.6'
  }
};

vi.mock('../context/ThemeContext', () => ({
  useTheme: () => mockTheme
}));

vi.mock('../components/ThemeCustomizer', () => ({
  ThemeCustomizer: ({ opened }: { opened: boolean }) => (
    <div data-testid="theme-customizer" data-opened={opened.toString()}>Theme Customizer</div>
  )
}));

vi.mock('../components/ColorSchemeToggle', () => ({
  ColorSchemeToggle: () => <div data-testid="color-scheme-toggle">Color Scheme Toggle</div>
}));

vi.mock('../components/ThemeToggle', () => ({
  ThemeToggle: ({ onToggle }: { onToggle: () => void }) => (
    <button data-testid="theme-toggle" onClick={onToggle}>Theme Toggle</button>
  )
}));

vi.mock('../components/Prefetcher', () => ({
  Prefetcher: () => <div data-testid="prefetcher">Prefetcher</div>
}));

// Mock the Mantine hooks with different color schemes
const mockSetColorScheme = vi.fn();
const mockToggleColorScheme = vi.fn();
let mockColorScheme = 'dark';

vi.mock('@mantine/core', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useMantineColorScheme: () => ({
      colorScheme: mockColorScheme,
      setColorScheme: mockSetColorScheme,
      toggleColorScheme: mockToggleColorScheme,
    }),
  };
});

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockColorScheme = 'dark';
    // Reset mock theme to default values
    mockTheme.colors = {
      imageEnabled: false,
      borderRadius: 4,
      fontScale: 1,
      primaryColor: 'blue',
      accentColor: 'blue.6'
    };
    // Reset useLocation mock to default path
    mockUseLocation.mockReturnValue({ pathname: '/' });
  });

  it('renders the main layout correctly with dark theme', () => {
    render(
      <MantineProvider>
        <App />
      </MantineProvider>
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
    
    // Test that theme customizer is initially closed
    expect(screen.getByTestId('theme-customizer')).toHaveAttribute('data-opened', 'false');
  });

  it('renders with light theme', () => {
    // Change the mock color scheme
    mockColorScheme = 'light';

    render(
      <MantineProvider>
        <App />
      </MantineProvider>
    );
    
    // Verify the component rendered with light theme
    expect(screen.getByText('SAGA Abilities Manager')).toBeInTheDocument();
  });

  it('toggles theme settings when the theme toggle button is clicked', () => {
    render(
      <MantineProvider>
        <App />
      </MantineProvider>
    );
    
    // Check initial state (theme customizer should be closed)
    expect(screen.getByTestId('theme-customizer')).toHaveAttribute('data-opened', 'false');
    
    // Click the theme toggle button
    fireEvent.click(screen.getByTestId('theme-toggle'));
    
    // Check that the theme customizer is now open
    expect(screen.getByTestId('theme-customizer')).toHaveAttribute('data-opened', 'true');
    
    // Click again to close
    fireEvent.click(screen.getByTestId('theme-toggle'));
    
    // Check that it's closed again
    expect(screen.getByTestId('theme-customizer')).toHaveAttribute('data-opened', 'false');
  });

  it('applies different style when imageEnabled is true', () => {
    // Change the theme context mock
    mockTheme.colors.imageEnabled = true;
    
    render(
      <MantineProvider>
        <App />
      </MantineProvider>
    );
    
    // Verify the component rendered with the image background enabled
    expect(screen.getByTestId('outlet').parentElement).toHaveStyle({
      backgroundImage: 'url("/assets/img/parchment1.png")'
    });
  });

  it('applies different nav link styles based on current route', () => {
    // Mock being on the AbilityManuals route
    mockUseLocation.mockReturnValue({ pathname: '/AbilityManuals' });
    
    render(
      <MantineProvider>
        <App />
      </MantineProvider>
    );
    
    // Check that "My AbilityManuals" link is bold (active)
    const AbilityManualsLink = screen.getByText('My AbilityManuals');
    expect(AbilityManualsLink).toHaveStyle({ fontWeight: 'bold' });
    
    // And "Abilities Library" is not bold (inactive)
    const abilitiesLibraryLink = screen.getByText('Abilities Library');
    expect(abilitiesLibraryLink).not.toHaveStyle({ fontWeight: 'bold' });
  });
});
