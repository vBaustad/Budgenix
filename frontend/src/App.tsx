import './styles/app.css'
import './styles/components.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';
import PrivateRoute from './components/routing/PrivateRoute'
import AppLayout from './components/layout/AppLayout'
import BaseLayout from './features/public/components/BaseLayout';

import {
  DashboardPage,
  BudgetsPage,
  ExpensesPage,
  IncomePage,
  GoalsPage,
  VacationModePage,
  ReportsPage,
  SettingsPage,
} from './pages/app'

import {
  LandingPage,
  LoginPage,
  SignUpPage,
} from './pages/public'

import { InsightsProvider } from './context/InsightContext'
import { FinanceProvider } from './context/FinanceContext'
import { UserLayer } from './context/UserLayer'
import { CoreProvider } from './context/CoreContext'

function App() {
  return (
    <UserLayer>
      <CoreProvider>
        <FinanceProvider>
          <InsightsProvider>
            <Router>
              <Toaster position="top-right" />
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<BaseLayout><LandingPage /></BaseLayout>} />
                <Route path="/login" element={<BaseLayout><LoginPage /></BaseLayout>} />
                <Route path="/signup" element={<BaseLayout><SignUpPage /></BaseLayout>} />

                {/* Private Routes */}
                <Route element={<AppLayout />}>
                  <Route element={<PrivateRoute />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/budgets" element={<BudgetsPage />} />
                    <Route path="/expenses" element={<ExpensesPage />} />
                    <Route path="/income" element={<IncomePage />} />
                    <Route path="/goals" element={<GoalsPage />} />
                    <Route path="/vacation-mode" element={<VacationModePage />} />
                    <Route path="/reports" element={<ReportsPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                  </Route>
                </Route>
              </Routes>
            </Router>
          </InsightsProvider>
        </FinanceProvider>
      </CoreProvider>
    </UserLayer>
  );
}

export default App;
