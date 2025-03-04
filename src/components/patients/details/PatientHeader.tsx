
import React from "react";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

interface PatientHeaderProps {
  patient: any;
  onEditPatient: (patient: any) => void;
}

export const PatientHeader: React.FC<PatientHeaderProps> = ({ 
  patient, 
  onEditPatient 
}) => {
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = patient.date_of_birth ? calculateAge(patient.date_of_birth) : patient.age;

  return (
    <div className="flex justify-between items-start">
      <div>
        <CardTitle className="text-2xl">{patient.name}</CardTitle>
        <CardDescription>
          Patient ID: {patient.id.substring(0, 8)}... • {age} years old • {patient.gender}
        </CardDescription>
      </div>
      <div className="flex gap-2">
        <Badge variant={patient.status === "Active" ? "default" : "outline"}>
          {patient.status}
        </Badge>
        <Button variant="outline" size="sm" onClick={() => onEditPatient(patient)}>
          <Edit size={16} className="mr-2" />
          Edit Profile
        </Button>
      </div>
    </div>
  );
};
