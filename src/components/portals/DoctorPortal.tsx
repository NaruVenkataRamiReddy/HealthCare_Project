import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Stethoscope, LayoutDashboard, Calendar, FileText, Users, CreditCard, Video, Star, User, LogOut, Menu, X } from 'lucide-react';
import { Button } from '../ui/button';
import { useState } from 'react';
import DoctorDashboard from './doctor/DoctorDashboard';
import DoctorAppointments from './doctor/DoctorAppointments';
import DoctorPrescriptions from './doctor/DoctorPrescriptions';
import DoctorPayments from './doctor/DoctorPayments';
import DoctorProfile from './doctor/DoctorProfile';

interface DoctorPortalProps {
  user: any;
  onLogout: () => void;
}

export default function DoctorPortal({ user, onLogout }: DoctorPortalProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { path: '/doctor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/doctor/appointments', label: 'Appointments', icon: Calendar },
    { path: '/doctor/prescriptions', label: 'Prescriptions', icon: FileText },
    { path: '/doctor/patients', label: 'Patient Records', icon: Users },
    { path: '/doctor/payments', label: 'Payments & Status', icon: CreditCard },
    { path: '/doctor/videos', label: 'Consultation Videos', icon: Video },
    { path: '/doctor/reviews', label: 'Reviews', icon: Star },
    { path: '/doctor/profile', label: 'Profile & Settings', icon: User },
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
                <Stethoscope className="size-8 text-blue-600" />
                <span className="text-xl text-blue-900">HealthCare+</span>
              </div>
              <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
                <X className="size-6" />
              </button>
            </div>
          </div>

          <div className="p-4 border-b bg-blue-50">
            <div className="text-sm text-gray-600">Doctor Portal</div>
            <div className="text-blue-900">{user.name}</div>
            <div className="text-xs text-gray-600">{user.specialization}</div>
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
                        isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
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
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="size-5 text-blue-600" />
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          <Routes>
            <Route path="/" element={<Navigate to="/doctor/dashboard" replace />} />
            <Route path="/dashboard" element={<DoctorDashboard user={user} />} />
            <Route path="/appointments" element={<DoctorAppointments user={user} />} />
            <Route path="/prescriptions" element={<DoctorPrescriptions user={user} />} />
            <Route path="/patients" element={<div className="text-center py-12 text-gray-500">Patient Records Page</div>} />
            <Route path="/payments" element={<DoctorPayments user={user} />} />
            <Route path="/videos" element={<div className="text-center py-12 text-gray-500">Consultation Videos Page</div>} />
            <Route path="/reviews" element={<div className="text-center py-12 text-gray-500">Reviews Page</div>} />
            <Route path="/profile" element={<DoctorProfile user={user} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
