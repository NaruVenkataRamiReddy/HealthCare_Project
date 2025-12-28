import { ShoppingCart, Package, CheckCircle, Truck } from 'lucide-react';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';

interface PatientOrdersProps {
  user: any;
}

const orders = [
  {
    id: 1234,
    shop: 'HealthPlus Pharmacy',
    date: '2025-11-20',
    items: [{ name: 'Aspirin 75mg', quantity: 30, price: 15 }, { name: 'Atorvastatin 10mg', quantity: 30, price: 45 }],
    total: 60,
    status: 'DELIVERED',
    deliveryDate: '2025-11-21'
  },
  {
    id: 1235,
    shop: 'MediCare Pharmacy',
    date: '2025-11-21',
    items: [{ name: 'Amoxicillin 500mg', quantity: 21, price: 35 }, { name: 'Paracetamol 650mg', quantity: 10, price: 8 }],
    total: 43,
    status: 'DISPATCHED',
    estimatedDelivery: '2025-11-22'
  },
  {
    id: 1236,
    shop: 'QuickMed Pharmacy',
    date: '2025-11-21',
    items: [{ name: 'Hydrocortisone cream', quantity: 1, price: 25 }],
    total: 25,
    status: 'ACCEPTED',
    estimatedDelivery: '2025-11-23'
  }
];

export default function PatientOrders({ user }: PatientOrdersProps) {
  const activeOrders = orders.filter(o => o.status !== 'DELIVERED');
  const completedOrders = orders.filter(o => o.status === 'DELIVERED');

  const statusConfig = {
    ACCEPTED: { color: 'bg-yellow-100 text-yellow-700', icon: Package },
    DISPATCHED: { color: 'bg-blue-100 text-blue-700', icon: Truck },
    DELIVERED: { color: 'bg-green-100 text-green-700', icon: CheckCircle }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">My Orders</h1>
        <p className="text-gray-600">Track your medicine orders</p>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active ({activeOrders.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedOrders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4 mt-6">
          {activeOrders.map((order) => {
            const StatusIcon = statusConfig[order.status as keyof typeof statusConfig].icon;
            return (
              <Card key={order.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl mb-1">Order #{order.id}</h3>
                      <p className="text-gray-600">{order.shop}</p>
                    </div>
                    <Badge className={statusConfig[order.status as keyof typeof statusConfig].color}>
                      <StatusIcon className="size-3 mr-1" />
                      {order.status}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                        <span>{item.name} x {item.quantity}</span>
                        <span>${item.price}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg mb-4">
                    <span>Total Amount</span>
                    <span className="text-xl">${order.total}</span>
                  </div>

                  {order.estimatedDelivery && (
                    <div className="text-sm text-gray-600 mb-4">
                      Estimated Delivery: {order.estimatedDelivery}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button size="sm" variant="outline">Track Order</Button>
                    <Button size="sm" variant="outline">Contact Shop</Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4 mt-6">
          {completedOrders.map((order) => (
            <Card key={order.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl mb-1">Order #{order.id}</h3>
                    <p className="text-gray-600">{order.shop}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-700">
                    <CheckCircle className="size-3 mr-1" />
                    DELIVERED
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                      <span>{item.name} x {item.quantity}</span>
                      <span>${item.price}</span>
                    </div>
                  ))}
                </div>

                <div className="text-sm text-gray-600 mb-4">
                  Delivered on: {order.deliveryDate}
                </div>

                <div className="flex gap-3">
                  <Button size="sm" variant="outline">View Receipt</Button>
                  <Button size="sm" variant="outline">Reorder</Button>
                  <Button size="sm">Leave Review</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
