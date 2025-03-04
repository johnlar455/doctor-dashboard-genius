
import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PatientList } from "@/components/patients/PatientList";
import { PatientDetails } from "@/components/patients/PatientDetails";
import { AddPatientDialog } from "@/components/patients/AddPatientDialog";
import { useToast } from "@/hooks/use-toast";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Patients = () => {
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("list");
  const [editPatient, setEditPatient] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleAddPatientSuccess = () => {
    toast({
      title: "Success",
      description: editPatient 
        ? "The patient profile has been updated." 
        : "The patient profile has been created.",
    });
    setEditPatient(null);
    // Refresh patient list by forcing a re-render
    setSearchQuery(prev => prev + " ");
    setTimeout(() => {
      setSearchQuery(prev => prev.trim());
    }, 10);
  };

  const handleEditPatient = (patient: any) => {
    setEditPatient(patient);
    setIsAddPatientOpen(true);
  };

  const handleSelectPatient = (id: string) => {
    setSelectedPatientId(id);
    setActiveTab("details");
  };

  const handleFilterStatus = (status: string) => {
    setStatusFilter(status);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Patient Records</h1>
            <p className="text-muted-foreground mt-1">
              Manage patient profiles and medical history
            </p>
          </div>
          <Button onClick={() => {
            setEditPatient(null);
            setIsAddPatientOpen(true);
          }}>
            <Plus size={16} />
            <span>Add Patient</span>
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search patients..."
              className="pl-8"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <Filter size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => handleFilterStatus("all")}>
                  All
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterStatus("Active")}>
                  Active
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterStatus("Inactive")}>
                  Inactive
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-[400px] grid-cols-2">
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="details">Patient Details</TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="mt-6">
            <PatientList 
              searchQuery={searchQuery}
              onSelectPatient={handleSelectPatient}
              selectedPatientId={selectedPatientId}
              onEditPatient={handleEditPatient}
            />
          </TabsContent>
          <TabsContent value="details" className="mt-6">
            {selectedPatientId ? (
              <PatientDetails 
                patientId={selectedPatientId} 
                onEditPatient={handleEditPatient}
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center bg-muted/20 rounded-lg border border-dashed">
                <h3 className="text-lg font-medium mb-2">No Patient Selected</h3>
                <p className="text-muted-foreground mb-4">Select a patient from the list view to see their details</p>
                <Button variant="outline" onClick={() => {
                  setEditPatient(null);
                  setIsAddPatientOpen(true);
                }}>
                  <Plus size={16} className="mr-1" />
                  Add New Patient
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <AddPatientDialog 
        open={isAddPatientOpen} 
        onOpenChange={setIsAddPatientOpen} 
        onSuccess={handleAddPatientSuccess}
        editPatient={editPatient}
      />
    </DashboardLayout>
  );
};

export default Patients;
