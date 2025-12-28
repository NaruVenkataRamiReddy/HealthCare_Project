import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Mail, Lock, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { toast } from 'sonner@2.0.3';
import { mockLogin } from '../../utils/mockAuth';

interface MedicalShopLoginProps {
  onLogin: (user: any) => void;
}

export default function MedicalShopLogin({ onLogin }: MedicalShopLoginProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await mockLogin({ email, password }, 'shop');
      onLogin(user);
      toast.success('Welcome back!');
      navigate('/shop/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/professional" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-6">
          <ArrowLeft className="size-4" />
          Back to Professional Portal
        </Link>

        <Card>
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="size-8 text-orange-600" />
              </div>
            </div>
            <CardTitle className="text-center text-2xl">Medical Shop Login</CardTitle>
            <CardDescription className="text-center">
              Access your pharmacy dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="shop@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">Not registered yet? </span>
              <Link to="/shop/register" className="text-orange-600 hover:text-orange-700">
                Register Shop
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}