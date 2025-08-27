import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import { RouterProvider } from '@tanstack/react-router';
import { Toaster } from 'react-hot-toast';
import { client } from './app/lib/apollo.ts';
import { router } from './app/router.ts';
import { toastConfig } from './app/lib/toast.ts';
import './globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <RouterProvider router={router} />
      <Toaster {...toastConfig} />
    </ApolloProvider>
  </React.StrictMode>
);
