
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { departments, specialties } from "@/data/doctors";
import { Doctor } from "@/types/supabase";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AddDoctorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (doctor: Doctor) => void;
}

export const AddDoctorDialog: React.FC<AddDoctorDialogProps> = ({ 
  open, 
  onOpenChange,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    department: "",
    email: "",
    phone: "",
    bio: "",
    availableDays: [] as string[],
    startTime: "09:00",
    endTime: "17:00"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.availableDays.length === 0) {
      toast.error("Please select at least one available day");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Generate a new doctor object
      const newDoctor = {
        name: formData.name,
        avatar: "/placeholder.svg",
        specialty: formData.specialty,
        department: formData.department,
        email: formData.email,
        phone: formData.phone,
        bio: formData.bio,
        availability: {
          start: formData.startTime,
          end: formData.endTime,
          days: formData.availableDays,
        }
      };
      
      // Insert the doctor into Supabase
      const { data, error } = await supabase
        .from('doctors')
        .insert(newDoctor)
        .select();
      
      if (error) throw error;
      
      // Call onSuccess with the newly created doctor
      if (data && data.length > 0) {
        onSuccess(data[0] as Doctor);
      }
      
      onOpenChange(false);
      
      // Reset form
      setFormData({
        name: "",
        specialty: "",
        department: "",
        email: "",
        phone: "",
        bio: "",
        availableDays: [],
        startTime: "09:00",
        endTime: "17:00"
      });
      
    } catch (err) {
      console.error('Error adding doctor:', err);
      toast.error("Failed to add doctor. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Doctor</DialogTitle>
            <DialogDescription>
              Enter the details to add a new doctor to the system.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">Department</Label>
              <Select 
                value={formData.department} 
                onValueChange={(value) => handleSelectChange("department", value)}
                required
              >
                <SelectTrigger id="department" className="col-span-3">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="specialty" className="text-right">Specialty</Label>
              <Select 
                value={formData.specialty} 
                onValueChange={(value) => handleSelectChange("specialty", value)}
                required
              >
                <SelectTrigger id="specialty" className="col-span-3">
                  <SelectValue placeholder="Select specialty" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bio" className="text-right">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className="col-span-3"
                rows={3}
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Availability</Label>
              <div className="col-span-3 space-y-2">
                <div className="flex flex-wrap gap-2">
                  {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
                    <Button
                      key={day}
                      type="button"
                      variant={formData.availableDays.includes(day) ? "default" : "outline"}
                      className="capitalize"
                      onClick={() => {
                        if (formData.availableDays.includes(day)) {
                          setFormData(prev => ({
                            ...prev,
                            availableDays: prev.availableDays.filter(d => d !== day)
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            availableDays: [...prev.availableDays, day]
                          }));
                        }
                      }}
                    >
                      {day.substring(0, 3)}
                    </Button>
                  ))}
                </div>
                
                <div className="flex gap-4 mt-2">
                  <div className="flex-1">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      name="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      name="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Doctor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
