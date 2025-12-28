import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Welcome from './components/Welcome';
import GetStarted from './components/GetStarted';
import PatientLogin from './components/auth/PatientLogin';
import PatientRegister from './components/auth/PatientRegister';
import ProfessionalEntry from './components/auth/ProfessionalEntry';
import DoctorLogin from './components/auth/DoctorLogin';
import DoctorRegister from './components/auth/DoctorRegister';
import DiagnosticsLogin from './components/auth/DiagnosticsLogin';
import DiagnosticsRegister from './components/auth/DiagnosticsRegister';
import MedicalShopLogin from './components/auth/MedicalShopLogin';
import MedicalShopRegister from './components/auth/MedicalShopRegister';
import PatientPortal from './components/portals/PatientPortal';
import DoctorPortal from './components/portals/DoctorPortal';
import DiagnosticsPortal from './components/portals/DiagnosticsPortal';
import MedicalShopPortal from './components/portals/MedicalShopPortal';
import HelpPage from './components/pages/HelpPage';
import AboutPage from './components/pages/AboutPage';
import ReviewsPage from './components/pages/ReviewsPage';
import ContactPage from './components/pages/ContactPage';

interface User {
  id: number;
  role: 'PATIENT' | 'DOCTOR' | 'DIAGNOSTICS' | 'SHOP';
  name: string;
  email: string;
  [key: string]: any;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Welcome />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Patient Auth Routes */}
        <Route path="/patient/login" element={<PatientLogin onLogin={login} />} />
        <Route path="/patient/register" element={<PatientRegister onRegister={login} />} />

        {/* Professional Entry */}
        <Route path="/professional" element={<ProfessionalEntry />} />

        {/* Doctor Auth Routes */}
        <Route path="/doctor/login" element={<DoctorLogin onLogin={login} />} />
        <Route path="/doctor/register" element={<DoctorRegister onRegister={login} />} />

        {/* Diagnostics Auth Routes */}
        <Route path="/diagnostics/login" element={<DiagnosticsLogin onLogin={login} />} />
        <Route path="/diagnostics/register" element={<DiagnosticsRegister onRegister={login} />} />

        {/* Medical Shop Auth Routes */}
        <Route path="/shop/login" element={<MedicalShopLogin onLogin={login} />} />
        <Route path="/shop/register" element={<MedicalShopRegister onRegister={login} />} />

        {/* Protected Portal Routes */}
        <Route
          path="/patient/*"
          element={
            user?.role === 'PATIENT' ? (
              <PatientPortal user={user} onLogout={logout} />
            ) : (
              <Navigate to="/patient/login" replace />
            )
          }
        />
        <Route
          path="/doctor/*"
          element={
            user?.role === 'DOCTOR' ? (
              <DoctorPortal user={user} onLogout={logout} />
            ) : (
              <Navigate to="/doctor/login" replace />
            )
          }
        />
        <Route
          path="/diagnostics/*"
          element={
            user?.role === 'DIAGNOSTICS' ? (
              <DiagnosticsPortal user={user} onLogout={logout} />
            ) : (
              <Navigate to="/diagnostics/login" replace />
            )
          }
        />
        <Route
          path="/shop/*"
          element={
            user?.role === 'SHOP' ? (
              <MedicalShopPortal user={user} onLogout={logout} />
            ) : (
              <Navigate to="/shop/login" replace />
            )
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
