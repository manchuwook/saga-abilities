import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import AppWrapper from '../components/AppWrapper';
import ErrorPage from '../pages/ErrorPage';
import { Loader, Center } from '@mantine/core';

// Lazy load page components for code splitting
const AbilitiesPage = lazy(() => import('../pages/AbilitiesPage'));
const AbilityManualsPage = lazy(() => import('../pages/AbilityManualsPage'));
const AbilityManualDetailPage = lazy(() => import('../pages/AbilityManualDetailPage'));

// Loading component
const PageLoader = () => (
  <Center style={{ width: '100%', height: '70vh' }}>
    <Loader size="xl" />
  </Center>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppWrapper />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <AbilitiesPage />
          </Suspense>
        ),
      },
      {
        path: 'AbilityManuals',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AbilityManualsPage />
          </Suspense>
        ),
      },
      {
        path: 'AbilityManuals/:id',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AbilityManualDetailPage />
          </Suspense>
        ),
      },
    ],
  },
]);
