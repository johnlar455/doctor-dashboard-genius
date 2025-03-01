
import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const Doctors = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Doctor Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage doctor profiles and schedules
          </p>
        </div>
        
        <div className="bg-secondary/50 p-10 rounded-lg text-center animate-scale-in">
          <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
          <p className="text-muted-foreground">
            The doctor management module is under development
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Doctors;
