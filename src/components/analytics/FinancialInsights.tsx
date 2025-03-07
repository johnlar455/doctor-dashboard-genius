
import React from "react";
import { useFinancialData } from "./financial/useFinancialData";
import { RevenueStatusChart } from "./financial/RevenueStatusChart";
import { ServiceRevenueChart } from "./financial/ServiceRevenueChart";
import { MonthlyRevenueChart } from "./financial/MonthlyRevenueChart";
import { TopServicesTable } from "./financial/TopServicesTable";
import { LoadingState } from "./shared/LoadingState";
import { DateRange } from "./utils/dateUtils";

interface FinancialInsightsProps {
  dateRange: DateRange;
}

export const FinancialInsights: React.FC<FinancialInsightsProps> = ({ dateRange }) => {
  const { 
    loading, 
    revenueData, 
    serviceRevenueData, 
    monthlyRevenueData, 
    topServicesData, 
    formatCurrency 
  } = useFinancialData(dateRange);

  if (loading) {
    return <LoadingState message="Loading financial insights..." />;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <RevenueStatusChart revenueData={revenueData} formatCurrency={formatCurrency} />
        <ServiceRevenueChart serviceRevenueData={serviceRevenueData} formatCurrency={formatCurrency} />
      </div>
      <MonthlyRevenueChart monthlyRevenueData={monthlyRevenueData} formatCurrency={formatCurrency} />
      <TopServicesTable topServicesData={topServicesData} formatCurrency={formatCurrency} />
    </div>
  );
};
