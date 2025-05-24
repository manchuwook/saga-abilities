import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ColorSchemeToggle } from './ColorSchemeToggle';

// Mock the Mantine color scheme hook
const mockToggleColorScheme = vi.fn();
vi.mock('@mantine/core', async () => {
  const actual = await import('@mantine/core');
  return {
    ...actual,
    useMantineColorScheme: () => ({
      colorScheme: 'light',
      toggleColorScheme: mockToggleColorScheme,
    }),
    Tooltip: ({ children, label }: { children: React.ReactNode, label: string }) => 
      <div role="tooltip">{label} {children}</div>,
    ActionIcon: ({ onClick, children, 'aria-label': ariaLabel }: any) => (
      <button onClick={onClick} aria-label={ariaLabel}>{children}</button>
    ),
  };
});

// Mock the Tabler icons
vi.mock('@tabler/icons-react', async () => {
  return {
    IconMoon: () => <span>Moon Icon</span>,
    IconSun: () => <span>Sun Icon</span>,
  };
});

describe('ColorSchemeToggle', () => {
  it('renders correctly in light mode', () => {
    render(<ColorSchemeToggle />);
    
    // Check that the toggle button exists
    const toggleButton = screen.getByRole('button', { name: /toggle color scheme/i });
    expect(toggleButton).toBeInTheDocument();
      // In light mode, it should show the moon icon
    expect(toggleButton.textContent).toBe('Moon Icon');
      // Check tooltip content
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip.textContent).toContain('Dark mode');
  });
    it('calls toggleColorScheme when clicked', () => {
    render(<ColorSchemeToggle />);
    
    const toggleButton = screen.getByRole('button', { name: /toggle color scheme/i });
    fireEvent.click(toggleButton);
    
    expect(mockToggleColorScheme).toHaveBeenCalledTimes(1);
  });
});
