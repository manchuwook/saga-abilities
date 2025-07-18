import { createBrowserRouter } from 'react-router-dom';
import AppWrapper from '../components/AppWrapper';
import ErrorPage from '../pages/ErrorPage';
import AbilitiesPage from '../pages/AbilitiesPage';
import AbilityManualsPage from '../pages/AbilityManualsPage';
import AbilityManualDetailPage from '../pages/AbilityManualDetailPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppWrapper />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <AbilitiesPage />,
      },
      {
        path: 'AbilityManuals',
        element: <AbilityManualsPage />,
      },
      {
        path: 'AbilityManuals/:id',
        element: <AbilityManualDetailPage />,
      },
    ],
  },
]);
