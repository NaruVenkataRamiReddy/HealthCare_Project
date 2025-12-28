import { User, Building, Mail, Phone, MapPin, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { toast } from 'sonner@2.0.3';
import { useState } from 'react';

interface DiagnosticsProfileProps {
  user: any;
}

export default function DiagnosticsProfile({ user }: DiagnosticsProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    centreName: user.centreName || 'MediScan Diagnostics',
    centreAddress: user.centreAddress || '123 Health Street, Medical District, City - 400001',
    operatorName: user.operatorName || 'Dr. Rajesh Kumar',
    operatorAge: user.operatorAge || '45',
    operatorGender: user.operatorGender || 'Male',
    operatorEmail: user.operatorEmail || user.email || 'mediscan@example.com',
    operatorPhone: user.operatorPhone || '+91-9876543210',
    qualification: user.qualification || 'MBBS, MD (Radiology)',
    certificate: user.certificate || 'Certificate uploaded',
    workingHours: user.workingHours || '8:00 AM - 8:00 PM (Mon-Sat)',
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
          <p className="text-gray-600">Manage your diagnostic centre information</p>
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
            <CardTitle>Centre Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center">
                <Building className="size-12 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl mb-1">{formData.centreName}</h3>
                <p className="text-sm text-gray-600">{formData.centreAddress}</p>
              </div>
            </div>
            
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="size-4 text-gray-400" />
                <span>{formData.operatorEmail}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="size-4 text-gray-400" />
                <span>{formData.operatorPhone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Award className="size-4 text-gray-400" />
                <span>{formData.qualification}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Centre Details</CardTitle>
            <CardDescription>Update your diagnostic centre information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="centreName">Centre Name</Label>
                <Input
                  id="centreName"
                  value={formData.centreName}
                  onChange={(e) => setFormData({ ...formData, centreName: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="operatorName">Operator Name</Label>
                <Input
                  id="operatorName"
                  value={formData.operatorName}
                  onChange={(e) => setFormData({ ...formData, operatorName: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="centreAddress">Centre Address</Label>
              <Textarea
                id="centreAddress"
                value={formData.centreAddress}
                onChange={(e) => setFormData({ ...formData, centreAddress: e.target.value })}
                disabled={!isEditing}
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="operatorAge">Operator Age</Label>
                <Input
                  id="operatorAge"
                  type="number"
                  value={formData.operatorAge}
                  onChange={(e) => setFormData({ ...formData, operatorAge: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="operatorGender">Operator Gender</Label>
                <Input
                  id="operatorGender"
                  value={formData.operatorGender}
                  onChange={(e) => setFormData({ ...formData, operatorGender: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="operatorEmail">Email Address</Label>
                <Input
                  id="operatorEmail"
                  type="email"
                  value={formData.operatorEmail}
                  onChange={(e) => setFormData({ ...formData, operatorEmail: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="operatorPhone">Phone Number</Label>
                <Input
                  id="operatorPhone"
                  value={formData.operatorPhone}
                  onChange={(e) => setFormData({ ...formData, operatorPhone: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="qualification">Qualification</Label>
              <Input
                id="qualification"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                disabled={!isEditing}
              />
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
