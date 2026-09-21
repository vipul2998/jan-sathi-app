import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import JanSathiApp from './JanSathiApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <JanSathiApp />
  </StrictMode>,
)
