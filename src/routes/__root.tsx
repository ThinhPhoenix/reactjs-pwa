import { createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from '@/providers/theme-provider';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
    >
      <Outlet />
    </ThemeProvider>
  );
}
