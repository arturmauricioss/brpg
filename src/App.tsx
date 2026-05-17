import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import './index.css';
import Layout from '@components/shell/Layout/Layout';
import ProtectedRoute from '@components/shell/ProtectedRoute/ProtectedRoute';
import HomePage from '@pages/HomePage';
import HeroPage from '@pages/HeroPage';
import NewHeroPage from '@pages/NewHeroPage';
import ConfigPage from '@pages/ConfigPage';
import LoginPage from '@pages/LoginPage';
import RegisterPage from '@pages/RegisterPage';
import { useAuth } from '@hooks/useAuth';
import { PersonagensProvider } from '@context/PersonagensContext';

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (user) {
    return <Navigate to="/heroes" replace />;
  }

  return <>{children}</>;
}

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: (
        <PersonagensProvider>
          <Layout />
        </PersonagensProvider>
      ),
      children: [
        { index: true, element: <Navigate to="/heroes" replace /> },
        {
          path: 'home',
          element: (
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'login',
          element: (
            <AuthRoute>
              <LoginPage />
            </AuthRoute>
          ),
        },
        {
          path: 'register',
          element: (
            <AuthRoute>
              <RegisterPage />
            </AuthRoute>
          ),
        },
        {
          path: 'heroes',
          element: (
            <ProtectedRoute>
              <HeroPage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'heroes/new',
          element: (
            <ProtectedRoute>
              <NewHeroPage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'config',
          element: (
            <ProtectedRoute>
              <ConfigPage />
            </ProtectedRoute>
          ),
        },
        {
          path: '*',
          element: <Navigate to="/heroes" replace />,
        },
      ],
    },
  ],
  { basename: '/' }
);

export default function App() {
  return <RouterProvider router={router} />;
}
