import { Calendar, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { toast } from 'sonner@2.0.3';

interface DoctorAppointmentsProps {
  user: any;
}

const appointments = [
  { id: 1, patient: 'John Doe', date: '2025-11-22', time: '10:00 AM', symptoms: 'Chest pain and irregular heartbeat', status: 'CONFIRMED', paymentStatus: 'SUCCESS' },
  { id: 2, patient: 'Jane Smith', date: '2025-11-22', time: '11:00 AM', symptoms: 'Regular checkup', status: 'CONFIRMED', paymentStatus: 'SUCCESS' },
  { id: 3, patient: 'Mike Johnson', date: '2025-11-23', time: '02:00 PM', symptoms: 'Hypertension follow-up', status: 'REQUESTED', paymentStatus: 'PENDING' }
];

export default function DoctorAppointments({ user }: DoctorAppointmentsProps) {
  const handleConfirm = (id: number) => {
    toast.success('Appointment confirmed');
  };

  const handleComplete = (id: number) => {
    toast.success('Appointment marked as completed');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Appointments</h1>
        <p className="text-gray-600">Manage your patient appointments</p>
      </div>

      <div className="space-y-4">
        {appointments.map((apt) => (
          <Card key={apt.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl mb-1">{apt.patient}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{apt.date}</span>
                    <span>{apt.time}</span>
                  </div>
                </div>
                <Badge className={apt.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                  {apt.status}
                </Badge>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg mb-4">
                <div className="text-sm text-gray-600 mb-1">Patient Symptoms:</div>
                <div>{apt.symptoms}</div>
              </div>

              <div className="flex gap-3">
                {apt.status === 'REQUESTED' && (
                  <Button size="sm" onClick={() => handleConfirm(apt.id)}>
                    <CheckCircle className="size-4 mr-2" />
                    Confirm
                  </Button>
                )}
                {apt.status === 'CONFIRMED' && (
                  <Button size="sm" onClick={() => handleComplete(apt.id)}>
                    Complete Consultation
                  </Button>
                )}
                <Button size="sm" variant="outline">View Details</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
