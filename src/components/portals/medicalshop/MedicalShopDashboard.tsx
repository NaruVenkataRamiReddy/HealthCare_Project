import { Package, ShoppingCart, TrendingUp, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';

interface MedicalShopDashboardProps {
  user: any;
}

export default function MedicalShopDashboard({ user }: MedicalShopDashboardProps) {
  const stats = [
    { label: 'Pending Orders', value: '8', icon: ShoppingCart, color: 'orange' },
    { label: 'Total Medicines', value: '450', icon: Package, color: 'blue' },
    { label: 'Low Stock Items', value: '12', icon: TrendingUp, color: 'red' },
    { label: 'This Month Sales', value: '₹125,000', icon: CreditCard, color: 'green' },
  ];

  const recentOrders = [
    { id: 1, orderId: 'ORD-001', patient: 'John Doe', medicines: 3, amount: 850, status: 'PENDING' },
    { id: 2, orderId: 'ORD-002', patient: 'Jane Smith', medicines: 2, amount: 450, status: 'PROCESSING' },
    { id: 3, orderId: 'ORD-003', patient: 'Mike Johnson', medicines: 5, amount: 1200, status: 'READY' },
    { id: 4, orderId: 'ORD-004', patient: 'Sarah Williams', medicines: 1, amount: 250, status: 'DELIVERED' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Welcome, {user.shopName}!</h1>
        <p className="text-gray-600">Here's your medical shop overview</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <Icon className="size-8 text-orange-600" />
                  <div className="text-3xl">{stat.value}</div>
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="mb-1">{order.orderId} - {order.patient}</div>
                  <div className="text-sm text-gray-600">{order.medicines} medicines • ₹{order.amount.toLocaleString('en-IN')}</div>
                </div>
                <Badge className={
                  order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                  order.status === 'READY' ? 'bg-blue-100 text-blue-700' :
                  order.status === 'PROCESSING' ? 'bg-purple-100 text-purple-700' :
                  'bg-yellow-100 text-yellow-700'
                }>
                  {order.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
