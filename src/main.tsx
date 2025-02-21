import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

/* Components */
import App from './App.tsx'

/* Styles */
import './styles/styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
