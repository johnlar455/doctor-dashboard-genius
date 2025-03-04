
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { format, parseISO } from "date-fns";

interface MedicalRecordsTabProps {
  medicalRecords: any[];
}

export const MedicalRecordsTab: React.FC<MedicalRecordsTabProps> = ({ medicalRecords }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Medical Records</h3>
        <Button size="sm">
          <FileText size={16} className="mr-2" />
          Add Record
        </Button>
      </div>
      
      {medicalRecords.length > 0 ? (
        <div className="space-y-4">
          {medicalRecords.map((record, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base">{record.type}</CardTitle>
                  <Badge variant="outline">{formatDate(record.date)}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p>{record.description}</p>
                {record.prescriptions && record.prescriptions.length > 0 && (
                  <div className="mt-3">
                    <div className="font-semibold text-sm mb-1">Prescriptions:</div>
                    <ul className="list-disc pl-5">
                      {record.prescriptions.map((med: string, i: number) => (
                        <li key={i} className="text-sm">{med}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No medical records found for this patient.
        </div>
      )}
    </div>
  );
};
