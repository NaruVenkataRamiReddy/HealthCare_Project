import { useState } from 'react';
import { Search, MapPin, Star, Calendar, Clock, CreditCard } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Textarea } from '../../ui/textarea';
import { Badge } from '../../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../ui/dialog';
import { toast } from 'sonner@2.0.3';

interface BookAppointmentProps {
  user: any;
}

// Mock doctors data
const doctors = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialization: 'Cardiologist',
    qualifications: 'MBBS, MD Cardiology',
    rating: 4.8,
    reviews: 156,
    experience: '15 years',
    fee: 50,
    distance: '2.3 km',
    available: true,
    nextSlot: '2025-11-23 10:00 AM'
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    specialization: 'General Physician',
    qualifications: 'MBBS, MD Medicine',
    rating: 4.9,
    reviews: 203,
    experience: '12 years',
    fee: 40,
    distance: '1.5 km',
    available: true,
    nextSlot: '2025-11-22 02:30 PM'
  },
  {
    id: 3,
    name: 'Dr. Emily Rodriguez',
    specialization: 'Dermatologist',
    qualifications: 'MBBS, MD Dermatology',
    rating: 4.7,
    reviews: 189,
    experience: '10 years',
    fee: 45,
    distance: '3.1 km',
    available: true,
    nextSlot: '2025-11-24 11:00 AM'
  },
  {
    id: 4,
    name: 'Dr. David Miller',
    specialization: 'Pediatrician',
    qualifications: 'MBBS, MD Pediatrics',
    rating: 4.9,
    reviews: 245,
    experience: '18 years',
    fee: 55,
    distance: '2.8 km',
    available: true,
    nextSlot: '2025-11-23 09:00 AM'
  }
];

export default function BookAppointment({ user }: BookAppointmentProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [symptoms, setSymptoms] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpec = !specialization || doctor.specialization === specialization;
    return matchesSearch && matchesSpec;
  });

  const handleBooking = (doctor: any) => {
    setSelectedDoctor(doctor);
    setBookingOpen(true);
  };

  const handlePayment = async () => {
    if (!symptoms || !appointmentDate || !appointmentTime) {
      toast.error('Please fill all required fields');
      return;
    }

    setPaymentLoading(true);

    // Simulate payment API call - In production, this would call your backend
    // Backend would create Razorpay order and return order details
    setTimeout(() => {
      // Mock Razorpay order data
      const mockOrderData = {
        billId: `BILL-${Date.now()}`,
        razorpay_order_id: `order_${Math.random().toString(36).substr(2, 9)}`,
        razorpay_key_id: 'rzp_test_XXXXXXXXXX',
        amount: selectedDoctor.fee * 100, // Convert to paise
        currency: 'INR'
      };

      // Initialize Razorpay Checkout
      const options = {
        key: mockOrderData.razorpay_key_id,
        amount: mockOrderData.amount,
        currency: mockOrderData.currency,
        name: 'HealthCare+',
        description: `Appointment with ${selectedDoctor.name}`,
        order_id: mockOrderData.razorpay_order_id,
        notes: {
          billId: mockOrderData.billId
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone
        },
        theme: {
          color: '#2563eb'
        },
        handler: function (response: any) {
          // Payment successful
          toast.success('Appointment booked successfully!');
          setBookingOpen(false);
          setPaymentLoading(false);
          setSymptoms('');
          setAppointmentDate('');
          setAppointmentTime('');
          
          // In production, verify payment on backend with webhook
          console.log('Payment response:', response);
        },
        modal: {
          ondismiss: function() {
            setPaymentLoading(false);
            toast.error('Payment cancelled');
          }
        }
      };

      // Mock Razorpay checkout (in production, load Razorpay SDK)
      toast.info('Opening payment gateway...');
      
      // Simulate successful payment for demo
      setTimeout(() => {
        toast.success('Payment successful! Appointment booked.');
        setBookingOpen(false);
        setPaymentLoading(false);
      }, 2000);

    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Book Appointment</h1>
        <p className="text-gray-600">Find and book appointments with certified doctors near you</p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="search">Search Doctor or Specialization</Label>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-3 size-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by name or specialization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="specialization">Specialization</Label>
              <Select value={specialization} onValueChange={setSpecialization}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="All Specializations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Specializations</SelectItem>
                  <SelectItem value="Cardiologist">Cardiologist</SelectItem>
                  <SelectItem value="General Physician">General Physician</SelectItem>
                  <SelectItem value="Dermatologist">Dermatologist</SelectItem>
                  <SelectItem value="Pediatrician">Pediatrician</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Doctors List */}
      <div className="grid gap-6">
        {filteredDoctors.map((doctor) => (
          <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl text-blue-600">
                    {doctor.name.split(' ')[1][0]}
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="text-xl mb-1">{doctor.name}</h3>
                      <p className="text-gray-600 mb-1">{doctor.specialization}</p>
                      <p className="text-sm text-gray-500">{doctor.qualifications}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl mb-1">${doctor.fee}</div>
                      <div className="text-sm text-gray-600">Consultation Fee</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="size-4 fill-yellow-400 text-yellow-400" />
                      <span>{doctor.rating}</span>
                      <span className="text-gray-500">({doctor.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Calendar className="size-4" />
                      <span>{doctor.experience} experience</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <MapPin className="size-4" />
                      <span>{doctor.distance} away</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    {doctor.available && (
                      <Badge className="bg-green-100 text-green-700">
                        Next available: {doctor.nextSlot}
                      </Badge>
                    )}
                    <Button onClick={() => handleBooking(doctor)}>
                      Book Appointment
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Booking Dialog */}
      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Book Appointment with {selectedDoctor?.name}</DialogTitle>
            <DialogDescription>
              Fill in the details to schedule your consultation
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Appointment Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Appointment Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="symptoms">Symptoms / Reason for Visit *</Label>
              <Textarea
                id="symptoms"
                placeholder="Describe your symptoms or reason for consultation..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                rows={4}
                required
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700">Consultation Fee:</span>
                <span className="text-xl">${selectedDoctor?.fee}</span>
              </div>
              <div className="text-sm text-gray-600">
                Payment will be processed securely through Razorpay
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setBookingOpen(false)}
                disabled={paymentLoading}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handlePayment}
                disabled={paymentLoading}
              >
                <CreditCard className="size-4 mr-2" />
                {paymentLoading ? 'Processing...' : 'Pay & Book'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
