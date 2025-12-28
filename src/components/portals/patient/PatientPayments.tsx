import { CreditCard, Download, RefreshCw, Check, X, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { toast } from 'sonner@2.0.3';
import { useState } from 'react';

interface PatientPaymentsProps {
  user: any;
}

const payments = [
  {
    id: 1,
    billId: 'BILL-2024-001',
    razorpayOrderId: 'order_M3K8hL9Qz2P4F1',
    razorpayPaymentId: 'pay_N5J9kM2Rz3Q5G2',
    purpose: 'APPOINTMENT',
    description: 'Consultation - Dr. Sarah Johnson',
    amount: 500,
    currency: 'INR',
    status: 'SUCCESS',
    paymentMethod: 'Card',
    date: '2025-11-20 10:30 AM',
    expiresAt: null
  },
  {
    id: 2,
    billId: 'BILL-2024-002',
    razorpayOrderId: 'order_N4L9iM3Sz4R6H3',
    razorpayPaymentId: 'pay_O6K0lN4Tz5S7I4',
    purpose: 'MEDICINE_ORDER',
    description: 'Medicine Order #1234',
    amount: 1250,
    currency: 'INR',
    status: 'SUCCESS',
    paymentMethod: 'UPI',
    date: '2025-11-19 02:15 PM',
    expiresAt: null
  },
  {
    id: 3,
    billId: 'BILL-2024-003',
    razorpayOrderId: 'order_O5M0jN4Tz5S7I4',
    razorpayPaymentId: 'pay_P7L1mO5Uz6T8J5',
    purpose: 'TEST',
    description: 'Blood Test - MediScan Diagnostics',
    amount: 800,
    currency: 'INR',
    status: 'SUCCESS',
    paymentMethod: 'Net Banking',
    date: '2025-11-18 09:00 AM',
    expiresAt: null
  },
  {
    id: 4,
    billId: 'BILL-2024-004',
    razorpayOrderId: 'order_P6N1kO5Uz6T8J5',
    razorpayPaymentId: null,
    purpose: 'APPOINTMENT',
    description: 'Consultation - Dr. David Miller',
    amount: 600,
    currency: 'INR',
    status: 'FAILED',
    paymentMethod: null,
    date: '2025-11-17 03:30 PM',
    expiresAt: '2025-11-17 04:00 PM'
  },
  {
    id: 5,
    billId: 'BILL-2024-005',
    razorpayOrderId: 'order_Q7O2lP6Vz7U9K6',
    razorpayPaymentId: null,
    purpose: 'MEDICINE_ORDER',
    description: 'Medicine Order #1235',
    amount: 950,
    currency: 'INR',
    status: 'PENDING',
    paymentMethod: null,
    date: '2025-11-21 05:00 PM',
    expiresAt: '2025-11-21 05:30 PM'
  }
];

export default function PatientPayments({ user }: PatientPaymentsProps) {
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPurpose, setFilterPurpose] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPayments = payments.filter(payment => {
    const matchesStatus = !filterStatus || payment.status === filterStatus;
    const matchesPurpose = !filterPurpose || payment.purpose === filterPurpose;
    const matchesSearch = !searchTerm ||
      payment.billId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesPurpose && matchesSearch;
  });

  const totalAmount = payments
    .filter(p => p.status === 'SUCCESS')
    .reduce((sum, p) => sum + p.amount, 0);

  const handleRetryPayment = (billId: string) => {
    toast.info('Redirecting to payment gateway...');
    // In production, create new Razorpay order for same bill
  };

  const handleDownloadReceipt = (billId: string) => {
    toast.success(`Downloading receipt for ${billId}`);
  };

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'SUCCESS':
        return <Check className="size-5 text-green-600" />;
      case 'FAILED':
        return <X className="size-5 text-red-600" />;
      case 'PENDING':
        return <Clock className="size-5 text-yellow-600" />;
      default:
        return <Clock className="size-5 text-gray-600" />;
    }
  };

  const statusColor = {
    SUCCESS: 'bg-green-100 text-green-700',
    FAILED: 'bg-red-100 text-red-700',
    PENDING: 'bg-yellow-100 text-yellow-700',
    TIMEOUT: 'bg-gray-100 text-gray-700'
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Payments & Status</h1>
        <p className="text-gray-600">View your payment history and transaction status</p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl mb-1">₹{totalAmount.toLocaleString('en-IN')}</div>
            <div className="text-sm text-gray-600">Total Paid</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl mb-1">{payments.filter(p => p.status === 'SUCCESS').length}</div>
            <div className="text-sm text-gray-600">Successful</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl mb-1">{payments.filter(p => p.status === 'PENDING').length}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl mb-1">{payments.filter(p => p.status === 'FAILED').length}</div>
            <div className="text-sm text-gray-600">Failed</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-3 gap-4">
            <Input
              placeholder="Search by Bill ID or Description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="SUCCESS">Success</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPurpose} onValueChange={setFilterPurpose}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Purpose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Purposes</SelectItem>
                <SelectItem value="APPOINTMENT">Appointments</SelectItem>
                <SelectItem value="TEST">Diagnostic Tests</SelectItem>
                <SelectItem value="MEDICINE_ORDER">Medicine Orders</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>All your payment transactions with Razorpay</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bill ID</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div>
                        <div className="mb-1">{payment.billId}</div>
                        {payment.razorpayOrderId && (
                          <div className="text-xs text-gray-500">
                            Order: {payment.razorpayOrderId}
                          </div>
                        )}
                        {payment.razorpayPaymentId && (
                          <div className="text-xs text-gray-500">
                            Payment: {payment.razorpayPaymentId}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div>{payment.description}</div>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {payment.purpose.replace('_', ' ')}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-lg">₹{payment.amount.toLocaleString('en-IN')}</div>
                      <div className="text-xs text-gray-500">{payment.currency}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <StatusIcon status={payment.status} />
                        <Badge className={statusColor[payment.status as keyof typeof statusColor]}>
                          {payment.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {payment.paymentMethod || '-'}
                    </TableCell>
                    <TableCell>
                      <div>{payment.date}</div>
                      {payment.expiresAt && payment.status === 'PENDING' && (
                        <div className="text-xs text-red-600 mt-1">
                          Expires: {payment.expiresAt}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {payment.status === 'SUCCESS' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownloadReceipt(payment.billId)}
                          >
                            <Download className="size-4" />
                          </Button>
                        )}
                        {(payment.status === 'FAILED' || payment.status === 'PENDING') && (
                          <Button
                            size="sm"
                            onClick={() => handleRetryPayment(payment.billId)}
                          >
                            <RefreshCw className="size-4 mr-2" />
                            Retry
                          </Button>
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

      {/* Payment Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <CreditCard className="size-8 text-blue-600 flex-shrink-0" />
            <div>
              <h3 className="mb-2">Secure Payments with Razorpay</h3>
              <p className="text-sm text-gray-700 mb-2">
                All payments are processed securely through Razorpay. We support credit/debit cards, 
                UPI, net banking, and digital wallets.
              </p>
              <p className="text-sm text-gray-700">
                Failed or expired payments can be retried. Successful payments are verified via webhook 
                for maximum security.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}