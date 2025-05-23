import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './App.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Mengabaikan warning yang tidak penting
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  if (
    args[0]?.includes('Failed to parse source map') ||
    args[0]?.includes('DeprecationWarning') ||
    args[0]?.includes('webpack')
  ) {
    return;
  }
  originalConsoleWarn.apply(console, args);
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(); 