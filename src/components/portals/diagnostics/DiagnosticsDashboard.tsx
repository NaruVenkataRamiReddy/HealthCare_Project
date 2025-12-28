import { Calendar, Package, Users, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';

interface DiagnosticsDashboardProps {
  user: any;
}

export default function DiagnosticsDashboard({ user }: DiagnosticsDashboardProps) {
  const stats = [
    { label: 'Today\'s Tests', value: '12', icon: Calendar, color: 'blue' },
    { label: 'Active Packages', value: '8', icon: Package, color: 'green' },
    { label: 'Total Patients', value: '245', icon: Users, color: 'purple' },
    { label: 'This Month Revenue', value: '₹85,000', icon: CreditCard, color: 'orange' },
  ];

  const todayTests = [
    { id: 1, patient: 'John Doe', testName: 'Blood Test', time: '09:00 AM', status: 'COMPLETED' },
    { id: 2, patient: 'Jane Smith', testName: 'X-Ray Chest', time: '10:30 AM', status: 'IN_PROGRESS' },
    { id: 3, patient: 'Mike Johnson', testName: 'ECG', time: '11:00 AM', status: 'PENDING' },
    { id: 4, patient: 'Sarah Williams', testName: 'Full Body Checkup', time: '02:00 PM', status: 'CONFIRMED' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Welcome, {user.centreName}!</h1>
        <p className="text-gray-600">Here's your diagnostic centre overview</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <Icon className="size-8 text-purple-600" />
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
          <CardTitle>Today's Scheduled Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {todayTests.map((test) => (
              <div key={test.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="mb-1">{test.patient}</div>
                  <div className="text-sm text-gray-600">{test.testName}</div>
                </div>
                <div className="text-right">
                  <div className="mb-2">{test.time}</div>
                  <Badge className={
                    test.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                    test.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                    test.status === 'CONFIRMED' ? 'bg-purple-100 text-purple-700' :
                    'bg-yellow-100 text-yellow-700'
                  }>
                    {test.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
