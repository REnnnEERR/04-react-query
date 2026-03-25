import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import 'modern-normalize/modern-normalize.css';
import App from './components/App/App';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  
  <QueryClientProvider client={queryClient}>
    <App />
      <Toaster position="top-right" reverseOrder={false} />
  </QueryClientProvider>
);