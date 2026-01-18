import { createRootRoute, Outlet } from '@tanstack/react-router';
import React from 'react';
import { Toaster } from './___shared/ui/sonner';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <Toaster position="top-center" />
      <Outlet />
    </React.Fragment>
  );
}
