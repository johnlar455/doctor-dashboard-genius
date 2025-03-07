
import React from "react";
import { useAppointmentData } from "./appointments/useAppointmentData";
import { AppointmentStatusChart } from "./appointments/AppointmentStatusChart";
import { AppointmentTimeChart } from "./appointments/AppointmentTimeChart";
import { AppointmentTrendChart } from "./appointments/AppointmentTrendChart";
import { LoadingState } from "./shared/LoadingState";
import { DateRange } from "./utils/dateUtils";

interface AppointmentStatisticsProps {
  dateRange: DateRange;
}

export const AppointmentStatistics: React.FC<AppointmentStatisticsProps> = ({ dateRange }) => {
  const { loading, statusData, timeData, appointmentTrends } = useAppointmentData(dateRange);

  if (loading) {
    return <LoadingState message="Loading appointment statistics..." />;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <AppointmentStatusChart statusData={statusData} />
        <AppointmentTimeChart timeData={timeData} />
      </div>
      <AppointmentTrendChart trendData={appointmentTrends} />
    </div>
  );
};
