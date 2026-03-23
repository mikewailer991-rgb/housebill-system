import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { initDB, registerServiceWorker, syncQueuedActions } from './utils/offline'

initDB();
registerServiceWorker();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App onSyncQueued={syncQueuedActions} />
  </React.StrictMode>,
)
