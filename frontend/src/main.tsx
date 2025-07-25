import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './lib/queryClient.ts';
import App from './App.tsx';
import i18n from './i18n';
import { UserLayer } from './context/UserLayer.tsx';
import { CoreProvider } from './context/CoreContext.tsx';
import { FinanceProvider } from './context/FinanceContext.tsx';
import { InsightsProvider } from './context/InsightContext.tsx';
import { SystemNotificationProvider } from './modules/systemNotifications/context/SystemNotificationContext.tsx';


import { GlobalWorkerOptions } from 'pdfjs-dist/';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker?url';
GlobalWorkerOptions.workerSrc = pdfjsWorker;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <UserLayer>
          <CoreProvider>
            <FinanceProvider>
              <InsightsProvider>
                <SystemNotificationProvider>
                  <App />
                </SystemNotificationProvider>
              </InsightsProvider>
            </FinanceProvider>
          </CoreProvider>
        </UserLayer>
      </I18nextProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);
