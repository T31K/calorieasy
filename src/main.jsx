import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ClerkProvider } from '@clerk/clerk-react';
const clerkPubKey = process.env.CLERK_PUBLISHABLE_KEY;
console.log(clerkPubKey);
const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
