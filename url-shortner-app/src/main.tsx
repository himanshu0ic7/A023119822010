import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { UrlProvider } from './context/UrlContext.tsx';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <UrlProvider>  {/* Wrap App with the provider */}
        <App />
      </UrlProvider>
    </BrowserRouter>
  </React.StrictMode>,
);