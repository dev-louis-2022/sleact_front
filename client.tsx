import React from 'react';
import ReactDom from 'react-dom/client';
import App from './layouts/App';

const root = ReactDom.createRoot(document.querySelector('#app') as HTMLElement);

root.render(<App />);
