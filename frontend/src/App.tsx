import './styles/app.css'
import './styles/components.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Toaster } from 'react-hot-toast';
import PrivateRoute from './components/app/PrivateRoute'
import AppLayout from './components/app/AppLayout'
import BaseLayout from './components/public/BaseLayout'

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

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<BaseLayout><LandingPage /></BaseLayout>} />
          <Route path="/login" element={<BaseLayout><LoginPage /></BaseLayout>} />
          <Route path="/signup" element={<BaseLayout><SignUpPage /></BaseLayout>} />

          {/* Private Routes (AppLayout wraps ALL protected content) */}
          <Route element={<AppLayout />}>
            <Route
              element={<PrivateRoute />}
            >
              
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
    </AuthProvider>
  );
}

export default App;
