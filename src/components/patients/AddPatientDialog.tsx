
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { parseISO } from "date-fns";

interface AddPatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (patientId?: string) => void;
  editPatient?: any;
}

export const AddPatientDialog: React.FC<AddPatientDialogProps> = ({ 
  open, 
  onOpenChange,
  onSuccess,
  editPatient
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: editPatient ? editPatient.name.split(' ')[0] : '',
    lastName: editPatient ? editPatient.name.split(' ').slice(1).join(' ') : '',
    dateOfBirth: editPatient ? editPatient.date_of_birth : '',
    gender: editPatient ? editPatient.gender : '',
    email: editPatient ? editPatient.email : '',
    phone: editPatient ? editPatient.phone : '',
    address: editPatient ? editPatient.address : '',
    bloodType: editPatient ? editPatient.blood_type : '',
    emergency: editPatient ? editPatient.emergency_contact : '',
    allergies: '',
    status: editPatient ? editPatient.status : 'Active'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear() - 
                 (today.getMonth() < dob.getMonth() || 
                 (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate()) ? 1 : 0);
      
      const patientData = {
        name: fullName,
        age: age,
        gender: formData.gender,
        email: formData.email,
        phone: formData.phone,
        address: formData.address || null,
        date_of_birth: formData.dateOfBirth,
        blood_type: formData.bloodType || null,
        emergency_contact: formData.emergency || null,
        status: formData.status || 'Active'
      };

      let result;
      let patientId;
      
      if (editPatient) {
        // Update existing patient
        result = await supabase
          .from('patients')
          .update(patientData)
          .eq('id', editPatient.id);
          
        if (result.error) throw result.error;
        patientId = editPatient.id;
        
        toast({
          title: "Patient updated",
          description: "The patient information has been updated successfully."
        });
      } else {
        // Insert new patient
        result = await supabase
          .from('patients')
          .insert([patientData])
          .select();
          
        if (result.error) throw result.error;
        
        // Get the ID of the newly created patient
        patientId = result.data && result.data[0]?.id;
        
        toast({
          title: "Patient added",
          description: "The new patient has been added successfully."
        });
      }
      
      onSuccess(patientId);
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error saving patient:', error);
      toast({
        title: "Error",
        description: error.message || "There was an error saving the patient data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{editPatient ? 'Edit Patient' : 'Add New Patient'}</DialogTitle>
            <DialogDescription>
              {editPatient ? 'Update the patient\'s information.' : 'Enter the patient\'s information to create a new patient record.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  placeholder="First name" 
                  value={formData.firstName}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  placeholder="Last name" 
                  value={formData.lastName}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input 
                  id="dateOfBirth" 
                  type="date" 
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <select 
                  id="gender" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Email address" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                placeholder="Phone number" 
                value={formData.phone}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea 
                id="address" 
                placeholder="Full address" 
                value={formData.address || ''}
                onChange={handleChange}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bloodType">Blood Type</Label>
                <select 
                  id="bloodType" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.bloodType || ''}
                  onChange={handleChange}
                >
                  <option value="">Select Blood Type</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergency">Emergency Contact</Label>
                <Input 
                  id="emergency" 
                  placeholder="Emergency contact" 
                  value={formData.emergency || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="allergies">Known Allergies</Label>
              <Textarea 
                id="allergies" 
                placeholder="List any known allergies" 
                value={formData.allergies}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : editPatient ? 'Update Patient' : 'Save Patient'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
