import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useStyles } from '../hooks/useStyles';
import { ThemeProvider } from '../context/ThemeContext';
import { ReactNode } from 'react';
import { MantineProvider } from '@mantine/core';
import { styleService } from '../services/StyleService';

// Mock dependencies
vi.mock('@mantine/core', () => ({
  useMantineTheme: vi.fn(() => ({
    colors: { blue: ['#000', '#111', '#222', '#333', '#444', '#555', '#666', '#777', '#888', '#999'] },
    primaryColor: 'blue',
    radius: { sm: '4px', md: '8px' },
    fontSizes: { sm: '14px', md: '16px' }
  })),
  useMantineColorScheme: vi.fn(() => ({
    colorScheme: 'dark',
    toggleColorScheme: vi.fn()
  })),
  MantineProvider: ({ children }: { children: ReactNode }) => <>{children}</>
}));

vi.mock('../services/StyleService', () => ({
  styleService: {
    initialize: vi.fn(),
    updateColorScheme: vi.fn(),
    updateCustomTheme: vi.fn(),
    getTheme: vi.fn(() => ({})),
    getModalStyles: vi.fn(() => ({})),
    getCardStyles: vi.fn(() => ({})),
    getShellStyles: vi.fn(() => ({})),
    getTextStyles: vi.fn(() => ({})),
    getInputStyles: vi.fn(() => ({})),
    getButtonStyles: vi.fn(() => ({})),
    getTabsStyles: vi.fn(() => ({})),
    getNavLinkColor: vi.fn(() => '#fff'),
    getNotificationStyles: vi.fn(() => ({}))
  }
}));

describe('useStyles Hook - Simple Coverage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return all style helper functions', () => {
    // Setup wrapper
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MantineProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </MantineProvider>
    );

    // Render the hook
    const { result } = renderHook(() => useStyles(), { wrapper });

    // Verify all properties exist
    expect(result.current.isDark).toBe(true);
    expect(result.current.styleService).toBeDefined();
    expect(result.current.theme).toBeDefined();
    expect(result.current.modalStyles).toBeDefined();
    expect(result.current.cardStyles).toBeDefined();
    expect(result.current.shellStyles).toBeDefined();
    expect(result.current.textStyles).toBeDefined();
    expect(result.current.inputStyles).toBeDefined();
    expect(result.current.buttonStyles).toBeDefined();
    expect(result.current.tabsStyles).toBeDefined();
    
    // Test methods
    result.current.getNavLinkColor(true);
    result.current.getNotificationStyles('red');
    
    // Verify service methods were called
    expect(styleService.initialize).toHaveBeenCalled();
    expect(styleService.updateColorScheme).toHaveBeenCalledWith('dark');
    expect(styleService.updateCustomTheme).toHaveBeenCalled();
  });
});
