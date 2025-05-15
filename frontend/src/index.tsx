import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    {/* <HashRouter> */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
    {/* </HashRouter> */}
  </React.StrictMode>
);
