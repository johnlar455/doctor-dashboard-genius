
import React from "react";
import { useDoctorPerformanceData } from "./doctors/useDoctorPerformanceData";
import { AppointmentsChart } from "./doctors/AppointmentsChart";
import { ConsultationDurationChart } from "./doctors/ConsultationDurationChart";
import { FeedbackRadarChart } from "./doctors/FeedbackRadarChart";
import { DoctorPerformanceTable } from "./doctors/DoctorPerformanceTable";
import { LoadingState } from "./shared/LoadingState";
import { DateRange } from "./utils/dateUtils";

interface DoctorPerformanceAnalyticsProps {
  dateRange: DateRange;
}

export const DoctorPerformanceAnalytics: React.FC<DoctorPerformanceAnalyticsProps> = ({ dateRange }) => {
  const { 
    loading, 
    doctors, 
    selectedDoctor, 
    appointmentCounts, 
    feedbackData, 
    feedbackRadarData, 
    handleDoctorSelect 
  } = useDoctorPerformanceData(dateRange);

  if (loading) {
    return <LoadingState message="Loading doctor performance data..." />;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <AppointmentsChart appointmentCounts={appointmentCounts} />
        <ConsultationDurationChart appointmentCounts={appointmentCounts} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <FeedbackRadarChart 
          feedbackRadarData={feedbackRadarData} 
          doctorName={feedbackData[selectedDoctor]?.doctorName || 'selected doctor'} 
        />
        <DoctorPerformanceTable 
          feedbackData={feedbackData} 
          appointmentCounts={appointmentCounts} 
          doctors={doctors} 
          selectedDoctor={selectedDoctor} 
          onDoctorSelect={handleDoctorSelect} 
        />
      </div>
    </div>
  );
};
