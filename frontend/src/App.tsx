
import './styles/app.css'
import './styles/components.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './pages/app/Dashboard';
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import BaseLayout from './components/public/BaseLayout'
import SignUpPage from './pages/public/SignUpPage';
import PrivateRoute from './components/app/PrivateRoute';
import AppLayout from './components/app/AppLayout';

function App() {
  return ( 
    <AuthProvider>
      <Router>
        <Routes>
          {/* Landing page - before logging in */}
          <Route path="/" element={<BaseLayout><LandingPage /></BaseLayout>} />
          <Route path="/login" element={<BaseLayout><LoginPage/></BaseLayout>} />
          <Route path="/signup" element={<BaseLayout><SignUpPage/></BaseLayout>} />
          {/* After logging in */}
          <PrivateRoute>
            <AppLayout>
              <Route path="/dashboard" element={<Dashboard />} />
              {/* <Route path="/budgets" element={<Budgets />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/income" element={<Income />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/vacation-mode" element={><VacationMode />} />
              <Route path="/reports" element={<Reports />} /> */}
              {/* User/Account settings */}
              {/* <Route path="/settings" element={<Settings />} /> */}
            </AppLayout>
          </PrivateRoute>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;