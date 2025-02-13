import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

/* Components */
import App from './App.tsx'

/* Styles */
import './index.css'
import './styles/styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
