import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { vi } from 'vitest';

// Mock theme context to prevent errors in tests
vi.mock('../context/ThemeContext', () => ({
  useTheme: () => ({
    colors: {
      accent: '#4c6ef5',
      background: '#ffffff',
      text: '#333333',
    }
  })
}));

// A simplified version that doesn't depend on ThemeContext and AbilityManualsContext
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <MantineProvider defaultColorScheme="light">
        {children}
      </MantineProvider>
    </BrowserRouter>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';
export { customRender as render };
