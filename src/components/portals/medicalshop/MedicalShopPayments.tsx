import { CreditCard, TrendingUp, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { toast } from 'sonner@2.0.3';

interface MedicalShopPaymentsProps {
  user: any;
}

const payments = [
  {
    id: 1,
    orderId: 'ORD-001',
    patientName: 'John Doe',
    amount: 850,
    date: '2025-11-26',
    paymentId: 'pay_N5J9kM2Rz3Q5G2',
    status: 'SUCCESS'
  },
  {
    id: 2,
    orderId: 'ORD-002',
    patientName: 'Jane Smith',
    amount: 450,
    date: '2025-11-26',
    paymentId: 'pay_O6K0lN4Tz5S7I4',
    status: 'SUCCESS'
  },
  {
    id: 3,
    orderId: 'ORD-003',
    patientName: 'Mike Johnson',
    amount: 1200,
    date: '2025-11-26',
    paymentId: null,
    status: 'PENDING'
  },
  {
    id: 4,
    orderId: 'ORD-004',
    patientName: 'Sarah Williams',
    amount: 250,
    date: '2025-11-25',
    paymentId: 'pay_P7L1mO5Uz6T8J5',
    status: 'SUCCESS'
  },
  {
    id: 5,
    orderId: 'ORD-005',
    patientName: 'David Brown',
    amount: 600,
    date: '2025-11-25',
    paymentId: 'pay_Q8M2nP6Vz7U9K6',
    status: 'REFUNDED'
  },
];

export default function MedicalShopPayments({ user }: MedicalShopPaymentsProps) {
  const totalRevenue = payments.filter(p => p.status === 'SUCCESS').reduce((sum, p) => sum + p.amount, 0);
  const pendingPayments = payments.filter(p => p.status === 'PENDING').reduce((sum, p) => sum + p.amount, 0);

  const handleDownloadReceipt = (id: number) => {
    toast.success(`Downloading receipt for payment #${id}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Payments & Sales</h1>
        <p className="text-gray-600">Track your medicine sales and revenue</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <CreditCard className="size-8 text-orange-600" />
              <div className="text-3xl">₹{totalRevenue.toLocaleString('en-IN')}</div>
            </div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="size-8 text-green-600" />
              <div className="text-3xl">{payments.filter(p => p.status === 'SUCCESS').length}</div>
            </div>
            <div className="text-sm text-gray-600">Successful Payments</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <CreditCard className="size-8 text-yellow-600" />
              <div className="text-3xl">₹{pendingPayments.toLocaleString('en-IN')}</div>
            </div>
            <div className="text-sm text-gray-600">Pending Payments</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>All payment transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.orderId}</TableCell>
                    <TableCell>{payment.patientName}</TableCell>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell>₹{payment.amount.toLocaleString('en-IN')}</TableCell>
                    <TableCell>
                      <Badge className={
                        payment.status === 'SUCCESS' ? 'bg-green-100 text-green-700' :
                        payment.status === 'REFUNDED' ? 'bg-gray-100 text-gray-700' :
                        'bg-yellow-100 text-yellow-700'
                      }>
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-gray-600">
                      {payment.paymentId || '-'}
                    </TableCell>
                    <TableCell>
                      {payment.status === 'SUCCESS' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadReceipt(payment.id)}
                        >
                          <Download className="size-4 mr-2" />
                          Receipt
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Payment Info */}
      <Card className="bg-orange-50 border-orange-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <CreditCard className="size-8 text-orange-600 flex-shrink-0" />
            <div>
              <h3 className="mb-2">Razorpay Payment Integration</h3>
              <p className="text-sm text-gray-700 mb-2">
                All payments are processed securely through Razorpay. Customers can pay using 
                credit/debit cards, UPI, net banking, and digital wallets.
              </p>
              <p className="text-sm text-gray-700">
                Revenue is automatically calculated from successful transactions and can be 
                withdrawn to your registered bank account.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
