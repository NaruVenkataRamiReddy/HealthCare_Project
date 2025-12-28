import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { toast } from 'sonner@2.0.3';

interface MedicalShopRegisterProps {
  onRegister: (user: any) => void;
}

export default function MedicalShopRegister({ onRegister }: MedicalShopRegisterProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    shopName: '',
    ownerName: '',
    shopAddress: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [license, setLicense] = useState<File | null>(null);
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

    if (!license) {
      toast.error('Please upload shop license');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const newUser = {
        id: Date.now(),
        role: 'SHOP' as const,
        name: formData.shopName,
        shopName: formData.shopName,
        ownerName: formData.ownerName,
        email: formData.email,
        phone: formData.phone,
        address: formData.shopAddress
      };

      onRegister(newUser);
      toast.success('Registration successful!');
      navigate('/shop/dashboard');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Link to="/professional" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-6">
          <ArrowLeft className="size-4" />
          Back
        </Link>

        <Card>
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="size-8 text-orange-600" />
              </div>
            </div>
            <CardTitle className="text-center text-2xl">Medical Shop Registration</CardTitle>
            <CardDescription className="text-center">
              Register your pharmacy with HealthCare+
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shopName">Shop Name *</Label>
                  <Input
                    id="shopName"
                    name="shopName"
                    placeholder="HealthPlus Pharmacy"
                    value={formData.shopName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ownerName">Owner Name *</Label>
                  <Input
                    id="ownerName"
                    name="ownerName"
                    placeholder="Mike Wilson"
                    value={formData.ownerName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shopAddress">Shop Address *</Label>
                <Input
                  id="shopAddress"
                  name="shopAddress"
                  placeholder="789 Pharmacy Lane"
                  value={formData.shopAddress}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
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

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="shop@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="license">Shop License (PDF) *</Label>
                <Input
                  id="license"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => e.target.files && setLicense(e.target.files[0])}
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

              <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700" disabled={loading}>
                {loading ? 'Submitting...' : 'Register Shop'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">Already registered? </span>
              <Link to="/shop/login" className="text-orange-600 hover:text-orange-700">
                Sign in here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
