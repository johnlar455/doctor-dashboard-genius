
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

const Reports = () => {
  const [dateRange, setDateRange] = useState<"week" | "month" | "quarter" | "year">("month");

  const handleExport = (format: "pdf" | "csv") => {
    toast.success(`Report exported as ${format.toUpperCase()} successfully`);
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
        
        <Tabs defaultValue="appointments" className="w-full">
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
