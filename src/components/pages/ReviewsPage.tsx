import { Link } from 'react-router-dom';
import { ArrowLeft, Star } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';

const reviews = [
  {
    id: 1,
    name: 'Sarah Johnson',
    rating: 5,
    comment: 'Excellent service! Booked an appointment with a cardiologist and received great care. The platform is very user-friendly.',
    date: '2 days ago'
  },
  {
    id: 2,
    name: 'Michael Chen',
    rating: 5,
    comment: 'Quick and convenient. Ordered my medicines online and received them the same day. Highly recommend!',
    date: '1 week ago'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    rating: 4,
    comment: 'Great experience with the diagnostic center. Reports were uploaded quickly and accurately.',
    date: '2 weeks ago'
  },
  {
    id: 4,
    name: 'David Miller',
    rating: 5,
    comment: 'The payment process with Razorpay was smooth and secure. Very professional platform.',
    date: '3 weeks ago'
  },
  {
    id: 5,
    name: 'Lisa Anderson',
    rating: 5,
    comment: 'Found a great doctor for my chronic condition. The follow-up care has been exceptional.',
    date: '1 month ago'
  }
];

export default function ReviewsPage() {
  const averageRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8">
          <ArrowLeft className="size-4" />
          Back to Home
        </Link>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl text-center text-blue-900 mb-4">
            Patient Reviews
          </h1>
          <p className="text-center text-gray-600 mb-8">
            See what our patients are saying about HealthCare+
          </p>

          <div className="bg-white rounded-lg shadow-md p-8 mb-12 text-center">
            <div className="text-5xl mb-2">{averageRating}</div>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="size-6 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <p className="text-gray-600">Based on {reviews.length} reviews</p>
          </div>

          <div className="space-y-6">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarFallback>{review.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div>{review.name}</div>
                          <div className="text-sm text-gray-500">{review.date}</div>
                        </div>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`size-4 ${
                                star <= review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
