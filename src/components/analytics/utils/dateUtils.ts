
import { subMonths, subWeeks, subQuarters, subYears } from "date-fns";

export type DateRange = "week" | "month" | "quarter" | "year";

export const getStartDate = (dateRange: DateRange): Date => {
  const currentDate = new Date();
  
  switch (dateRange) {
    case "week":
      return subWeeks(currentDate, 1);
    case "month":
      return subMonths(currentDate, 1);
    case "quarter":
      return subQuarters(currentDate, 1);
    case "year":
      return subYears(currentDate, 1);
  }
};

export const subDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
};
