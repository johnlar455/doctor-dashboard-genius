
import React from "react";
import { usePatientData } from "./patients/usePatientData";
import { AgeDistributionChart } from "./patients/AgeDistributionChart";
import { GenderDistributionChart } from "./patients/GenderDistributionChart";
import { VisitFrequencyChart } from "./patients/VisitFrequencyChart";
import { FrequentPatientsTable } from "./patients/FrequentPatientsTable";
import { LoadingState } from "./shared/LoadingState";
import { DateRange } from "./utils/dateUtils";

interface PatientDemographicsProps {
  dateRange: DateRange;
}

export const PatientDemographics: React.FC<PatientDemographicsProps> = ({ dateRange }) => {
  const { loading, ageData, genderData, visitFrequencyData, frequentPatients } = usePatientData(dateRange);

  if (loading) {
    return <LoadingState message="Loading patient demographics..." />;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <AgeDistributionChart ageData={ageData} />
        <GenderDistributionChart genderData={genderData} />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <VisitFrequencyChart frequencyData={visitFrequencyData} />
        <FrequentPatientsTable patients={frequentPatients} />
      </div>
    </div>
  );
};
