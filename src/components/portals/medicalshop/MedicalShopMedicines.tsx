import { Pill, Plus, Edit, Trash2, AlertTriangle, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { toast } from 'sonner@2.0.3';
import { useState } from 'react';

interface MedicalShopMedicinesProps {
  user: any;
}

const medicines = [
  {
    id: 1,
    name: 'Paracetamol',
    genericName: 'Acetaminophen',
    strength: '500mg',
    form: 'Tablet',
    manufacturer: 'PharmaCo',
    price: 2.50,
    stock: 500,
    minStock: 100,
    expiryDate: '2026-12-31',
    category: 'Pain Relief'
  },
  {
    id: 2,
    name: 'Amoxicillin',
    genericName: 'Amoxicillin',
    strength: '250mg',
    form: 'Capsule',
    manufacturer: 'MediCare',
    price: 5.00,
    stock: 45,
    minStock: 50,
    expiryDate: '2026-06-30',
    category: 'Antibiotic'
  },
  {
    id: 3,
    name: 'Vitamin D3',
    genericName: 'Cholecalciferol',
    strength: '60000 IU',
    form: 'Capsule',
    manufacturer: 'HealthVit',
    price: 15.00,
    stock: 200,
    minStock: 50,
    expiryDate: '2027-03-31',
    category: 'Supplement'
  },
  {
    id: 4,
    name: 'Azithromycin',
    genericName: 'Azithromycin',
    strength: '500mg',
    form: 'Tablet',
    manufacturer: 'PharmaCo',
    price: 12.00,
    stock: 80,
    minStock: 30,
    expiryDate: '2026-09-30',
    category: 'Antibiotic'
  },
  {
    id: 5,
    name: 'Cetirizine',
    genericName: 'Cetirizine HCl',
    strength: '10mg',
    form: 'Tablet',
    manufacturer: 'AllerCare',
    price: 1.50,
    stock: 15,
    minStock: 50,
    expiryDate: '2026-11-30',
    category: 'Antihistamine'
  },
  {
    id: 6,
    name: 'Metformin',
    genericName: 'Metformin HCl',
    strength: '500mg',
    form: 'Tablet',
    manufacturer: 'DiabeCare',
    price: 3.00,
    stock: 300,
    minStock: 100,
    expiryDate: '2027-01-31',
    category: 'Diabetes'
  },
  {
    id: 7,
    name: 'Aspirin',
    genericName: 'Acetylsalicylic Acid',
    strength: '75mg',
    form: 'Tablet',
    manufacturer: 'CardioMed',
    price: 2.00,
    stock: 250,
    minStock: 100,
    expiryDate: '2026-08-31',
    category: 'Cardiovascular'
  },
  {
    id: 8,
    name: 'Atorvastatin',
    genericName: 'Atorvastatin',
    strength: '10mg',
    form: 'Tablet',
    manufacturer: 'CardioMed',
    price: 8.00,
    stock: 150,
    minStock: 50,
    expiryDate: '2026-10-31',
    category: 'Cardiovascular'
  }
];

export default function MedicalShopMedicines({ user }: MedicalShopMedicinesProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMedicines = medicines.filter(med =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockItems = medicines.filter(med => med.stock < med.minStock);

  const handleAddNew = () => {
    toast.info('Add new medicine - This will open a form dialog');
  };

  const handleEdit = (id: number) => {
    toast.info(`Edit medicine #${id} - This will be implemented with backend`);
  };

  const handleDelete = (id: number) => {
    toast.success(`Medicine #${id} deleted successfully`);
  };

  const handleRestockAlert = (id: number) => {
    toast.info(`Restock alert sent for medicine #${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Medicine Inventory</h1>
          <p className="text-gray-600">Manage your medicine stock</p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="size-4 mr-2" />
          Add Medicine
        </Button>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="size-8 text-red-600 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="mb-2 text-red-900">Low Stock Alert</h3>
                <p className="text-sm text-red-800 mb-3">
                  {lowStockItems.length} medicine(s) are running low on stock:
                </p>
                <div className="flex flex-wrap gap-2">
                  {lowStockItems.map(med => (
                    <Badge key={med.id} className="bg-red-100 text-red-700">
                      {med.name} ({med.stock} left)
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl mb-1">{medicines.length}</div>
            <div className="text-sm text-gray-600">Total Medicines</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl mb-1">{medicines.reduce((sum, m) => sum + m.stock, 0)}</div>
            <div className="text-sm text-gray-600">Total Stock</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl mb-1 text-red-600">{lowStockItems.length}</div>
            <div className="text-sm text-gray-600">Low Stock Items</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl mb-1">
              {new Set(medicines.map(m => m.category)).size}
            </div>
            <div className="text-sm text-gray-600">Categories</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
            <Input
              placeholder="Search medicines by name, generic name, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Medicines Table */}
      <Card>
        <CardHeader>
          <CardTitle>Medicine Inventory</CardTitle>
          <CardDescription>Complete list of available medicines</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medicine Name</TableHead>
                  <TableHead>Generic Name</TableHead>
                  <TableHead>Strength</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMedicines.map((medicine) => (
                  <TableRow key={medicine.id}>
                    <TableCell>
                      <div>
                        <div className="mb-1">{medicine.name}</div>
                        <div className="text-xs text-gray-500">{medicine.form}</div>
                      </div>
                    </TableCell>
                    <TableCell>{medicine.genericName}</TableCell>
                    <TableCell>{medicine.strength}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{medicine.category}</Badge>
                    </TableCell>
                    <TableCell>₹{medicine.price.toLocaleString('en-IN')}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={medicine.stock < medicine.minStock ? 'text-red-600' : ''}>
                          {medicine.stock}
                        </span>
                        {medicine.stock < medicine.minStock && (
                          <AlertTriangle className="size-4 text-red-600" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{medicine.expiryDate}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(medicine.id)}
                        >
                          <Edit className="size-4" />
                        </Button>
                        {medicine.stock < medicine.minStock && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-orange-600"
                            onClick={() => handleRestockAlert(medicine.id)}
                          >
                            Restock
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(medicine.id)}
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
    </div>
  );
}
