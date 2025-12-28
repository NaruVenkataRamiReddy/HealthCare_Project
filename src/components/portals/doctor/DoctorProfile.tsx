import { useState } from 'react';
import { Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { toast } from 'sonner@2.0.3';

interface DoctorProfileProps {
  user: any;
}

export default function DoctorProfile({ user }: DoctorProfileProps) {
  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    specialization: user.specialization,
    qualifications: user.qualifications,
    fee: 50
  });

  const handleUpdate = () => {
    toast.success('Profile updated successfully!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Profile & Settings</h1>
        <p className="text-gray-600">Manage your professional information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Professional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization</Label>
              <Input
                id="specialization"
                value={profileData.specialization}
                onChange={(e) => setProfileData({ ...profileData, specialization: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="qualifications">Qualifications</Label>
              <Input
                id="qualifications"
                value={profileData.qualifications}
                onChange={(e) => setProfileData({ ...profileData, qualifications: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fee">Consultation Fee ($)</Label>
              <Input
                id="fee"
                type="number"
                value={profileData.fee}
                onChange={(e) => setProfileData({ ...profileData, fee: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <Button onClick={handleUpdate} className="w-full">
            <Save className="size-4 mr-2" />
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
