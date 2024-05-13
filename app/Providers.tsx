'use client';

import React from 'react';
import { Toaster } from 'react-hot-toast';
import { NextUIProvider } from '@nextui-org/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const Providers = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();

  return (
    <div>
      <Toaster position="bottom-right" />
      <NextUIProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </NextUIProvider>
    </div>
  );
};

export default Providers;
