import { Calendar, Clock, MapPin, FileText, Video, XCircle } from 'lucide-react';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { toast } from 'sonner@2.0.3';

interface PatientAppointmentsProps {
  user: any;
}

const appointments = [
  {
    id: 1,
    doctor: 'Dr. Sarah Johnson',
    specialization: 'Cardiologist',
    date: '2025-11-23',
    time: '10:00 AM',
    status: 'CONFIRMED',
    symptoms: 'Chest pain and irregular heartbeat',
    fee: 50,
    paymentStatus: 'SUCCESS'
  },
  {
    id: 2,
    doctor: 'Dr. Michael Chen',
    specialization: 'General Physician',
    date: '2025-11-25',
    time: '02:30 PM',
    status: 'CONFIRMED',
    symptoms: 'Fever and cough for 3 days',
    fee: 40,
    paymentStatus: 'SUCCESS'
  },
  {
    id: 3,
    doctor: 'Dr. Emily Rodriguez',
    specialization: 'Dermatologist',
    date: '2025-11-20',
    time: '11:00 AM',
    status: 'COMPLETED',
    symptoms: 'Skin rash on arms',
    fee: 45,
    paymentStatus: 'SUCCESS'
  },
  {
    id: 4,
    doctor: 'Dr. David Miller',
    specialization: 'Pediatrician',
    date: '2025-11-18',
    time: '09:00 AM',
    status: 'CANCELLED',
    symptoms: 'Regular checkup',
    fee: 55,
    paymentStatus: 'FAILED'
  }
];

export default function PatientAppointments({ user }: PatientAppointmentsProps) {
  const handleCancelAppointment = (id: number) => {
    toast.success('Appointment cancelled successfully');
  };

  const handleReschedule = (id: number) => {
    toast.info('Reschedule feature coming soon');
  };

  const statusColor = {
    CONFIRMED: 'bg-green-100 text-green-700',
    COMPLETED: 'bg-blue-100 text-blue-700',
    CANCELLED: 'bg-red-100 text-red-700',
    REQUESTED: 'bg-yellow-100 text-yellow-700'
  };

  const upcomingAppointments = appointments.filter(a => a.status === 'CONFIRMED');
  const pastAppointments = appointments.filter(a => a.status === 'COMPLETED' || a.status === 'CANCELLED');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">My Appointments</h1>
        <p className="text-gray-600">Manage your scheduled and past appointments</p>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({upcomingAppointments.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({pastAppointments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4 mt-6">
          {upcomingAppointments.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <Calendar className="size-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No upcoming appointments</p>
                <Button>Book New Appointment</Button>
              </CardContent>
            </Card>
          ) : (
            upcomingAppointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Calendar className="size-8 text-blue-600" />
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                        <div>
                          <h3 className="text-xl mb-1">{appointment.doctor}</h3>
                          <p className="text-gray-600">{appointment.specialization}</p>
                        </div>
                        <Badge className={statusColor[appointment.status as keyof typeof statusColor]}>
                          {appointment.status}
                        </Badge>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="size-4" />
                          <span>{appointment.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="size-4" />
                          <span>{appointment.time}</span>
                        </div>
                      </div>

                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Symptoms:</div>
                        <div className="text-gray-900">{appointment.symptoms}</div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Button size="sm" onClick={() => handleReschedule(appointment.id)}>
                          Reschedule
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCancelAppointment(appointment.id)}
                        >
                          <XCircle className="size-4 mr-2" />
                          Cancel
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="size-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4 mt-6">
          {pastAppointments.map((appointment) => (
            <Card key={appointment.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="size-8 text-gray-600" />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="text-xl mb-1">{appointment.doctor}</h3>
                        <p className="text-gray-600">{appointment.specialization}</p>
                      </div>
                      <Badge className={statusColor[appointment.status as keyof typeof statusColor]}>
                        {appointment.status}
                      </Badge>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="size-4" />
                        <span>{appointment.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="size-4" />
                        <span>{appointment.time}</span>
                      </div>
                    </div>

                    {appointment.status === 'COMPLETED' && (
                      <div className="flex flex-wrap gap-3">
                        <Button size="sm" variant="outline">
                          <FileText className="size-4 mr-2" />
                          View Prescription
                        </Button>
                        <Button size="sm" variant="outline">
                          <Video className="size-4 mr-2" />
                          Watch Consultation
                        </Button>
                        <Button size="sm" variant="outline">
                          Book Again
                        </Button>
                      </div>
                    )}

                    {appointment.status === 'CANCELLED' && (
                      <div className="text-sm text-red-600">
                        Appointment was cancelled. Refund processed.
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
