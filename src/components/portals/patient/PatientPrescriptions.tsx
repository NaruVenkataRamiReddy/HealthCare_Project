import { FileText, Download, Eye, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { toast } from 'sonner@2.0.3';

interface PatientPrescriptionsProps {
  user: any;
}

const prescriptions = [
  {
    id: 1,
    doctor: 'Dr. Sarah Johnson',
    date: '2025-11-20',
    medicines: ['Aspirin 75mg', 'Atorvastatin 10mg', 'Metoprolol 50mg'],
    diagnosis: 'Hypertension management',
    notes: 'Take medicines after meals. Follow up in 2 weeks.'
  },
  {
    id: 2,
    doctor: 'Dr. Michael Chen',
    date: '2025-11-15',
    medicines: ['Amoxicillin 500mg', 'Paracetamol 650mg'],
    diagnosis: 'Upper respiratory tract infection',
    notes: 'Complete the full course. Rest advised.'
  },
  {
    id: 3,
    doctor: 'Dr. Emily Rodriguez',
    date: '2025-11-10',
    medicines: ['Hydrocortisone cream', 'Antihistamine tablets'],
    diagnosis: 'Allergic dermatitis',
    notes: 'Apply cream twice daily. Avoid allergens.'
  }
];

export default function PatientPrescriptions({ user }: PatientPrescriptionsProps) {
  const handleDownload = (id: number) => {
    toast.success('Downloading prescription...');
  };

  const handleView = (id: number) => {
    toast.info('Opening prescription viewer...');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">My Prescriptions</h1>
        <p className="text-gray-600">Access all your medical prescriptions</p>
      </div>

      <div className="space-y-4">
        {prescriptions.map((prescription) => (
          <Card key={prescription.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{prescription.doctor}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                    <Calendar className="size-4" />
                    <span>{prescription.date}</span>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-700">Active</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-gray-600 mb-2">Diagnosis:</div>
                <div>{prescription.diagnosis}</div>
              </div>

              <div>
                <div className="text-sm text-gray-600 mb-2">Prescribed Medicines:</div>
                <div className="space-y-2">
                  {prescription.medicines.map((medicine, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <FileText className="size-4 text-gray-600" />
                      <span>{medicine}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Doctor's Notes:</div>
                <div className="text-sm">{prescription.notes}</div>
              </div>

              <div className="flex gap-3">
                <Button size="sm" variant="outline" onClick={() => handleView(prescription.id)}>
                  <Eye className="size-4 mr-2" />
                  View
                </Button>
                <Button size="sm" onClick={() => handleDownload(prescription.id)}>
                  <Download className="size-4 mr-2" />
                  Download PDF
                </Button>
                <Button size="sm" variant="outline">
                  Order Medicines
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
