// Ensure window.fetch can be safely assigned without throwing getter-only TypeError
if (typeof window !== 'undefined' && window.fetch) {
  try {
    let currentFetch = window.fetch;
    Object.defineProperty(window, 'fetch', {
      get() {
        return currentFetch;
      },
      set(fn: typeof fetch) {
        currentFetch = fn;
      },
      configurable: true,
      enumerable: true
    });
  } catch (e) {
    // Ignore if already redefined or blocked
  }
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
