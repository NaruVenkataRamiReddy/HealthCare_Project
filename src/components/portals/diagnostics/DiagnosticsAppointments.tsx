import { Calendar, Search, Filter, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { useState } from 'react';
import { toast } from 'sonner@2.0.3';

interface DiagnosticsAppointmentsProps {
  user: any;
}

const appointments = [
  {
    id: 1,
    patientName: 'John Doe',
    patientPhone: '+91-9876543210',
    testName: 'Blood Test (Complete)',
    date: '2025-11-26',
    time: '09:00 AM',
    status: 'CONFIRMED',
    amount: 800,
    paymentStatus: 'PAID'
  },
  {
    id: 2,
    patientName: 'Jane Smith',
    patientPhone: '+91-9876543211',
    testName: 'X-Ray Chest',
    date: '2025-11-26',
    time: '10:30 AM',
    status: 'IN_PROGRESS',
    amount: 600,
    paymentStatus: 'PAID'
  },
  {
    id: 3,
    patientName: 'Mike Johnson',
    patientPhone: '+91-9876543212',
    testName: 'ECG',
    date: '2025-11-26',
    time: '11:00 AM',
    status: 'PENDING',
    amount: 500,
    paymentStatus: 'PENDING'
  },
  {
    id: 4,
    patientName: 'Sarah Williams',
    patientPhone: '+91-9876543213',
    testName: 'Full Body Checkup Package',
    date: '2025-11-27',
    time: '02:00 PM',
    status: 'CONFIRMED',
    amount: 3500,
    paymentStatus: 'PAID'
  },
  {
    id: 5,
    patientName: 'David Brown',
    patientPhone: '+91-9876543214',
    testName: 'Ultrasound Abdomen',
    date: '2025-11-27',
    time: '03:30 PM',
    status: 'COMPLETED',
    amount: 1200,
    paymentStatus: 'PAID'
  }
];

export default function DiagnosticsAppointments({ user }: DiagnosticsAppointmentsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = !searchTerm || 
      apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.testName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || apt.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (id: number, newStatus: string) => {
    toast.success(`Appointment #${id} status updated to ${newStatus}`);
  };

  const handleUploadReport = (id: number) => {
    toast.info('Report upload functionality will be implemented with backend');
  };

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="size-5 text-green-600" />;
      case 'IN_PROGRESS':
        return <Clock className="size-5 text-blue-600" />;
      case 'CONFIRMED':
        return <CheckCircle className="size-5 text-purple-600" />;
      case 'CANCELLED':
        return <XCircle className="size-5 text-red-600" />;
      default:
        return <Clock className="size-5 text-yellow-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Test Appointments</h1>
        <p className="text-gray-600">Manage your diagnostic test bookings</p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl mb-1">{appointments.filter(a => a.status === 'CONFIRMED').length}</div>
            <div className="text-sm text-gray-600">Confirmed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl mb-1">{appointments.filter(a => a.status === 'IN_PROGRESS').length}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl mb-1">{appointments.filter(a => a.status === 'COMPLETED').length}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl mb-1">{appointments.filter(a => a.status === 'PENDING').length}</div>
            <div className="text-sm text-gray-600">Pending</div>
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
                placeholder="Search by patient name or test..."
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
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Appointments Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Appointments</CardTitle>
          <CardDescription>Complete list of test bookings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Test Name</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((apt) => (
                  <TableRow key={apt.id}>
                    <TableCell>
                      <div>
                        <div className="mb-1">{apt.patientName}</div>
                        <div className="text-xs text-gray-500">{apt.patientPhone}</div>
                      </div>
                    </TableCell>
                    <TableCell>{apt.testName}</TableCell>
                    <TableCell>
                      <div>
                        <div>{apt.date}</div>
                        <div className="text-sm text-gray-600">{apt.time}</div>
                      </div>
                    </TableCell>
                    <TableCell>₹{apt.amount.toLocaleString('en-IN')}</TableCell>
                    <TableCell>
                      <Badge className={apt.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                        {apt.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <StatusIcon status={apt.status} />
                        <Badge className={
                          apt.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                          apt.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                          apt.status === 'CONFIRMED' ? 'bg-purple-100 text-purple-700' :
                          'bg-yellow-100 text-yellow-700'
                        }>
                          {apt.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {apt.status === 'COMPLETED' && (
                          <Button size="sm" variant="outline" onClick={() => handleUploadReport(apt.id)}>
                            Upload Report
                          </Button>
                        )}
                        {apt.status !== 'COMPLETED' && (
                          <Select onValueChange={(value) => handleUpdateStatus(apt.id, value)}>
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Update" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="CONFIRMED">Confirm</SelectItem>
                              <SelectItem value="IN_PROGRESS">Start Test</SelectItem>
                              <SelectItem value="COMPLETED">Complete</SelectItem>
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
