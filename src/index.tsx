import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <FluentProvider
    theme={webLightTheme}
    className="provider"
    style={{ backgroundColor: 'var(--backgroundColor)' }}
  >
    <App />
  </FluentProvider>
);
