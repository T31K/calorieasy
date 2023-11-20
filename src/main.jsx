import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';
const container = document.getElementById('root');
const root = createRoot(container);
const CLIENT_ID = import.meta.env.VITE_AUTH_CLIENT_ID;
import { Analytics } from '@vercel/analytics/react';

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain="t31k.au.auth0.com"
      clientId="huWKp9TKazubuZoAxivLZSavXRgjic3V"
      cacheLocation="localstorage"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <App />
      <Analytics />
    </Auth0Provider>
  </React.StrictMode>
);
