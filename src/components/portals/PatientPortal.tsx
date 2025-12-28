import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Heart, LayoutDashboard, Calendar, FileText, ShoppingCart, Pill, CreditCard, Star, User, LogOut, Menu, X, HelpCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { useState } from 'react';
import PatientDashboard from './patient/PatientDashboard';
import PatientAppointments from './patient/PatientAppointments';
import BookAppointment from './patient/BookAppointment';
import PatientPrescriptions from './patient/PatientPrescriptions';
import PatientOrders from './patient/PatientOrders';
import OrderMedicines from './patient/OrderMedicines';
import PatientPayments from './patient/PatientPayments';
import PatientReviews from './patient/PatientReviews';
import PatientProfile from './patient/PatientProfile';

interface PatientPortalProps {
  user: any;
  onLogout: () => void;
}

export default function PatientPortal({ user, onLogout }: PatientPortalProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { path: '/patient/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/patient/book-appointment', label: 'Book Appointment', icon: Calendar },
    { path: '/patient/appointments', label: 'My Appointments', icon: Calendar },
    { path: '/patient/prescriptions', label: 'Prescriptions', icon: FileText },
    { path: '/patient/orders', label: 'Orders', icon: ShoppingCart },
    { path: '/patient/order-medicines', label: 'Order Medicines', icon: Pill },
    { path: '/patient/payments', label: 'Payments & Status', icon: CreditCard },
    { path: '/patient/reviews', label: 'Rate & Review', icon: Star },
    { path: '/patient/profile', label: 'Profile & Settings', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="size-8 text-blue-600" />
                <span className="text-xl text-blue-900">HealthCare+</span>
              </div>
              <button
                className="lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="size-6" />
              </button>
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 border-b bg-blue-50">
            <div className="text-sm text-gray-600">Welcome back,</div>
            <div className="text-blue-900">{user.name}</div>
          </div>

          {/* Navigation */}
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
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
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

          {/* Logout */}
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white shadow-sm p-4 lg:px-8 flex items-center justify-between sticky top-0 z-30">
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="size-6" />
          </button>

          <div className="flex-1 lg:block hidden" />

          <div className="flex items-center gap-4">
            <Link to="/help">
              <Button variant="ghost" size="sm">
                <HelpCircle className="size-5 mr-2" />
                Help
              </Button>
            </Link>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="size-5 text-blue-600" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8">
          <Routes>
            <Route path="/" element={<Navigate to="/patient/dashboard" replace />} />
            <Route path="/dashboard" element={<PatientDashboard user={user} />} />
            <Route path="/book-appointment" element={<BookAppointment user={user} />} />
            <Route path="/appointments" element={<PatientAppointments user={user} />} />
            <Route path="/prescriptions" element={<PatientPrescriptions user={user} />} />
            <Route path="/orders" element={<PatientOrders user={user} />} />
            <Route path="/order-medicines" element={<OrderMedicines user={user} />} />
            <Route path="/payments" element={<PatientPayments user={user} />} />
            <Route path="/reviews" element={<PatientReviews user={user} />} />
            <Route path="/profile" element={<PatientProfile user={user} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
