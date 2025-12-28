import { Package, Plus, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { toast } from 'sonner@2.0.3';

interface DiagnosticsServicesProps {
  user: any;
}

const individualTests = [
  { id: 1, name: 'Blood Test (Complete)', price: 800, duration: '30 mins', category: 'Pathology' },
  { id: 2, name: 'X-Ray Chest', price: 600, duration: '15 mins', category: 'Radiology' },
  { id: 3, name: 'ECG', price: 500, duration: '20 mins', category: 'Cardiology' },
  { id: 4, name: 'Ultrasound Abdomen', price: 1200, duration: '45 mins', category: 'Radiology' },
  { id: 5, name: 'Thyroid Profile', price: 900, duration: '30 mins', category: 'Pathology' },
  { id: 6, name: 'Lipid Profile', price: 700, duration: '30 mins', category: 'Pathology' },
];

const healthPackages = [
  {
    id: 1,
    name: 'Full Body Checkup',
    price: 3500,
    originalPrice: 4500,
    tests: ['Blood Test', 'X-Ray', 'ECG', 'Ultrasound', 'Thyroid'],
    popular: true
  },
  {
    id: 2,
    name: 'Diabetes Package',
    price: 1500,
    originalPrice: 2000,
    tests: ['Blood Sugar', 'HbA1c', 'Lipid Profile'],
    popular: false
  },
  {
    id: 3,
    name: 'Cardiac Health Package',
    price: 2500,
    originalPrice: 3200,
    tests: ['ECG', 'Echo', 'Lipid Profile', 'Blood Test'],
    popular: true
  },
  {
    id: 4,
    name: 'Women Wellness',
    price: 3000,
    originalPrice: 3800,
    tests: ['Complete Blood', 'Thyroid', 'Vitamin D', 'Calcium', 'Pap Smear'],
    popular: false
  },
];

export default function DiagnosticsServices({ user }: DiagnosticsServicesProps) {
  const handleEdit = (id: number, type: string) => {
    toast.info(`Edit ${type} #${id} - This will be implemented with backend`);
  };

  const handleDelete = (id: number, type: string) => {
    toast.success(`${type} #${id} deleted successfully`);
  };

  const handleAddNew = (type: string) => {
    toast.info(`Add new ${type} - This will open a form dialog`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Services & Packages</h1>
          <p className="text-gray-600">Manage your diagnostic tests and health packages</p>
        </div>
      </div>

      <Tabs defaultValue="tests" className="space-y-6">
        <TabsList>
          <TabsTrigger value="tests">Individual Tests</TabsTrigger>
          <TabsTrigger value="packages">Health Packages</TabsTrigger>
        </TabsList>

        <TabsContent value="tests" className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={() => handleAddNew('Test')}>
              <Plus className="size-4 mr-2" />
              Add New Test
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Individual Diagnostic Tests</CardTitle>
              <CardDescription>All available diagnostic tests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Test Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {individualTests.map((test) => (
                      <TableRow key={test.id}>
                        <TableCell>
                          <div className="font-medium">{test.name}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{test.category}</Badge>
                        </TableCell>
                        <TableCell>{test.duration}</TableCell>
                        <TableCell>
                          <div className="text-lg">₹{test.price.toLocaleString('en-IN')}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(test.id, 'Test')}
                            >
                              <Edit className="size-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(test.id, 'Test')}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="packages" className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={() => handleAddNew('Package')}>
              <Plus className="size-4 mr-2" />
              Add New Package
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {healthPackages.map((pkg) => (
              <Card key={pkg.id} className={pkg.popular ? 'border-purple-200 shadow-lg' : ''}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{pkg.name}</CardTitle>
                      {pkg.popular && (
                        <Badge className="mt-2 bg-purple-100 text-purple-700">Popular</Badge>
                      )}
                    </div>
                    <Package className="size-8 text-purple-600" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl">₹{pkg.price.toLocaleString('en-IN')}</span>
                      <span className="text-lg text-gray-400 line-through">
                        ₹{pkg.originalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="text-sm text-green-600 mt-1">
                      Save ₹{(pkg.originalPrice - pkg.price).toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm mb-2">Includes:</div>
                    <div className="flex flex-wrap gap-2">
                      {pkg.tests.map((test, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {test}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleEdit(pkg.id, 'Package')}
                    >
                      <Edit className="size-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(pkg.id, 'Package')}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
