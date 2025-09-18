import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle';

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
    ActionIcon: ({ onClick, children, 'aria-label': ariaLabel, title, ...props }: {
      onClick?: () => void;
      children: React.ReactNode;
      'aria-label'?: string;
      title?: string;
      [key: string]: any;
    }) => (
      <button onClick={onClick} aria-label={ariaLabel} title={title} {...props}>{children}</button>
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

    // Check that the toggle button exists - use the actual aria-label
    const toggleButton = screen.getByRole('button', { name: /dark mode/i });
    expect(toggleButton).toBeInTheDocument();
    // In light mode, it should show the moon icon
    expect(toggleButton.textContent).toBe('Moon Icon');
    // Check title attribute for tooltip functionality
    expect(toggleButton).toHaveAttribute('title', 'Dark mode');
  });
  it('calls toggleColorScheme when clicked', () => {
    render(<ColorSchemeToggle />);

    const toggleButton = screen.getByRole('button', { name: /dark mode/i });
    fireEvent.click(toggleButton);

    expect(mockToggleColorScheme).toHaveBeenCalledTimes(1);
  });
});
