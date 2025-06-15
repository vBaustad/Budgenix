import './styles/App.css'
import './styles/components.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import PrivateRoute from './components/routing/PrivateRoute'
import BaseLayout from './features/public/components/BaseLayout'
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
import Topbar from './components/layout/Topbar'
import Sidebar from './components/layout/Sidebar'

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 lg:pl-64 bg-budgenix-gradient">
          <Topbar />
          <main className="transition-all overflow-y-auto min-h-screen bg-budgenix-gradient">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<BaseLayout><LandingPage /></BaseLayout>} />
              <Route path="/login" element={<BaseLayout><LoginPage /></BaseLayout>} />
              <Route path="/signup" element={<BaseLayout><SignUpPage /></BaseLayout>} />

              {/* Private routes */}
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
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App
