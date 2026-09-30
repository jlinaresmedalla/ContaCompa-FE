import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { I18N_READY } from '@/app/i18n'
import { AppProviders } from '@/app/providers/AppProviders'
import './index.css'

const ROOT = document.getElementById('root')
if (!ROOT) throw new Error('#root element missing from index.html')

void I18N_READY.then(() =>
  createRoot(ROOT).render(
    <StrictMode>
      <AppProviders />
    </StrictMode>,
  ),
)
