
import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, Activity, CreditCard, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { AppointmentStatistics } from "@/components/analytics/AppointmentStatistics";
import { PatientDemographics } from "@/components/analytics/PatientDemographics";
import { DoctorPerformanceAnalytics } from "@/components/analytics/DoctorPerformanceAnalytics";
import { FinancialInsights } from "@/components/analytics/FinancialInsights";
import { toast } from "sonner";
import { DateRange } from "@/components/analytics/utils/dateUtils";

const Analytics = () => {
  const [dateRange, setDateRange] = useState<DateRange>("month");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Analytics data refreshed successfully");
    }, 1000);
  };

  const handleExport = (format: "pdf" | "csv") => {
    toast.success(`Exporting analytics data as ${format.toUpperCase()}`);
    // Implementation would connect to a PDF generation service or create CSV
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Comprehensive insights into clinic performance and metrics
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select
              defaultValue={dateRange}
              onValueChange={(value) => setDateRange(value as DateRange)}
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
            <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleExport("pdf")}>
                <Download size={16} className="mr-2" />
                PDF
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport("csv")}>
                <Download size={16} className="mr-2" />
                CSV
              </Button>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="appointments" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="appointments">
              <Calendar className="h-4 w-4 mr-2" />
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
            <TabsTrigger value="financial">
              <CreditCard className="h-4 w-4 mr-2" />
              Financial
            </TabsTrigger>
          </TabsList>
          <TabsContent value="appointments" className="space-y-4 mt-6">
            <AppointmentStatistics dateRange={dateRange} />
          </TabsContent>
          <TabsContent value="patients" className="space-y-4 mt-6">
            <PatientDemographics dateRange={dateRange} />
          </TabsContent>
          <TabsContent value="doctors" className="space-y-4 mt-6">
            <DoctorPerformanceAnalytics dateRange={dateRange} />
          </TabsContent>
          <TabsContent value="financial" className="space-y-4 mt-6">
            <FinancialInsights dateRange={dateRange} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
