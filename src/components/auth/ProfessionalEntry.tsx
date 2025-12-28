import { Link } from 'react-router-dom';
import { Stethoscope, Activity, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

export default function ProfessionalEntry() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <Link to="/get-started" className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-8">
          <ArrowLeft className="size-4" />
          Back
        </Link>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl text-center text-gray-900 mb-4">
            Professional Portal
          </h1>
          <p className="text-center text-gray-600 mb-12">
            Select your professional category to continue
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Doctor */}
            <Card className="hover:shadow-lg transition-shadow border-2 hover:border-blue-300">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Stethoscope className="size-8 text-blue-600" />
                </div>
                <CardTitle>Doctor</CardTitle>
                <CardDescription>
                  Provide consultations and manage appointments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm text-gray-600 mb-6">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Manage appointments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Write prescriptions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Track payments</span>
                  </li>
                </ul>
                <div className="flex gap-3">
                  <Link to="/doctor/login" className="flex-1">
                    <Button variant="outline" className="w-full">Login</Button>
                  </Link>
                  <Link to="/doctor/register" className="flex-1">
                    <Button className="w-full">Register</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Diagnostics */}
            <Card className="hover:shadow-lg transition-shadow border-2 hover:border-purple-300">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Activity className="size-8 text-purple-600" />
                </div>
                <CardTitle>Diagnostics Center</CardTitle>
                <CardDescription>
                  Offer diagnostic tests and health packages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm text-gray-600 mb-6">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span>Manage test bookings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span>Upload reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span>Handle payments</span>
                  </li>
                </ul>
                <div className="flex gap-3">
                  <Link to="/diagnostics/login" className="flex-1">
                    <Button variant="outline" className="w-full">Login</Button>
                  </Link>
                  <Link to="/diagnostics/register" className="flex-1">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">Register</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Medical Shop */}
            <Card className="hover:shadow-lg transition-shadow border-2 hover:border-orange-300">
              <CardHeader>
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag className="size-8 text-orange-600" />
                </div>
                <CardTitle>Medical Shop</CardTitle>
                <CardDescription>
                  Fulfill medicine orders and prescriptions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm text-gray-600 mb-6">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-1">•</span>
                    <span>Process orders</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-1">•</span>
                    <span>Manage inventory</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-1">•</span>
                    <span>Track deliveries</span>
                  </li>
                </ul>
                <div className="flex gap-3">
                  <Link to="/shop/login" className="flex-1">
                    <Button variant="outline" className="w-full">Login</Button>
                  </Link>
                  <Link to="/shop/register" className="flex-1">
                    <Button className="w-full bg-orange-600 hover:bg-orange-700">Register</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 bg-green-50 rounded-lg p-6">
            <h3 className="text-lg mb-3 text-gray-900">Registration Requirements</h3>
            <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-600">
              <div>
                <p className="mb-2"><strong>Doctors:</strong></p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Medical degree certificate</li>
                  <li>Valid license number</li>
                  <li>Specialization details</li>
                </ul>
              </div>
              <div>
                <p className="mb-2"><strong>Diagnostics:</strong></p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Center registration</li>
                  <li>Operator credentials</li>
                  <li>Facility certificate</li>
                </ul>
              </div>
              <div>
                <p className="mb-2"><strong>Medical Shops:</strong></p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Pharmacy license</li>
                  <li>Shop registration</li>
                  <li>Owner verification</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
