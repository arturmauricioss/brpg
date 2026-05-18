import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeProvider } from '@features/theme/providers/ThemeProvider';

import { registerSW } from 'virtual:pwa-register';

let refreshing = false;

registerSW({
  immediate: true,

  onNeedRefresh() {
    if (!refreshing) {
      refreshing = true;
      window.location.reload();
    }
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);