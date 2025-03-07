
import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppointmentReport } from "@/components/reports/AppointmentReport";
import { PatientReport } from "@/components/reports/PatientReport";
import { DoctorPerformance } from "@/components/reports/DoctorPerformance";
import { FileText, Users, Activity, Download } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Doctor, Patient, DoctorSchedule } from "@/types/supabase";

const Reports = () => {
  const [dateRange, setDateRange] = useState<"week" | "month" | "quarter" | "year">("month");
  const [activeTab, setActiveTab] = useState<"appointments" | "patients" | "doctors">("appointments");

  const handleExport = async (format: "pdf" | "csv") => {
    try {
      if (format === "csv") {
        let data = [];
        let filename = "";
        
        switch (activeTab) {
          case "appointments":
            // Get appointment data from Supabase
            const { data: appointments, error: appointmentsError } = await supabase
              .from("doctor_schedules")
              .select(`
                id, 
                slot_date, 
                start_time, 
                end_time, 
                status, 
                doctor_id, 
                patient_id
              `)
              .order("slot_date", { ascending: false });
            
            if (appointmentsError) throw appointmentsError;
            data = appointments || [];
            filename = "appointments_report.csv";
            break;
            
          case "patients":
            // Get patient data from Supabase
            const { data: patients, error: patientsError } = await supabase
              .from("patients")
              .select("*");
            
            if (patientsError) throw patientsError;
            data = patients || [];
            filename = "patients_report.csv";
            break;
            
          case "doctors":
            // Get doctor data from Supabase
            const { data: doctors, error: doctorsError } = await supabase
              .from("doctors")
              .select("*");
            
            if (doctorsError) throw doctorsError;
            data = doctors || [];
            filename = "doctors_report.csv";
            break;
        }
        
        if (data.length > 0) {
          // Convert data to CSV
          const header = Object.keys(data[0]).join(",");
          const csvRows = data.map(row => 
            Object.values(row).map(value => 
              typeof value === 'object' ? JSON.stringify(value) : String(value)
            ).join(",")
          );
          
          const csvContent = [header, ...csvRows].join("\n");
          
          // Create and download CSV file
          const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.setAttribute("href", url);
          link.setAttribute("download", filename);
          link.style.visibility = "hidden";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          toast.success(`Report exported as CSV successfully`);
        } else {
          toast.error("No data to export");
        }
      } else {
        // PDF export would be more complex, typically using a library like jsPDF
        // For now, let's just show a toast
        toast.info("PDF export coming soon");
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export report");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
            <p className="text-muted-foreground mt-1">
              View and analyze clinic performance and patient data
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select
              defaultValue={dateRange}
              onValueChange={(value) => setDateRange(value as "week" | "month" | "quarter" | "year")}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => handleExport("pdf")}>
                <Download size={16} />
              </Button>
              <Button variant="outline" onClick={() => handleExport("csv")}>
                <Download size={16} className="mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="appointments" className="w-full" onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 md:w-[600px]">
            <TabsTrigger value="appointments">
              <FileText className="h-4 w-4 mr-2" />
              Appointments
            </TabsTrigger>
            <TabsTrigger value="patients">
              <Users className="h-4 w-4 mr-2" />
              Patients
            </TabsTrigger>
            <TabsTrigger value="doctors">
              <Activity className="h-4 w-4 mr-2" />
              Doctor Performance
            </TabsTrigger>
          </TabsList>
          <TabsContent value="appointments" className="space-y-4 mt-6">
            <AppointmentReport dateRange={dateRange} />
          </TabsContent>
          <TabsContent value="patients" className="space-y-4 mt-6">
            <PatientReport dateRange={dateRange} />
          </TabsContent>
          <TabsContent value="doctors" className="space-y-4 mt-6">
            <DoctorPerformance dateRange={dateRange} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
