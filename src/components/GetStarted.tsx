import { Link } from 'react-router-dom';
import { User, Stethoscope, Activity, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export default function GetStarted() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8">
          <ArrowLeft className="size-4" />
          Back to Home
        </Link>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl text-center text-blue-900 mb-4">
            Choose Your Portal
          </h1>
          <p className="text-center text-gray-600 mb-12">
            Select how you want to access HealthCare+
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Patient Portal */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-300">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <User className="size-8 text-blue-600" />
                </div>
                <CardTitle>Patient Portal</CardTitle>
                <CardDescription>
                  Book appointments, order medicines, and manage your health records
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm text-gray-600 mb-6">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>Book appointments with certified doctors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>Schedule diagnostic tests</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>Order medicines online</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>Secure payment processing</span>
                  </li>
                </ul>
                <div className="flex gap-3">
                  <Link to="/patient/login" className="flex-1">
                    <Button variant="outline" className="w-full">Login</Button>
                  </Link>
                  <Link to="/patient/register" className="flex-1">
                    <Button className="w-full">Register</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Professional Portal */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-green-300">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Stethoscope className="size-8 text-green-600" />
                </div>
                <CardTitle>Professional Portal</CardTitle>
                <CardDescription>
                  For doctors, diagnostic centers, and medical shops
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm text-gray-600 mb-6">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Manage appointments and consultations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Handle test bookings and reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Process medicine orders</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Track payments and earnings</span>
                  </li>
                </ul>
                <Link to="/professional" className="block">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Professional Login/Register
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          <div className="mt-12 bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg mb-3 text-blue-900">New to HealthCare+?</h3>
            <p className="text-gray-600 mb-4">
              Our platform connects patients with healthcare professionals for seamless online consultations, 
              diagnostics, and medicine delivery. All transactions are secured with Razorpay payment gateway.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/about">
                <Button variant="outline" size="sm">Learn More</Button>
              </Link>
              <Link to="/help">
                <Button variant="outline" size="sm">Get Help</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
