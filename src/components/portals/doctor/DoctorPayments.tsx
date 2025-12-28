import { CreditCard, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';

interface DoctorPaymentsProps {
  user: any;
}

const earnings = [
  { id: 1, patient: 'John Doe', date: '2025-11-20', amount: 500, status: 'SUCCESS', razorpayId: 'pay_N5J9kM2Rz3Q5G2' },
  { id: 2, patient: 'Jane Smith', date: '2025-11-21', amount: 500, status: 'SUCCESS', razorpayId: 'pay_O6K0lN4Tz5S7I4' },
  { id: 3, patient: 'Mike Johnson', date: '2025-11-22', amount: 500, status: 'PENDING', razorpayId: null }
];

export default function DoctorPayments({ user }: DoctorPaymentsProps) {
  const totalEarnings = earnings.filter(e => e.status === 'SUCCESS').reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Payments & Earnings</h1>
        <p className="text-gray-600">Track your consultation fees and earnings</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <CreditCard className="size-8 text-blue-600" />
              <div className="text-3xl">₹{totalEarnings.toLocaleString('en-IN')}</div>
            </div>
            <div className="text-sm text-gray-600">Total Earnings</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="size-8 text-green-600" />
              <div className="text-3xl">{earnings.filter(e => e.status === 'SUCCESS').length}</div>
            </div>
            <div className="text-sm text-gray-600">Completed Payments</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <CreditCard className="size-8 text-yellow-600" />
              <div className="text-3xl">{earnings.filter(e => e.status === 'PENDING').length}</div>
            </div>
            <div className="text-sm text-gray-600">Pending Payments</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {earnings.map((earning) => (
                <TableRow key={earning.id}>
                  <TableCell>{earning.patient}</TableCell>
                  <TableCell>{earning.date}</TableCell>
                  <TableCell>₹{earning.amount.toLocaleString('en-IN')}</TableCell>
                  <TableCell>
                    <Badge className={earning.status === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                      {earning.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-gray-600">
                    {earning.razorpayId || '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}