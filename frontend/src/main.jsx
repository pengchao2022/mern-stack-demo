import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// 检查并修复错误的 URL
if (window.location.pathname === '/note/undefined') {
  window.history.replaceState({}, '', '/');
}

createRoot(document.getElementById('root')).render(
  <App />
)