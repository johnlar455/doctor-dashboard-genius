
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Check, 
  Clock, 
  Calendar as CalendarIcon, 
  MoreVertical,
  UserRound
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type AppointmentStatus = "upcoming" | "completed" | "cancelled";

interface Appointment {
  id: string;
  patientName: string;
  patientAvatar?: string;
  patientInitials: string;
  time: string;
  date: string;
  status: AppointmentStatus;
  type: string;
}

interface AppointmentListProps {
  appointments: Appointment[];
  className?: string;
}

export const AppointmentList: React.FC<AppointmentListProps> = ({ 
  appointments,
  className
}) => {
  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case "upcoming":
        return (
          <Badge variant="outline" className="text-blue-600 border-blue-300 bg-blue-50">
            <Clock className="mr-1 h-3 w-3" />
            Upcoming
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50">
            <Check className="mr-1 h-3 w-3" />
            Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="outline" className="text-red-600 border-red-300 bg-red-50">
            <Clock className="mr-1 h-3 w-3" />
            Cancelled
          </Badge>
        );
    }
  };

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>You have {appointments.length} appointments today</CardDescription>
          </div>
          <Button variant="outline" className="h-8 text-xs">
            View all
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div 
              key={appointment.id} 
              className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10 border border-border">
                  <AvatarImage src={appointment.patientAvatar} alt={appointment.patientName} />
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">
                    {appointment.patientInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{appointment.patientName}</p>
                  <div className="flex items-center mt-1 space-x-2">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <CalendarIcon className="mr-1 h-3 w-3" />
                      {appointment.date}
                    </div>
                    <div className="h-1 w-1 rounded-full bg-muted-foreground" />
                    <div className="text-xs text-muted-foreground">
                      {appointment.time}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {getStatusBadge(appointment.status)}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View details</DropdownMenuItem>
                    <DropdownMenuItem>Reschedule</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Cancel</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
