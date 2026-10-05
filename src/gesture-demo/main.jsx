import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { EMBED } from './config.js';
import './index.css';

if (EMBED) document.documentElement.classList.add('is-embed');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
