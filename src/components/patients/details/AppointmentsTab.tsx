
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

export const AppointmentsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Appointments</h3>
        <Button size="sm">
          <Calendar size={16} className="mr-2" />
          Schedule Appointment
        </Button>
      </div>
      
      <div className="text-center py-8 text-muted-foreground">
        No upcoming appointments for this patient.
      </div>
    </div>
  );
};
