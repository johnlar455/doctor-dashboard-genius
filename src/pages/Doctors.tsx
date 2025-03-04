
import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DoctorList } from "@/components/doctors/DoctorList";
import { DoctorCalendar } from "@/components/doctors/DoctorCalendar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddDoctorDialog } from "@/components/doctors/AddDoctorDialog";
import { useToast } from "@/components/ui/use-toast";
import { Doctor } from "@/types/supabase";
import { supabase } from "@/integrations/supabase/client";

const Doctors = () => {
  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false);
  const [doctorAdded, setDoctorAdded] = useState<boolean>(false);
  const { toast } = useToast();

  const handleDoctorAdded = (doctor: Doctor) => {
    toast({
      title: "Doctor added successfully",
      description: `${doctor.name} has been added to the system.`
    });
    setDoctorAdded(true);
  };

  // Reset the doctorAdded state after it has been handled
  useEffect(() => {
    if (doctorAdded) {
      setDoctorAdded(false);
    }
  }, [doctorAdded]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Doctor Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage doctor profiles and schedules
            </p>
          </div>
          <Button onClick={() => setIsAddDoctorOpen(true)}>
            <Plus size={16} className="mr-1.5" />
            <span>Add Doctor</span>
          </Button>
        </div>
        
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-[400px] grid-cols-2">
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="mt-6">
            <DoctorList key={doctorAdded ? 'refreshed' : 'initial'} />
          </TabsContent>
          <TabsContent value="calendar" className="mt-6">
            <DoctorCalendar />
          </TabsContent>
        </Tabs>
      </div>

      <AddDoctorDialog 
        open={isAddDoctorOpen} 
        onOpenChange={setIsAddDoctorOpen} 
        onSuccess={handleDoctorAdded}
      />
    </DashboardLayout>
  );
};

export default Doctors;
