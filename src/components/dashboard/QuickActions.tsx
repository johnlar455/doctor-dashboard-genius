
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarPlus, Users, UserRound, FileText, MessageSquarePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface QuickAction {
  name: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  onClick: () => void;
  roles?: ("admin" | "doctor" | "nurse" | "staff")[];
}

interface QuickActionsProps {
  className?: string;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ className }) => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  
  const actions: QuickAction[] = [
    {
      name: "New Appointment",
      icon: CalendarPlus,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      onClick: () => navigate("/appointments"),
    },
    {
      name: "Add Patient",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
      onClick: () => navigate("/patients"),
    },
    {
      name: "Doctor Schedule",
      icon: UserRound,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
      onClick: () => navigate("/doctors"),
      roles: ["admin", "doctor"],
    },
    {
      name: "Generate Report",
      icon: FileText,
      color: "text-sky-600",
      bgColor: "bg-sky-100",
      onClick: () => navigate("/reports"),
      roles: ["admin", "doctor"],
    },
    {
      name: "Send Message",
      icon: MessageSquarePlus,
      color: "text-rose-600",
      bgColor: "bg-rose-100",
      onClick: () => toast.success("Message feature coming soon!"),
    },
  ];

  // Filter actions based on user role
  const filteredActions = actions.filter(
    action => !action.roles || (profile && action.roles.includes(profile.role))
  );

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Frequently used actions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {filteredActions.slice(0, 4).map((action) => (
            <Button
              key={action.name}
              variant="outline"
              className="h-auto py-3 px-4 justify-start card-hover"
              onClick={action.onClick}
            >
              <div className={cn("p-2 rounded-md mr-3", action.bgColor)}>
                <action.icon className={cn("h-5 w-5", action.color)} />
              </div>
              <span className="text-sm font-medium">{action.name}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
