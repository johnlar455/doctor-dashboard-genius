
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clipboard, 
  FileText, 
  Activity, 
  Calendar,
  Edit,
  User,
  Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from "date-fns";

interface PatientDetailsProps {
  patientId: string;
  onEditPatient?: (patient: any) => void;
}

export const PatientDetails: React.FC<PatientDetailsProps> = ({ patientId, onEditPatient }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [patient, setPatient] = useState<any>(null);
  const [medicalRecords, setMedicalRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchPatientData = async () => {
      setLoading(true);
      try {
        // Fetch patient details
        const { data: patientData, error: patientError } = await supabase
          .from('patients')
          .select('*')
          .eq('id', patientId)
          .single();
        
        if (patientError) throw patientError;
        setPatient(patientData);
        
        // Fetch medical records
        const { data: recordsData, error: recordsError } = await supabase
          .from('medical_records')
          .select('*')
          .eq('patient_id', patientId)
          .order('date', { ascending: false });
        
        if (recordsError) throw recordsError;
        setMedicalRecords(recordsData || []);
        
      } catch (err: any) {
        console.error('Error fetching patient data:', err);
        setError(err.message || 'Failed to load patient data');
        toast({
          title: 'Error',
          description: 'Failed to load patient data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (patientId) {
      fetchPatientData();
    }
  }, [patientId, toast]);

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !patient) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-500">{error || 'Patient not found'}</div>
        </CardContent>
      </Card>
    );
  }

  // Calculate age based on date of birth
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
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
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
              <Button variant="outline" size="sm" onClick={() => onEditPatient && onEditPatient(patient)}>
                <Edit size={16} className="mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="profile">
                <User size={16} className="mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="medical">
                <Clipboard size={16} className="mr-2" />
                Medical Records
              </TabsTrigger>
              <TabsTrigger value="visits">
                <Activity size={16} className="mr-2" />
                Visit History
              </TabsTrigger>
              <TabsTrigger value="appointments">
                <Calendar size={16} className="mr-2" />
                Appointments
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Personal Information</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2">
                      <div className="text-muted-foreground">Full Name</div>
                      <div>{patient.name}</div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="text-muted-foreground">Date of Birth</div>
                      <div>{formatDate(patient.date_of_birth)}</div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="text-muted-foreground">Gender</div>
                      <div>{patient.gender}</div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="text-muted-foreground">Blood Type</div>
                      <div>{patient.blood_type || 'Not specified'}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2">
                      <div className="text-muted-foreground">Email</div>
                      <div>{patient.email}</div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="text-muted-foreground">Phone</div>
                      <div>{patient.phone}</div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="text-muted-foreground">Address</div>
                      <div>{patient.address || 'Not specified'}</div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="text-muted-foreground">Emergency Contact</div>
                      <div>{patient.emergency_contact || 'Not specified'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="medical" className="space-y-6">
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
            </TabsContent>
            
            <TabsContent value="visits" className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Visit History</h3>
              </div>
              
              <div className="text-center py-8 text-muted-foreground">
                No past visits found for this patient.
              </div>
            </TabsContent>
            
            <TabsContent value="appointments" className="space-y-6">
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
