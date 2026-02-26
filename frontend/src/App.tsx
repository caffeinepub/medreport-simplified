import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { Toaster } from '@/components/ui/sonner';
import { SplashScreen } from './pages/SplashScreen';
import { InputScreen } from './pages/InputScreen';
import { ResultsScreen } from './pages/ResultsScreen';
import { HistoryScreen } from './pages/HistoryScreen';

// Root route with outlet
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster position="bottom-center" richColors />
    </>
  ),
});

// Splash screen (default/home)
const splashRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: SplashScreen,
});

// Input screen
const inputRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/input',
  component: InputScreen,
});

// Results screen
const resultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/results/$reportId',
  component: ResultsScreen,
});

// History screen
const historyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/history',
  component: HistoryScreen,
});

const routeTree = rootRoute.addChildren([
  splashRoute,
  inputRoute,
  resultsRoute,
  historyRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
