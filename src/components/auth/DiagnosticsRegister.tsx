import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner@2.0.3';

interface DiagnosticsRegisterProps {
  onRegister: (user: any) => void;
}

export default function DiagnosticsRegister({ onRegister }: DiagnosticsRegisterProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    centreName: '',
    centreAddress: '',
    operatorName: '',
    age: '',
    gender: '',
    phone: '',
    email: '',
    qualifications: '',
    password: '',
    confirmPassword: ''
  });
  const [certificate, setCertificate] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!certificate) {
      toast.error('Please upload center certificate');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const newUser = {
        id: Date.now(),
        role: 'DIAGNOSTICS' as const,
        name: formData.centreName,
        centreName: formData.centreName,
        operatorName: formData.operatorName,
        email: formData.email,
        phone: formData.phone,
        address: formData.centreAddress
      };

      onRegister(newUser);
      toast.success('Registration successful!');
      navigate('/diagnostics/dashboard');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <Link to="/professional" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6">
          <ArrowLeft className="size-4" />
          Back
        </Link>

        <Card>
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <Activity className="size-8 text-purple-600" />
              </div>
            </div>
            <CardTitle className="text-center text-2xl">Diagnostics Center Registration</CardTitle>
            <CardDescription className="text-center">
              Register your diagnostic center with HealthCare+
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="centreName">Center Name *</Label>
                  <Input
                    id="centreName"
                    name="centreName"
                    placeholder="MediScan Diagnostics"
                    value={formData.centreName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="centreAddress">Center Address *</Label>
                  <Input
                    id="centreAddress"
                    name="centreAddress"
                    placeholder="456 Health Ave"
                    value={formData.centreAddress}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="operatorName">Operator Name *</Label>
                  <Input
                    id="operatorName"
                    name="operatorName"
                    placeholder="John Manager"
                    value={formData.operatorName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    placeholder="40"
                    value={formData.age}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+1234567890"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="center@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qualifications">Operator Qualifications *</Label>
                  <Input
                    id="qualifications"
                    name="qualifications"
                    placeholder="BSc Medical Technology"
                    value={formData.qualifications}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="certificate">Center Certificate (PDF) *</Label>
                <Input
                  id="certificate"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => e.target.files && setCertificate(e.target.files[0])}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={loading}>
                {loading ? 'Submitting...' : 'Register Center'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">Already registered? </span>
              <Link to="/diagnostics/login" className="text-purple-600 hover:text-purple-700">
                Sign in here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
