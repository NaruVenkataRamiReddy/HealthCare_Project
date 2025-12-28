import { Link } from 'react-router-dom';
import { ArrowLeft, HelpCircle, MessageCircle, Book, Phone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8">
          <ArrowLeft className="size-4" />
          Back to Home
        </Link>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl text-center text-blue-900 mb-4">
            Help Center
          </h1>
          <p className="text-center text-gray-600 mb-12">
            Find answers to common questions and get support
          </p>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <MessageCircle className="size-8 text-blue-600 mb-2" />
                <CardTitle>Live Chat</CardTitle>
                <CardDescription>Chat with our support team</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Phone className="size-8 text-blue-600 mb-2" />
                <CardTitle>Call Us</CardTitle>
                <CardDescription>+1 (800) 123-4567</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Book className="size-8 text-blue-600 mb-2" />
                <CardTitle>Documentation</CardTitle>
                <CardDescription>Browse our guides</CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* FAQ */}
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How do I book an appointment?</AccordionTrigger>
                  <AccordionContent>
                    Log in to your patient account, browse nearby doctors, select a doctor and available time slot, 
                    then complete the booking with payment through Razorpay.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>What payment methods are accepted?</AccordionTrigger>
                  <AccordionContent>
                    We accept all major payment methods through Razorpay including credit/debit cards, UPI, 
                    net banking, and digital wallets.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>How do I get my prescription?</AccordionTrigger>
                  <AccordionContent>
                    After your consultation, the doctor will upload your prescription to your account. 
                    You can view and download it from your dashboard.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>Can I cancel or reschedule appointments?</AccordionTrigger>
                  <AccordionContent>
                    Yes, you can cancel or reschedule appointments up to 24 hours before the scheduled time. 
                    Refunds are processed according to our cancellation policy.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>How do I register as a healthcare professional?</AccordionTrigger>
                  <AccordionContent>
                    Go to Professional Portal and select your category (Doctor, Diagnostics, or Medical Shop). 
                    Complete the registration form with your credentials and upload required certificates. 
                    Your account will be verified within 24-48 hours.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}