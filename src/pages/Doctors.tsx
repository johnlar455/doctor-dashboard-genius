
import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DoctorList } from "@/components/doctors/DoctorList";
import { DoctorCalendar } from "@/components/doctors/DoctorCalendar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddDoctorDialog } from "@/components/doctors/AddDoctorDialog";
import { useToast } from "@/components/ui/use-toast";

const Doctors = () => {
  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false);
  const { toast } = useToast();

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
            <Plus size={16} />
            <span>Add Doctor</span>
          </Button>
        </div>
        
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-[400px] grid-cols-2">
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="mt-6">
            <DoctorList />
          </TabsContent>
          <TabsContent value="calendar" className="mt-6">
            <DoctorCalendar />
          </TabsContent>
        </Tabs>
      </div>

      <AddDoctorDialog 
        open={isAddDoctorOpen} 
        onOpenChange={setIsAddDoctorOpen} 
        onSuccess={() => {
          toast({
            title: "Doctor added successfully",
            description: "The doctor profile has been created."
          });
        }}
      />
    </DashboardLayout>
  );
};

export default Doctors;
