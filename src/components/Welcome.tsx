import { Link } from 'react-router-dom';
import { Heart, Activity, Stethoscope, Clock, Shield, Users } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';

export default function Welcome() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="size-8 text-blue-600" />
            <span className="text-xl text-blue-900">HealthCare+</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/help" className="text-gray-600 hover:text-blue-600 transition-colors">
              Help
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-blue-600 transition-colors">
              About
            </Link>
            <Link to="/reviews" className="text-gray-600 hover:text-blue-600 transition-colors">
              Reviews
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">
              Contact
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl text-blue-900 mb-6">
              Your Health, Our Priority
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Connect with certified doctors, book diagnostics tests, and order medicines online. 
              Complete healthcare solution at your fingertips.
            </p>
            <Link to="/get-started">
              <Button size="lg" className="px-8 py-6">
                Get Started
              </Button>
            </Link>
          </div>
          <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1646913508331-5ef3f22ba677?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwbWVkaWNhbCUyMGRvY3RvcnxlbnwxfHx8fDE3NjM2Mjg4NDB8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Healthcare professional"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl text-center text-blue-900 mb-12">
            Why Choose HealthCare+?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Stethoscope className="size-8 text-blue-600" />
              </div>
              <h3 className="text-xl mb-3 text-gray-900">Certified Doctors</h3>
              <p className="text-gray-600">
                Book appointments with verified, experienced doctors across specializations.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Activity className="size-8 text-blue-600" />
              </div>
              <h3 className="text-xl mb-3 text-gray-900">Diagnostic Services</h3>
              <p className="text-gray-600">
                Access quality diagnostic centers for tests and health packages near you.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Shield className="size-8 text-blue-600" />
              </div>
              <h3 className="text-xl mb-3 text-gray-900">Online Pharmacy</h3>
              <p className="text-gray-600">
                Order medicines from verified pharmacies with prescription upload support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <Users className="size-12 mx-auto mb-4" />
              <div className="text-4xl mb-2">10,000+</div>
              <div className="text-blue-100">Active Patients</div>
            </div>
            <div>
              <Stethoscope className="size-12 mx-auto mb-4" />
              <div className="text-4xl mb-2">500+</div>
              <div className="text-blue-100">Certified Doctors</div>
            </div>
            <div>
              <Clock className="size-12 mx-auto mb-4" />
              <div className="text-4xl mb-2">24/7</div>
              <div className="text-blue-100">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl text-blue-900 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of patients who trust HealthCare+ for their medical needs.
          </p>
          <Link to="/get-started">
            <Button size="lg" className="px-8 py-6">
              Create Your Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="size-6 text-blue-500" />
                <span className="text-white">HealthCare+</span>
              </div>
              <p className="text-sm">
                Your trusted healthcare companion for online consultations, diagnostics, and medicines.
              </p>
            </div>
            <div>
              <h4 className="text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white mb-4">For Professionals</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/professional" className="hover:text-white transition-colors">Join as Doctor</Link></li>
                <li><Link to="/professional" className="hover:text-white transition-colors">Register Diagnostics</Link></li>
                <li><Link to="/professional" className="hover:text-white transition-colors">Register Pharmacy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Refund Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2025 HealthCare+. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
