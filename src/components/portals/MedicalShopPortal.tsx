import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { ShoppingBag, LayoutDashboard, Package, Pill, CreditCard, User, LogOut, Menu, X } from 'lucide-react';
import { Button } from '../ui/button';
import { useState } from 'react';
import MedicalShopDashboard from './medicalshop/MedicalShopDashboard';
import MedicalShopOrders from './medicalshop/MedicalShopOrders';
import MedicalShopMedicines from './medicalshop/MedicalShopMedicines';
import MedicalShopPayments from './medicalshop/MedicalShopPayments';
import MedicalShopProfile from './medicalshop/MedicalShopProfile';

interface MedicalShopPortalProps {
  user: any;
  onLogout: () => void;
}

export default function MedicalShopPortal({ user, onLogout }: MedicalShopPortalProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { path: '/shop/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/shop/orders', label: 'Orders', icon: Package },
    { path: '/shop/medicines', label: 'Medicine List', icon: Pill },
    { path: '/shop/payments', label: 'Payments & Status', icon: CreditCard },
    { path: '/shop/profile', label: 'Profile & Settings', icon: User },
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
                <ShoppingBag className="size-8 text-orange-600" />
                <span className="text-xl text-orange-900">HealthCare+</span>
              </div>
              <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
                <X className="size-6" />
              </button>
            </div>
          </div>

          <div className="p-4 border-b bg-orange-50">
            <div className="text-sm text-gray-600">Medical Shop Portal</div>
            <div className="text-orange-900">{user.shopName || user.name}</div>
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
                        isActive ? 'bg-orange-600 text-white' : 'text-gray-700 hover:bg-gray-100'
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
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <User className="size-5 text-orange-600" />
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          <Routes>
            <Route path="/" element={<Navigate to="/shop/dashboard" replace />} />
            <Route path="/dashboard" element={<MedicalShopDashboard user={user} />} />
            <Route path="/orders" element={<MedicalShopOrders user={user} />} />
            <Route path="/medicines" element={<MedicalShopMedicines user={user} />} />
            <Route path="/payments" element={<MedicalShopPayments user={user} />} />
            <Route path="/profile" element={<MedicalShopProfile user={user} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}