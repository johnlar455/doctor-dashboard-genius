
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  CalendarDays, 
  Users, 
  UserRound, 
  Settings,
  PieChart,
  Home
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();

  const navigation: NavItem[] = [
    { name: "Dashboard", path: "/", icon: Home },
    { name: "Appointments", path: "/appointments", icon: CalendarDays },
    { name: "Doctors", path: "/doctors", icon: UserRound },
    { name: "Patients", path: "/patients", icon: Users },
    { name: "Reports", path: "/reports", icon: BarChart3 },
    { name: "Analytics", path: "/analytics", icon: PieChart },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-border transition-transform duration-300 ease-in-out transform shadow-sm",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "lg:relative lg:translate-x-0"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center h-16 px-6 border-b border-border">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-white font-semibold text-lg">M</span>
            </div>
            <span className="text-xl font-semibold">MediDash</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 px-3">
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-foreground/70 hover:text-foreground hover:bg-muted"
                  )}
                >
                  <item.icon 
                    className={cn(
                      "mr-3 flex-shrink-0 h-5 w-5", 
                      isActive ? "text-primary" : "text-muted-foreground"
                    )} 
                  />
                  <span>{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-5 bg-primary rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="p-4 border-t border-border">
          <div className="glass rounded-xl p-4 flex items-center space-x-3">
            <div className="relative">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <UserRound className="h-5 w-5 text-primary" />
              </div>
              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Dr. Alex Smith</p>
              <p className="text-xs text-muted-foreground truncate">Cardiologist</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
