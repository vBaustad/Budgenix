import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import App from './App.tsx'
import i18n from './i18n'
import { CurrencyProvider } from './context/CurrencyContext.tsx'
import { CategoryProvider } from './context/CategoryContext.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { UserProvider } from './context/UserContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <UserProvider>        
          <CurrencyProvider>
            <CategoryProvider>
              <App />
            </CategoryProvider>
          </CurrencyProvider>        
        </UserProvider>
      </AuthProvider>
    </I18nextProvider>
  </StrictMode>
)
