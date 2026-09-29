import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@/app/i18n'
import { AppProviders } from '@/app/providers/AppProviders'
import './index.css'

const root = document.getElementById('root')
if (!root) throw new Error('#root element missing from index.html')

createRoot(root).render(
  <StrictMode>
    <AppProviders />
  </StrictMode>,
)
