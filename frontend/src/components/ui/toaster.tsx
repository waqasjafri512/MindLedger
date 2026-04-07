'use client';

import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        style: {
          fontFamily: 'var(--font-sans)',
          border: '1px solid var(--border)',
          borderRadius: '1rem',
          padding: '16px',
        },
        classNames: {
          success: 'border-teal/30 bg-teal/5',
          error: 'border-red/30 bg-red/5',
        },
      }}
      richColors
      closeButton
    />
  );
}
