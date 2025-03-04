
import React from "react";

export const VisitsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Visit History</h3>
      </div>
      
      <div className="text-center py-8 text-muted-foreground">
        No past visits found for this patient.
      </div>
    </div>
  );
};
