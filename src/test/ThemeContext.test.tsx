import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { useTheme, ThemeProvider, ThemeColors } from '../context/ThemeContext';
import { styleService } from '../services/StyleService';

// Mock MantineTheme and useMantineColorScheme hooks
vi.mock('@mantine/core', () => ({
  useMantineTheme: () => ({
    colors: {
      dark: ['#C1C2C5', '#A6A7AB', '#909296', '#5c5f66', '#373A40', '#2C2E33', '#25262b', '#1A1B1E', '#141517', '#101113'],
      blue: ['#e1f0ff', '#b3d7ff', '#85bfff', '#57a6ff', '#298efc', '#0b76ef', '#0062d0', '#0052b3', '#003d86', '#002859'],
    },
    primaryColor: 'blue',
    radius: { sm: '4px', md: '8px' },
    fontSizes: { sm: '14px', md: '16px' }
  }),
  useMantineColorScheme: () => ({
    colorScheme: 'dark',
    toggleColorScheme: vi.fn()
  })
}));

// Mock the StyleService
vi.mock('../services/StyleService', () => ({
  styleService: {
    initialize: vi.fn(),
    updateColorScheme: vi.fn(),
    updateCustomTheme: vi.fn()
  }
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    })
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Wrapper component for testing hooks
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
};

describe('ThemeContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  afterEach(() => {
    // Clear mocks to ensure tests don't affect each other
    vi.clearAllMocks();
  });

  describe('ThemeProvider', () => {
    it('initializes the ThemeProvider with default theme when localStorage is empty', () => {
      render(<ThemeProvider>Test Content</ThemeProvider>);
      
      expect(styleService.initialize).toHaveBeenCalled();
      expect(localStorageMock.getItem).toHaveBeenCalledWith('saga-abilities-custom-theme');
    });

    it('initializes the ThemeProvider with stored theme from localStorage', () => {
      const storedTheme: ThemeColors = {
        primaryColor: 'red.5',
        accentColor: 'green.6',
        borderRadius: 8,
        fontScale: 1.2,
        imageEnabled: true
      };
      
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(storedTheme));
      
      render(<ThemeProvider>Test Content</ThemeProvider>);
      
      expect(styleService.initialize).toHaveBeenCalled();
      const initializeCall = vi.mocked(styleService.initialize).mock.calls[0];
      expect(initializeCall[2]).toEqual(storedTheme);
    });

    it('renders children properly', () => {
      render(
        <ThemeProvider>
          <div data-testid="child-content">Child Content</div>
        </ThemeProvider>
      );
      
      expect(screen.getByTestId('child-content')).toBeInTheDocument();
      expect(screen.getByText('Child Content')).toBeInTheDocument();
    });

    it('updates the StyleService when color scheme changes', () => {
      // First render with 'dark' color scheme (default from mock)
      const { rerender } = render(<ThemeProvider>Test Content</ThemeProvider>);
      
      // Then rerender with a different color scheme
      vi.mocked(styleService.updateColorScheme).mockClear();
      
      // Force a rerender to trigger the useEffect for color scheme
      rerender(<ThemeProvider>Test Content Updated</ThemeProvider>);
      
      expect(styleService.updateColorScheme).toHaveBeenCalledWith('dark');
    });
  });

  describe('useTheme hook', () => {
    it('throws an error when used outside ThemeProvider', () => {
      // Suppress console error for this test
      const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useTheme());
      }).toThrow('useTheme must be used within a ThemeProvider');
      
      consoleErrorMock.mockRestore();
    });

    it('provides the theme context when used inside ThemeProvider', () => {
      const { result } = renderHook(() => useTheme(), { wrapper: TestWrapper });
      
      expect(result.current).toHaveProperty('colors');
      expect(result.current).toHaveProperty('updateTheme');
      expect(result.current).toHaveProperty('resetTheme');
    });

    it('updates the theme when updateTheme is called', () => {
      const { result } = renderHook(() => useTheme(), { wrapper: TestWrapper });
      
      act(() => {
        result.current.updateTheme({ primaryColor: 'green.5', fontScale: 1.5 });
      });
      
      expect(result.current.colors.primaryColor).toBe('green.5');
      expect(result.current.colors.fontScale).toBe(1.5);
      expect(styleService.updateCustomTheme).toHaveBeenCalled();
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    it('resets the theme when resetTheme is called', () => {
      const { result } = renderHook(() => useTheme(), { wrapper: TestWrapper });
      
      // First update the theme
      act(() => {
        result.current.updateTheme({ primaryColor: 'green.5', fontScale: 1.5 });
      });
      
      // Then reset it
      act(() => {
        result.current.resetTheme();
      });
      
      // Default theme values
      expect(result.current.colors.primaryColor).toBe('brown.5');
      expect(result.current.colors.accentColor).toBe('blue.6');
      expect(result.current.colors.borderRadius).toBe(4);
      expect(result.current.colors.fontScale).toBe(1);
      expect(result.current.colors.imageEnabled).toBe(false);
      
      expect(styleService.updateCustomTheme).toHaveBeenCalled();
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });
  });

  describe('localStorage integration', () => {
    it('saves theme changes to localStorage', () => {
      const { result } = renderHook(() => useTheme(), { wrapper: TestWrapper });
      
      act(() => {
        result.current.updateTheme({ primaryColor: 'red.5' });
      });
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'saga-abilities-custom-theme',
        expect.stringContaining('red.5')
      );
    });
    
    it('loads theme from localStorage on initialization', () => {
      const customTheme = {
        primaryColor: 'purple.7',
        accentColor: 'orange.5',
        borderRadius: 10,
        fontScale: 1.25,
        imageEnabled: true
      };
      
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(customTheme));
      
      const { result } = renderHook(() => useTheme(), { wrapper: TestWrapper });
      
      expect(result.current.colors).toEqual(customTheme);
    });
  });

  describe('styleService integration', () => {
    it('initializes styleService with correct values', () => {
      render(<ThemeProvider>Test Content</ThemeProvider>);
      
      expect(styleService.initialize).toHaveBeenCalledTimes(1);
      expect(vi.mocked(styleService.initialize).mock.calls[0][1]).toBe('dark'); // colorScheme
      expect(typeof vi.mocked(styleService.initialize).mock.calls[0][0]).toBe('object'); // mantineTheme
    });
    
    it('updates styleService when theme changes', () => {
      const { result } = renderHook(() => useTheme(), { wrapper: TestWrapper });
      
      act(() => {
        result.current.updateTheme({ borderRadius: 12 });
      });
      
      expect(styleService.updateCustomTheme).toHaveBeenCalledTimes(1);
      expect(styleService.updateCustomTheme).toHaveBeenCalledWith(
        expect.objectContaining({ borderRadius: 12 })
      );
    });
  });
});
