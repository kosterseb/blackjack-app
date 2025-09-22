import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Optional: global styles

// This is where React "hooks into" your HTML
// It finds the element with id="root" in your HTML and renders your app there
const root = ReactDOM.createRoot(document.getElementById('root'));

// This actually starts your React app!
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);