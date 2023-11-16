import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ClerkProvider } from '@clerk/clerk-react';
const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
