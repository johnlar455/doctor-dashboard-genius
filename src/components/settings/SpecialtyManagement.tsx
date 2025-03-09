
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Plus, Edit, Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { LoadingState } from "@/components/analytics/shared/LoadingState";

interface Specialty {
  id: string;
  name: string;
  department: string;
  description: string;
  price: number;
  active: boolean;
}

export const SpecialtyManagement = () => {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAddSpecialtyOpen, setIsAddSpecialtyOpen] = useState(false);
  const [isEditSpecialtyOpen, setIsEditSpecialtyOpen] = useState(false);
  const [currentSpecialty, setCurrentSpecialty] = useState<Specialty | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    description: "",
    price: 0,
    active: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would fetch from the database
        // Mock data for demonstration
        const mockSpecialties: Specialty[] = [
          {
            id: "1",
            name: "General Consultation",
            department: "General",
            description: "Basic doctor consultation for common health issues",
            price: 50,
            active: true,
          },
          {
            id: "2",
            name: "Cardiology Check-up",
            department: "Cardiology",
            description: "Heart check-up including ECG",
            price: 120,
            active: true,
          },
          {
            id: "3",
            name: "Pediatric Check-up",
            department: "Pediatrics",
            description: "Complete check-up for children",
            price: 75,
            active: true,
          },
          {
            id: "4",
            name: "Dermatology Consultation",
            department: "Dermatology",
            description: "Skin examination and treatment",
            price: 90,
            active: false,
          },
          {
            id: "5",
            name: "Orthopedic Evaluation",
            department: "Orthopedics",
            description: "Evaluation of bones, joints, and muscles",
            price: 110,
            active: true,
          },
        ];
        
        setSpecialties(mockSpecialties);
      } catch (error) {
        console.error("Error fetching specialties:", error);
        toast({
          title: "Error",
          description: "Failed to load specialties",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpecialties();
  }, [toast]);

  const filteredSpecialties = specialties.filter(
    (specialty) =>
      specialty.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      specialty.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      specialty.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddSpecialty = () => {
    // In a real app, this would send to the database
    const newSpecialty: Specialty = {
      id: (specialties.length + 1).toString(),
      name: formData.name,
      department: formData.department,
      description: formData.description,
      price: formData.price,
      active: formData.active,
    };
    
    setSpecialties([...specialties, newSpecialty]);
    setIsAddSpecialtyOpen(false);
    setFormData({
      name: "",
      department: "",
      description: "",
      price: 0,
      active: true,
    });
    
    toast({
      title: "Specialty added",
      description: `${newSpecialty.name} has been added successfully`,
    });
  };

  const handleEditSpecialty = () => {
    if (!currentSpecialty) return;
    
    const updatedSpecialties = specialties.map((specialty) =>
      specialty.id === currentSpecialty.id
        ? { 
            ...specialty, 
            name: formData.name, 
            department: formData.department,
            description: formData.description,
            price: formData.price,
            active: formData.active,
          }
        : specialty
    );
    
    setSpecialties(updatedSpecialties);
    setIsEditSpecialtyOpen(false);
    setCurrentSpecialty(null);
    setFormData({
      name: "",
      department: "",
      description: "",
      price: 0,
      active: true,
    });
    
    toast({
      title: "Specialty updated",
      description: "Specialty information has been updated successfully",
    });
  };

  const handleDeleteSpecialty = (id: string) => {
    setSpecialties(specialties.filter((specialty) => specialty.id !== id));
    
    toast({
      title: "Specialty deleted",
      description: "Specialty has been removed successfully",
    });
  };

  const toggleSpecialtyStatus = (id: string) => {
    const updatedSpecialties = specialties.map((specialty) =>
      specialty.id === id
        ? { ...specialty, active: !specialty.active }
        : specialty
    );
    
    setSpecialties(updatedSpecialties);
    
    const specialty = specialties.find((specialty) => specialty.id === id);
    const newStatus = !specialty?.active;
    
    toast({
      title: `Specialty ${newStatus ? "activated" : "deactivated"}`,
      description: `Specialty has been ${newStatus ? "activated" : "deactivated"} successfully`,
    });
  };

  const openEditModal = (specialty: Specialty) => {
    setCurrentSpecialty(specialty);
    setFormData({
      name: specialty.name,
      department: specialty.department,
      description: specialty.description,
      price: specialty.price,
      active: specialty.active,
    });
    setIsEditSpecialtyOpen(true);
  };

  if (isLoading) {
    return <LoadingState message="Loading specialties..." />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Specialty & Service Management</CardTitle>
        <CardDescription>
          Manage medical specialties and services available in the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search specialties..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            onClick={() => setIsAddSpecialtyOpen(true)}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> Add Specialty
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Department</TableHead>
                <TableHead className="hidden md:table-cell">Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSpecialties.length > 0 ? (
                filteredSpecialties.map((specialty) => (
                  <TableRow key={specialty.id}>
                    <TableCell className="font-medium">{specialty.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{specialty.department}</TableCell>
                    <TableCell className="hidden md:table-cell line-clamp-1">{specialty.description}</TableCell>
                    <TableCell>${specialty.price}</TableCell>
                    <TableCell>
                      <div className={`px-2 py-1 rounded-full text-xs font-semibold w-fit ${
                        specialty.active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {specialty.active ? "Active" : "Inactive"}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => openEditModal(specialty)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={specialty.active ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleSpecialtyStatus(specialty.id)}
                        >
                          {specialty.active ? "Deactivate" : "Activate"}
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteSpecialty(specialty.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No specialties found. Try adjusting your search or add a new specialty.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Add Specialty Dialog */}
        <Dialog open={isAddSpecialtyOpen} onOpenChange={setIsAddSpecialtyOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Specialty</DialogTitle>
              <DialogDescription>
                Create a new medical specialty or service
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  className="col-span-3"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="department" className="text-right">
                  Department
                </Label>
                <Input
                  id="department"
                  className="col-span-3"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  className="col-span-3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Price ($)
                </Label>
                <Input
                  id="price"
                  type="number"
                  className="col-span-3"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="active" className="text-right">
                  Status
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="active" className="text-sm font-normal">
                    Active
                  </Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleAddSpecialty}>Add Specialty</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Specialty Dialog */}
        <Dialog open={isEditSpecialtyOpen} onOpenChange={setIsEditSpecialtyOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Specialty</DialogTitle>
              <DialogDescription>
                Modify medical specialty or service information
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  className="col-span-3"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-department" className="text-right">
                  Department
                </Label>
                <Input
                  id="edit-department"
                  className="col-span-3"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">
                  Description
                </Label>
                <Input
                  id="edit-description"
                  className="col-span-3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-price" className="text-right">
                  Price ($)
                </Label>
                <Input
                  id="edit-price"
                  type="number"
                  className="col-span-3"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-active" className="text-right">
                  Status
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edit-active"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="edit-active" className="text-sm font-normal">
                    Active
                  </Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleEditSpecialty}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
