import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(<App />);
} else {
  console.error("Missing #root element");
}
