import { Package, Search, FileText, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { useState } from 'react';
import { toast } from 'sonner@2.0.3';

interface MedicalShopOrdersProps {
  user: any;
}

const orders = [
  {
    id: 1,
    orderId: 'ORD-001',
    patientName: 'John Doe',
    patientPhone: '+91-9876543210',
    medicines: ['Paracetamol 500mg x10', 'Amoxicillin 250mg x15', 'Vitamin D3 x30'],
    totalAmount: 850,
    prescriptionUrl: 'prescription_001.pdf',
    orderDate: '2025-11-26 09:00 AM',
    status: 'PENDING',
    paymentStatus: 'PENDING'
  },
  {
    id: 2,
    orderId: 'ORD-002',
    patientName: 'Jane Smith',
    patientPhone: '+91-9876543211',
    medicines: ['Azithromycin 500mg x6', 'Cetirizine 10mg x10'],
    totalAmount: 450,
    prescriptionUrl: 'prescription_002.pdf',
    orderDate: '2025-11-26 10:30 AM',
    status: 'PROCESSING',
    paymentStatus: 'PAID'
  },
  {
    id: 3,
    orderId: 'ORD-003',
    patientName: 'Mike Johnson',
    patientPhone: '+91-9876543212',
    medicines: ['Metformin 500mg x30', 'Aspirin 75mg x30', 'Atorvastatin 10mg x30'],
    totalAmount: 1200,
    prescriptionUrl: 'prescription_003.pdf',
    orderDate: '2025-11-26 11:00 AM',
    status: 'READY',
    paymentStatus: 'PAID'
  },
  {
    id: 4,
    orderId: 'ORD-004',
    patientName: 'Sarah Williams',
    patientPhone: '+91-9876543213',
    medicines: ['Omeprazole 20mg x14'],
    totalAmount: 250,
    prescriptionUrl: 'prescription_004.pdf',
    orderDate: '2025-11-25 02:00 PM',
    status: 'DELIVERED',
    paymentStatus: 'PAID'
  },
  {
    id: 5,
    orderId: 'ORD-005',
    patientName: 'David Brown',
    patientPhone: '+91-9876543214',
    medicines: ['Ibuprofen 400mg x20', 'Multivitamin x30'],
    totalAmount: 600,
    prescriptionUrl: null,
    orderDate: '2025-11-25 03:30 PM',
    status: 'CANCELLED',
    paymentStatus: 'REFUNDED'
  }
];

export default function MedicalShopOrders({ user }: MedicalShopOrdersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const filteredOrders = orders.filter(order => {
    const matchesSearch = !searchTerm || 
      order.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    toast.success(`Order ${orderId} status updated to ${newStatus}`);
  };

  const handleViewPrescription = (url: string | null) => {
    if (url) {
      toast.info('Opening prescription...');
    } else {
      toast.error('No prescription attached');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Medicine Orders</h1>
        <p className="text-gray-600">Manage customer medicine orders</p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl mb-1">{orders.filter(o => o.status === 'PENDING').length}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl mb-1">{orders.filter(o => o.status === 'PROCESSING').length}</div>
            <div className="text-sm text-gray-600">Processing</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl mb-1">{orders.filter(o => o.status === 'READY').length}</div>
            <div className="text-sm text-gray-600">Ready</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl mb-1">{orders.filter(o => o.status === 'DELIVERED').length}</div>
            <div className="text-sm text-gray-600">Delivered</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Search by patient name or order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PROCESSING">Processing</SelectItem>
                <SelectItem value="READY">Ready for Pickup</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>Complete list of medicine orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Medicines</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div>
                        <div className="mb-1">{order.orderId}</div>
                        <div className="text-xs text-gray-500">{order.orderDate}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="mb-1">{order.patientName}</div>
                        <div className="text-xs text-gray-500">{order.patientPhone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        {order.medicines.slice(0, 2).map((med, idx) => (
                          <div key={idx} className="text-sm">{med}</div>
                        ))}
                        {order.medicines.length > 2 && (
                          <div className="text-xs text-gray-500">+{order.medicines.length - 2} more</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>₹{order.totalAmount.toLocaleString('en-IN')}</TableCell>
                    <TableCell>
                      <Badge className={
                        order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' :
                        order.paymentStatus === 'REFUNDED' ? 'bg-gray-100 text-gray-700' :
                        'bg-yellow-100 text-yellow-700'
                      }>
                        {order.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                        order.status === 'READY' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'PROCESSING' ? 'bg-purple-100 text-purple-700' :
                        order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewPrescription(order.prescriptionUrl)}
                        >
                          <FileText className="size-4" />
                        </Button>
                        {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                          <Select onValueChange={(value) => handleUpdateStatus(order.orderId, value)}>
                            <SelectTrigger className="w-28">
                              <SelectValue placeholder="Update" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PROCESSING">Process</SelectItem>
                              <SelectItem value="READY">Mark Ready</SelectItem>
                              <SelectItem value="DELIVERED">Deliver</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
