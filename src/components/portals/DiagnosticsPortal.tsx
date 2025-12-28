import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Activity, LayoutDashboard, Calendar, Package, CreditCard, User, LogOut, Menu, X } from 'lucide-react';
import { Button } from '../ui/button';
import { useState } from 'react';
import DiagnosticsDashboard from './diagnostics/DiagnosticsDashboard';
import DiagnosticsAppointments from './diagnostics/DiagnosticsAppointments';
import DiagnosticsServices from './diagnostics/DiagnosticsServices';
import DiagnosticsPayments from './diagnostics/DiagnosticsPayments';
import DiagnosticsProfile from './diagnostics/DiagnosticsProfile';

interface DiagnosticsPortalProps {
  user: any;
  onLogout: () => void;
}

export default function DiagnosticsPortal({ user, onLogout }: DiagnosticsPortalProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { path: '/diagnostics/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/diagnostics/appointments', label: 'Appointments', icon: Calendar },
    { path: '/diagnostics/services', label: 'Services & Packages', icon: Package },
    { path: '/diagnostics/payments', label: 'Payments & Status', icon: CreditCard },
    { path: '/diagnostics/profile', label: 'Profile & Settings', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="size-8 text-purple-600" />
                <span className="text-xl text-purple-900">HealthCare+</span>
              </div>
              <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
                <X className="size-6" />
              </button>
            </div>
          </div>

          <div className="p-4 border-b bg-purple-50">
            <div className="text-sm text-gray-600">Diagnostics Portal</div>
            <div className="text-purple-900">{user.centreName || user.name}</div>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className="size-5" />
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={onLogout}
            >
              <LogOut className="size-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm p-4 lg:px-8 flex items-center justify-between sticky top-0 z-30">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="size-6" />
          </button>
          <div className="flex-1 lg:block hidden" />
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <User className="size-5 text-purple-600" />
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          <Routes>
            <Route path="/" element={<Navigate to="/diagnostics/dashboard" replace />} />
            <Route path="/dashboard" element={<DiagnosticsDashboard user={user} />} />
            <Route path="/appointments" element={<DiagnosticsAppointments user={user} />} />
            <Route path="/services" element={<DiagnosticsServices user={user} />} />
            <Route path="/payments" element={<DiagnosticsPayments user={user} />} />
            <Route path="/profile" element={<DiagnosticsProfile user={user} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}