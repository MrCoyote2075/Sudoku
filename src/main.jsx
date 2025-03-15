import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// import Temp from './Temp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    {/* <Temp /> */}
  </StrictMode>,
)
