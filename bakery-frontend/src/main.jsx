import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import store from './app/store.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster position="top-right" toastOptions={{
          style: { background: '#3B1F0E', color: '#FAF6EF', fontFamily: 'DM Sans' },
          success: { iconTheme: { primary: '#D4A853', secondary: '#FAF6EF' } }
        }} />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
