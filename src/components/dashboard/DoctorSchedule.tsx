
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ScheduleItem {
  id: string;
  time: string;
  patientName: string;
  patientAvatar?: string;
  patientInitials: string;
  type: string;
  status: "available" | "busy" | "break";
}

interface DoctorScheduleProps {
  schedule: ScheduleItem[];
  className?: string;
}

export const DoctorSchedule: React.FC<DoctorScheduleProps> = ({ schedule, className }) => {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3">
        <CardTitle>Today's Schedule</CardTitle>
        <CardDescription>Your appointments for today</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {schedule.map((item) => (
            <div key={item.id} className="relative flex">
              <div className="flex flex-col items-center mr-4">
                <div className="flex-none w-14 text-sm font-medium text-muted-foreground">
                  {item.time}
                </div>
                <div className={cn(
                  "mt-1 h-12 w-px",
                  item.status === "available" ? "bg-green-400" :
                  item.status === "busy" ? "bg-primary" : "bg-amber-400"
                )} />
              </div>
              
              <div className={cn(
                "flex-1 p-3 rounded-lg",
                item.status === "available" ? "bg-green-50 border border-green-200" :
                item.status === "busy" ? "bg-primary/10 border border-primary/30" : 
                "bg-amber-50 border border-amber-200"
              )}>
                {item.status === "available" ? (
                  <div className="text-sm font-medium text-green-700">Available</div>
                ) : item.status === "break" ? (
                  <div className="text-sm font-medium text-amber-700">Break Time</div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10 border border-border">
                      <AvatarImage src={item.patientAvatar} alt={item.patientName} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {item.patientInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">{item.patientName}</div>
                      <div className="text-xs text-muted-foreground">{item.type}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
