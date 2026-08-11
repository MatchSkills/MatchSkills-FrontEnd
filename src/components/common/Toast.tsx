'use client';

import { Toaster as SonnerToaster } from 'sonner';

export const Toast: React.FC = () => {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        duration: 3500,
        style: {
          background: '#ffffff',
          color: '#0f172a',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
          padding: '12px 16px',
        },
      }}
    />
  );
};
