import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, Users, Shield, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8">
          <ArrowLeft className="size-4" />
          Back to Home
        </Link>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl text-center text-blue-900 mb-4">
            About HealthCare+
          </h1>
          <p className="text-xl text-center text-gray-600 mb-12">
            Your trusted partner in digital healthcare
          </p>

          <div className="prose max-w-none mb-12">
            <p className="text-gray-700 text-lg mb-6">
              HealthCare+ is a comprehensive digital healthcare platform that connects patients with certified 
              medical professionals, diagnostic centers, and pharmacies. Our mission is to make quality healthcare 
              accessible, affordable, and convenient for everyone.
            </p>

            <p className="text-gray-700 text-lg mb-6">
              Founded in 2024, we've grown to serve thousands of patients across the country, partnering with 
              over 500 certified doctors, 100+ diagnostic centers, and 200+ verified pharmacies.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Heart className="size-12 text-blue-600 mb-4" />
              <h3 className="text-xl mb-3">Our Mission</h3>
              <p className="text-gray-600">
                To revolutionize healthcare delivery by leveraging technology to provide seamless, 
                patient-centric care that's accessible to all.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Shield className="size-12 text-blue-600 mb-4" />
              <h3 className="text-xl mb-3">Our Values</h3>
              <p className="text-gray-600">
                We prioritize patient safety, data security, and quality care. All our healthcare 
                professionals are thoroughly verified and certified.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Users className="size-12 text-blue-600 mb-4" />
              <h3 className="text-xl mb-3">Our Team</h3>
              <p className="text-gray-600">
                A dedicated team of healthcare professionals, technologists, and customer support 
                specialists working together for your health.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Award className="size-12 text-blue-600 mb-4" />
              <h3 className="text-xl mb-3">Our Impact</h3>
              <p className="text-gray-600">
                Over 50,000 successful consultations, 100,000+ prescriptions filled, and countless 
                lives improved through accessible healthcare.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
