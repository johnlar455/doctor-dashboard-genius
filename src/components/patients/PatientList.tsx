
import React, { useState, useEffect } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface PatientData {
  id: string;
  name: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  address: string | null;
  date_of_birth: string;
  blood_type: string | null;
  emergency_contact: string | null;
  status: string;
  last_visit: string | null;
}

interface PatientListProps {
  searchQuery: string;
  onSelectPatient: (id: string) => void;
  selectedPatientId: string | null;
  onEditPatient?: (patient: PatientData) => void;
  statusFilter?: string;
  refreshTrigger?: number;
}

export const PatientList: React.FC<PatientListProps> = ({ 
  searchQuery, 
  onSelectPatient,
  selectedPatientId,
  onEditPatient,
  statusFilter = "all",
  refreshTrigger = 0
}) => {
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch patients from Supabase
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('patients')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPatients(data as PatientData[]);
      } catch (err) {
        console.error('Error fetching patients:', err);
        setError('Failed to load patients. Please try again later.');
        toast({
          title: 'Error',
          description: 'Failed to load patients. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [toast, refreshTrigger]); // Added refreshTrigger to the dependency array

  // Filter patients based on search query and status filter
  const filteredPatients = patients.filter(patient => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = (
      patient.name.toLowerCase().includes(searchLower) ||
      patient.email.toLowerCase().includes(searchLower) ||
      patient.phone.includes(searchQuery) ||
      patient.id.includes(searchQuery)
    );
    
    // Apply status filter if it's not set to "all"
    const matchesStatus = statusFilter === "all" || patient.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Handle patient deletion
  const confirmDelete = (id: string) => {
    setPatientToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeletePatient = async () => {
    if (!patientToDelete) return;
    
    try {
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', patientToDelete);

      if (error) throw error;

      setPatients(patients.filter(patient => patient.id !== patientToDelete));
      toast({
        title: 'Patient deleted',
        description: 'Patient has been successfully removed.',
      });
    } catch (err) {
      console.error('Error deleting patient:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete patient. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
      setPatientToDelete(null);
    }
  };

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading patients...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <>
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
                >
                  <TableCell className="font-medium">
                    <div>
                      <div>{patient.name}</div>
                      <div className="text-sm text-muted-foreground">
                        ID: {patient.id.substring(0, 8)}... • {patient.age} y/o {patient.gender}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{patient.email}</div>
                      <div>{patient.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(patient.last_visit)}</TableCell>
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
                          if (onEditPatient) onEditPatient(patient);
                        }}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmDelete(patient.id);
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
                  {patients.length === 0 ? "No patients found. Add your first patient!" : "No patients found matching your search criteria."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the patient
              and all related medical records from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePatient} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
