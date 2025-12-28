import { Calendar, Users, CreditCard, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';

interface DoctorDashboardProps {
  user: any;
}

export default function DoctorDashboard({ user }: DoctorDashboardProps) {
  const stats = [
    { label: 'Today\'s Appointments', value: '8', icon: Calendar, color: 'blue' },
    { label: 'Total Patients', value: '156', icon: Users, color: 'green' },
    { label: 'This Month Earnings', value: '₹42,500', icon: CreditCard, color: 'purple' },
    { label: 'Rating', value: '4.8', icon: TrendingUp, color: 'yellow' },
  ];

  const todayAppointments = [
    { id: 1, patient: 'John Doe', time: '10:00 AM', symptoms: 'Chest pain', status: 'CONFIRMED' },
    { id: 2, patient: 'Jane Smith', time: '11:00 AM', symptoms: 'Regular checkup', status: 'CONFIRMED' },
    { id: 3, patient: 'Mike Johnson', time: '02:00 PM', symptoms: 'Hypertension follow-up', status: 'PENDING' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Welcome, {user.name}!</h1>
        <p className="text-gray-600">Here's your practice overview</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <Icon className="size-8 text-blue-600" />
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
          <CardTitle>Today's Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {todayAppointments.map((apt) => (
              <div key={apt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="mb-1">{apt.patient}</div>
                  <div className="text-sm text-gray-600">{apt.symptoms}</div>
                </div>
                <div className="text-right">
                  <div className="mb-2">{apt.time}</div>
                  <Badge className={apt.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                    {apt.status}
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