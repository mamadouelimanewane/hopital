import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { DataStoreProvider } from './contexts/DataStore.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DataStoreProvider>
      <App />
    </DataStoreProvider>
  </StrictMode>,
)
