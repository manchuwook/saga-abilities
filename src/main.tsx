import ReactDOM from 'react-dom/client';
import { MantineProvider, ColorSchemeScript, localStorageColorSchemeManager } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from './lib/router';
import { AbilityManualsProvider } from './context/AbilityManualsContext';
import { baseTheme } from './theme/mantineTheme';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Create a color scheme manager
const colorSchemeManager = localStorageColorSchemeManager({ key: 'saga-abilities-color-scheme' });

// Temporarily remove StrictMode to avoid the double-render issue with React 19
ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <ColorSchemeScript defaultColorScheme="dark" />
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={baseTheme} defaultColorScheme="dark" colorSchemeManager={colorSchemeManager}>
        <Notifications />
        <ModalsProvider>
          <AbilityManualsProvider>
            <RouterProvider router={router} />
          </AbilityManualsProvider>
        </ModalsProvider>
      </MantineProvider>
    </QueryClientProvider>
  </>,
);