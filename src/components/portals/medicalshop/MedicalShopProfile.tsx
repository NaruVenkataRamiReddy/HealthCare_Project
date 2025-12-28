import { Store, User, Mail, Phone, MapPin, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { toast } from 'sonner@2.0.3';
import { useState } from 'react';

interface MedicalShopProfileProps {
  user: any;
}

export default function MedicalShopProfile({ user }: MedicalShopProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    shopName: user.shopName || 'MediPlus Pharmacy',
    ownerName: user.ownerName || 'Rajesh Kumar',
    address: user.address || '456 Medical Street, Health District, City - 400002',
    phone: user.phone || '+91-9876543210',
    email: user.email || 'mediplus@example.com',
    licenseNumber: user.licenseNumber || 'DL-2024-123456',
    gstNumber: user.gstNumber || 'GST-2024-789012',
    certificate: user.certificate || 'Certificate uploaded',
    shopLicense: user.shopLicense || 'License uploaded',
    workingHours: user.workingHours || '8:00 AM - 10:00 PM (All Days)',
  });

  const handleSave = () => {
    toast.success('Profile updated successfully');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Profile & Settings</h1>
          <p className="text-gray-600">Manage your medical shop information</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Summary */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Shop Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center">
                <Store className="size-12 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl mb-1">{formData.shopName}</h3>
                <p className="text-sm text-gray-600">{formData.address}</p>
              </div>
            </div>
            
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center gap-3 text-sm">
                <User className="size-4 text-gray-400" />
                <span>{formData.ownerName}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="size-4 text-gray-400" />
                <span>{formData.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="size-4 text-gray-400" />
                <span>{formData.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <FileText className="size-4 text-gray-400" />
                <span>{formData.licenseNumber}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Shop Details</CardTitle>
            <CardDescription>Update your medical shop information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="shopName">Shop Name</Label>
                <Input
                  id="shopName"
                  value={formData.shopName}
                  onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ownerName">Owner Name</Label>
                <Input
                  id="ownerName"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                disabled={!isEditing}
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">License Number</Label>
                <Input
                  id="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gstNumber">GST Number</Label>
                <Input
                  id="gstNumber"
                  value={formData.gstNumber}
                  onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="workingHours">Working Hours</Label>
              <Input
                id="workingHours"
                value={formData.workingHours}
                onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="certificate">Certificate</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="certificate"
                    value={formData.certificate}
                    disabled
                    className="flex-1"
                  />
                  {isEditing && (
                    <Button variant="outline">Upload New</Button>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="shopLicense">Shop License</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="shopLicense"
                    value={formData.shopLicense}
                    disabled
                    className="flex-1"
                  />
                  {isEditing && (
                    <Button variant="outline">Upload New</Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>Manage your account preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full justify-start">
            Change Password
          </Button>
          <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
            Deactivate Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
