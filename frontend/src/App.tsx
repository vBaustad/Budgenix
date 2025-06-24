import './styles/App.css'
import './styles/components.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';
import PrivateRoute from './components/routing/PrivateRoute'
import AppLayout from './components/layout/AppLayout'
import BaseLayout from './features/public/components/BaseLayout';
import SignupConfirmationPage from './pages/public/SignupConfirmationPage';
import {
  DashboardPage,
  BudgetsPage,
  ExpensesPage,
  IncomePage,
  CashflowPage,
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



function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<BaseLayout><LandingPage /></BaseLayout>} />
        <Route path="/login" element={<BaseLayout><LoginPage /></BaseLayout>} />
        <Route path="/signup" element={<BaseLayout><SignUpPage /></BaseLayout>} />
        <Route path="/signup/confirm" element={<BaseLayout><SignupConfirmationPage /></BaseLayout>} />


        {/* Private Routes */}
        <Route element={<AppLayout />}>
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/budgets" element={<BudgetsPage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/income" element={<IncomePage />} />
            <Route path="/cashflow" element={<CashflowPage />} />
            <Route path="/goals" element={<GoalsPage />} />
            <Route path="/vacation-mode" element={<VacationModePage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>

  );
}

export default App;
