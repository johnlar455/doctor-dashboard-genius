
import React from "react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash } from "lucide-react";
import { PatientData, mockPatients } from "@/data/patients";

interface PatientListProps {
  searchQuery: string;
  onSelectPatient: (id: string) => void;
  selectedPatientId: string | null;
}

export const PatientList: React.FC<PatientListProps> = ({ 
  searchQuery, 
  onSelectPatient,
  selectedPatientId
}) => {
  const filteredPatients = mockPatients.filter(patient => {
    const searchLower = searchQuery.toLowerCase();
    return (
      patient.name.toLowerCase().includes(searchLower) ||
      patient.email.toLowerCase().includes(searchLower) ||
      patient.phone.includes(searchQuery) ||
      patient.id.includes(searchQuery)
    );
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Contact Info</TableHead>
            <TableHead>Last Visit</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPatients.length > 0 ? (
            filteredPatients.map((patient) => (
              <TableRow 
                key={patient.id}
                className={selectedPatientId === patient.id ? "bg-muted/50" : ""}
                onClick={() => onSelectPatient(patient.id)}
              >
                <TableCell className="font-medium">
                  <div>
                    <div>{patient.name}</div>
                    <div className="text-sm text-muted-foreground">
                      ID: {patient.id} • {patient.age} y/o {patient.gender}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{patient.email}</div>
                    <div>{patient.phone}</div>
                  </div>
                </TableCell>
                <TableCell>{patient.lastVisit}</TableCell>
                <TableCell>
                  <Badge variant={patient.status === "Active" ? "default" : "outline"}>
                    {patient.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPatient(patient.id);
                      }}
                    >
                      <Eye size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Edit function would go here
                      }}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Delete function would go here
                      }}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                No patients found matching your search criteria.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
