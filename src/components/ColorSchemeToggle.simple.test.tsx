import { describe, it, vi, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ColorSchemeToggle } from './ColorSchemeToggle';

// Mock the Mantine color scheme hook
const mockToggleColorScheme = vi.fn();

// Create mock for Mantine components
vi.mock('@mantine/core', async () => {
  return {
    useMantineColorScheme: () => ({
      colorScheme: 'light',
      toggleColorScheme: mockToggleColorScheme,
    }),
    Tooltip: ({ children, label }: { children: React.ReactNode, label: string }) => 
      <div data-testid="tooltip" aria-label={label}>{children}</div>,
    ActionIcon: ({ onClick, children, 'aria-label': ariaLabel }: any) => (
      <button onClick={onClick} aria-label={ariaLabel}>{children}</button>
    ),
  };
});

// Mock the Tabler icons
vi.mock('@tabler/icons-react', async () => {
  return {
    IconMoon: () => <span data-testid="moon-icon">Moon</span>,
    IconSun: () => <span data-testid="sun-icon">Sun</span>,
  };
});

describe('ColorSchemeToggle', () => {
  it('renders correctly in light mode', () => {
    render(<ColorSchemeToggle />);
    
    // Check that the toggle button exists
    const toggleButton = screen.getByRole('button', { name: /toggle color scheme/i });
    expect(toggleButton).toBeInTheDocument();
    
    // In light mode, it should show the moon icon
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
  });
  
  it('calls toggleColorScheme when clicked', () => {
    render(<ColorSchemeToggle />);
    
    const toggleButton = screen.getByRole('button', { name: /toggle color scheme/i });
    fireEvent.click(toggleButton);
    
    expect(mockToggleColorScheme).toHaveBeenCalledTimes(1);
  });
});
