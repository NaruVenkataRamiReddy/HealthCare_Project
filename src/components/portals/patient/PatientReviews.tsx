import { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { toast } from 'sonner@2.0.3';

interface PatientReviewsProps {
  user: any;
}

const recentServices = [
  { id: 1, type: 'DOCTOR', name: 'Dr. Sarah Johnson', specialization: 'Cardiologist', date: '2025-11-20' },
  { id: 2, type: 'SHOP', name: 'HealthPlus Pharmacy', owner: 'Mike Wilson', date: '2025-11-19' },
  { id: 3, type: 'DIAGNOSTICS', name: 'MediScan Diagnostics', operator: 'John Manager', date: '2025-11-18' }
];

export default function PatientReviews({ user }: PatientReviewsProps) {
  const [selectedService, setSelectedService] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (!selectedService || rating === 0) {
      toast.error('Please select a service and provide a rating');
      return;
    }

    toast.success('Review submitted successfully!');
    setSelectedService('');
    setRating(0);
    setComment('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Rate & Review</h1>
        <p className="text-gray-600">Share your experience with our services</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submit a Review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="service">Select Service *</Label>
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a service to review..." />
              </SelectTrigger>
              <SelectContent>
                {recentServices.map((service) => (
                  <SelectItem key={service.id} value={service.id.toString()}>
                    {service.name} - {service.date}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Rating *</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`size-10 ${
                      star <= (hoverRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <div className="text-sm text-gray-600">
                You rated: {rating} star{rating > 1 ? 's' : ''}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Your Review (Optional)</Label>
            <Textarea
              id="comment"
              placeholder="Share your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={5}
            />
          </div>

          <Button onClick={handleSubmit} className="w-full">
            <Send className="size-4 mr-2" />
            Submit Review
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Previous Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            No reviews yet. Submit your first review above!
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
