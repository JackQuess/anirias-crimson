
'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';

interface RootProviderProps {
  children?: React.ReactNode;
}

export function RootProvider({ children }: RootProviderProps) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        forceTheme="dark" // Enforce Anirias aesthetics
        disableTransitionOnChange
      >
        {children}
        
        {/* Global Notifications */}
        <Toaster 
          position="bottom-right" 
          richColors 
          theme="dark" 
          toastOptions={{
            style: {
              background: '#0a0a0a',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff',
              fontFamily: 'var(--font-inter)',
            },
            classNames: {
              success: 'border-emerald-500/50 text-emerald-400',
              error: 'border-red-500/50 text-red-400',
              info: 'border-blue-500/50 text-blue-400',
            }
          }}
        />
      </ThemeProvider>
    </SessionProvider>
  );
}
