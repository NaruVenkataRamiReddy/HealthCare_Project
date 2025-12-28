import { Calendar, FileText, ShoppingCart, CreditCard, Activity, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Link } from 'react-router-dom';

interface PatientDashboardProps {
  user: any;
}

export default function PatientDashboard({ user }: PatientDashboardProps) {
  // Mock data
  const stats = [
    { label: 'Upcoming Appointments', value: '2', icon: Calendar, color: 'blue' },
    { label: 'Active Prescriptions', value: '3', icon: FileText, color: 'green' },
    { label: 'Pending Orders', value: '1', icon: ShoppingCart, color: 'orange' },
    { label: 'Total Spent', value: '₹3,550', icon: CreditCard, color: 'purple' },
  ];

  const upcomingAppointments = [
    {
      id: 1,
      doctor: 'Dr. Sarah Johnson',
      specialization: 'Cardiologist',
      date: '2025-11-23',
      time: '10:00 AM',
      status: 'CONFIRMED'
    },
    {
      id: 2,
      doctor: 'Dr. Michael Chen',
      specialization: 'General Physician',
      date: '2025-11-25',
      time: '02:30 PM',
      status: 'CONFIRMED'
    }
  ];

  const recentActivity = [
    { id: 1, action: 'Prescription uploaded', detail: 'Dr. Sarah Johnson', time: '2 hours ago' },
    { id: 2, action: 'Payment successful', detail: 'Appointment booking - ₹500', time: '1 day ago' },
    { id: 3, action: 'Medicine order delivered', detail: 'Order #1234', time: '2 days ago' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Welcome back, {user.name}!</h1>
        <p className="text-gray-600">Here's an overview of your health dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'bg-blue-100 text-blue-600',
            green: 'bg-green-100 text-green-600',
            orange: 'bg-orange-100 text-orange-600',
            purple: 'bg-purple-100 text-purple-600',
          }[stat.color];

          return (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClasses}`}>
                    <Icon className="size-6" />
                  </div>
                  <div className="text-3xl">{stat.value}</div>
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Your scheduled consultations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingAppointments.map((apt) => (
              <div key={apt.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Calendar className="size-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="mb-1">{apt.doctor}</div>
                  <div className="text-sm text-gray-600 mb-2">{apt.specialization}</div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600">{apt.date}</span>
                    <span className="text-gray-600">{apt.time}</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                      {apt.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <Link to="/patient/book-appointment">
              <Button className="w-full" variant="outline">
                Book New Appointment
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <Activity className="size-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="mb-1">{activity.action}</div>
                  <div className="text-sm text-gray-600 mb-1">{activity.detail}</div>
                  <div className="text-xs text-gray-500">{activity.time}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <Link to="/patient/book-appointment">
              <Button className="w-full" variant="outline">
                <Calendar className="size-4 mr-2" />
                Book Appointment
              </Button>
            </Link>
            <Link to="/patient/order-medicines">
              <Button className="w-full" variant="outline">
                <ShoppingCart className="size-4 mr-2" />
                Order Medicines
              </Button>
            </Link>
            <Link to="/patient/prescriptions">
              <Button className="w-full" variant="outline">
                <FileText className="size-4 mr-2" />
                View Prescriptions
              </Button>
            </Link>
            <Link to="/patient/payments">
              <Button className="w-full" variant="outline">
                <CreditCard className="size-4 mr-2" />
                Payment History
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}