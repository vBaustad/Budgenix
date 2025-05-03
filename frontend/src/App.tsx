import React, { useState }  from 'react';
import './styles/app.css'
import './styles/components.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './pages/app/Dashboard';
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import BaseLayout from './components/public/BaseLayout'
import RegisterPage from './pages/public/RegisterPage';

function App() {
  const [isLoggedIn] = useState(false);
  return (    
    <AuthProvider>
      <Router>
        {!isLoggedIn}
        <Routes>
          <Route path="/" element={<BaseLayout><LandingPage /></BaseLayout>} />
          <Route path="/login" element={<BaseLayout><LoginPage/></BaseLayout>} />
          <Route path="/register" element={<BaseLayout><RegisterPage/></BaseLayout>} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;