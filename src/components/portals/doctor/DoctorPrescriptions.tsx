import { useState } from 'react';
import { FileText, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { toast } from 'sonner@2.0.3';

interface DoctorPrescriptionsProps {
  user: any;
}

const recentPatients = [
  { id: 1, name: 'John Doe', appointmentId: 101 },
  { id: 2, name: 'Jane Smith', appointmentId: 102 },
  { id: 3, name: 'Mike Johnson', appointmentId: 103 }
];

export default function DoctorPrescriptions({ user }: DoctorPrescriptionsProps) {
  const [selectedPatient, setSelectedPatient] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [medicines, setMedicines] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!selectedPatient || !diagnosis || !medicines) {
      toast.error('Please fill all required fields');
      return;
    }

    toast.success('Prescription sent to patient successfully!');
    setSelectedPatient('');
    setDiagnosis('');
    setMedicines('');
    setNotes('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Prescriptions</h1>
        <p className="text-gray-600">Create and manage patient prescriptions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Write Prescription</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patient">Select Patient *</Label>
            <Select value={selectedPatient} onValueChange={setSelectedPatient}>
              <SelectTrigger>
                <SelectValue placeholder="Choose patient..." />
              </SelectTrigger>
              <SelectContent>
                {recentPatients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id.toString()}>
                    {patient.name} - Appointment #{patient.appointmentId}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="diagnosis">Diagnosis *</Label>
            <Input
              id="diagnosis"
              placeholder="e.g., Hypertension, Type 2 Diabetes"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medicines">Prescribed Medicines *</Label>
            <Textarea
              id="medicines"
              placeholder="Enter medicines with dosage:&#10;1. Aspirin 75mg - 1 tablet daily&#10;2. Atorvastatin 10mg - 1 tablet at night"
              value={medicines}
              onChange={(e) => setMedicines(e.target.value)}
              rows={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Special instructions, diet recommendations, follow-up schedule..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>

          <Button onClick={handleSubmit} className="w-full">
            <Send className="size-4 mr-2" />
            Send Prescription to Patient
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Prescriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <FileText className="size-12 text-gray-300 mx-auto mb-4" />
            <p>No prescriptions created yet</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
