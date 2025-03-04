
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Clipboard, 
  FileText, 
  Activity, 
  Calendar,
  User
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Import component parts
import { PatientHeader } from "./details/PatientHeader";
import { ProfileTab } from "./details/ProfileTab";
import { MedicalRecordsTab } from "./details/MedicalRecordsTab";
import { VisitsTab } from "./details/VisitsTab";
import { AppointmentsTab } from "./details/AppointmentsTab";
import { LoadingState } from "./details/LoadingState";
import { ErrorState } from "./details/ErrorState";

interface PatientDetailsProps {
  patientId: string;
  onEditPatient?: (patient: any) => void;
  refreshTrigger?: number;
}

export const PatientDetails: React.FC<PatientDetailsProps> = ({ 
  patientId, 
  onEditPatient,
  refreshTrigger = 0
}) => {
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
  }, [patientId, toast, refreshTrigger]);

  if (loading) {
    return <LoadingState />;
  }

  if (error || !patient) {
    return <ErrorState message={error || 'Patient not found'} />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <PatientHeader patient={patient} onEditPatient={onEditPatient || (() => {})} />
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
              <ProfileTab patient={patient} />
            </TabsContent>
            
            <TabsContent value="medical" className="space-y-6">
              <MedicalRecordsTab medicalRecords={medicalRecords} />
            </TabsContent>
            
            <TabsContent value="visits" className="space-y-6">
              <VisitsTab />
            </TabsContent>
            
            <TabsContent value="appointments" className="space-y-6">
              <AppointmentsTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
