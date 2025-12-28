import { useState } from 'react';
import { Search, MapPin, Star, Upload, ShoppingCart, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Badge } from '../../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../ui/dialog';
import { toast } from 'sonner@2.0.3';

interface OrderMedicinesProps {
  user: any;
}

const medicalShops = [
  {
    id: 1,
    name: 'HealthPlus Pharmacy',
    owner: 'Mike Wilson',
    address: '789 Pharmacy Lane, Medical District',
    distance: '1.2 km',
    rating: 4.8,
    reviews: 342,
    deliveryTime: '30 mins',
    minOrder: 10
  },
  {
    id: 2,
    name: 'MediCare Pharmacy',
    owner: 'Lisa Anderson',
    address: '456 Health Street, Central Area',
    distance: '2.5 km',
    rating: 4.7,
    reviews: 289,
    deliveryTime: '45 mins',
    minOrder: 15
  },
  {
    id: 3,
    name: 'QuickMed Pharmacy',
    owner: 'Tom Brown',
    address: '123 Medical Ave, East Side',
    distance: '3.8 km',
    rating: 4.6,
    reviews: 198,
    deliveryTime: '60 mins',
    minOrder: 12
  }
];

export default function OrderMedicines({ user }: OrderMedicinesProps) {
  const [selectedShop, setSelectedShop] = useState<any>(null);
  const [orderOpen, setOrderOpen] = useState(false);
  const [prescription, setPrescription] = useState<File | null>(null);
  const [medicineList, setMedicineList] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState(user.address);

  const handlePlaceOrder = () => {
    if (!prescription && !medicineList) {
      toast.error('Please upload prescription or enter medicine list');
      return;
    }

    toast.info('Proceeding to payment...');
    // Simulate payment process
    setTimeout(() => {
      toast.success('Order placed successfully!');
      setOrderOpen(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Order Medicines</h1>
        <p className="text-gray-600">Order from nearby verified pharmacies</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 size-4 text-gray-400" />
            <Input
              placeholder="Search for pharmacies..."
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {medicalShops.map((shop) => (
          <Card key={shop.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <ShoppingCart className="size-8 text-orange-600" />
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="text-xl mb-1">{shop.name}</h3>
                      <p className="text-gray-600 text-sm mb-1">Owner: {shop.owner}</p>
                      <p className="text-gray-600 text-sm">{shop.address}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Open Now</Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="size-4 fill-yellow-400 text-yellow-400" />
                      <span>{shop.rating}</span>
                      <span className="text-gray-500">({shop.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <MapPin className="size-4" />
                      <span>{shop.distance} away</span>
                    </div>
                    <div className="text-gray-600">
                      Delivery: {shop.deliveryTime}
                    </div>
                    <div className="text-gray-600">
                      Min Order: ${shop.minOrder}
                    </div>
                  </div>

                  <Button onClick={() => {
                    setSelectedShop(shop);
                    setOrderOpen(true);
                  }}>
                    Order Medicines
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={orderOpen} onOpenChange={setOrderOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Place Order - {selectedShop?.name}</DialogTitle>
            <DialogDescription>
              Upload prescription or enter medicine list
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prescription">Upload Prescription (Optional)</Label>
              <Input
                id="prescription"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => e.target.files && setPrescription(e.target.files[0])}
              />
              {prescription && (
                <div className="text-sm text-green-600">✓ {prescription.name}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="medicines">Or Enter Medicine List *</Label>
              <textarea
                id="medicines"
                className="w-full border rounded-lg p-3 min-h-[120px]"
                placeholder="Example:&#10;Aspirin 75mg - 30 tablets&#10;Atorvastatin 10mg - 30 tablets"
                value={medicineList}
                onChange={(e) => setMedicineList(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Delivery Address *</Label>
              <Input
                id="address"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                required
              />
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-sm text-gray-700 mb-2">
                <strong>Note:</strong> The pharmacy will review your order and provide final pricing 
                based on medicine availability.
              </div>
              <div className="text-sm text-gray-700">
                Estimated processing time: 15-30 minutes
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setOrderOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handlePlaceOrder}
              >
                <CreditCard className="size-4 mr-2" />
                Place Order
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
