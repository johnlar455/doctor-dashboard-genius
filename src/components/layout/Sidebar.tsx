import React from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  CalendarDays, 
  Users, 
  UserRound, 
  Settings,
  PieChart,
  Home,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
  roles?: ("admin" | "doctor" | "nurse" | "staff")[];
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const navigation: NavItem[] = [
    { name: "Dashboard", path: "/", icon: Home },
    { name: "Appointments", path: "/appointments", icon: CalendarDays },
    { name: "Doctors", path: "/doctors", icon: UserRound, roles: ["admin", "doctor"] },
    { name: "Patients", path: "/patients", icon: Users },
    { name: "Reports", path: "/reports", icon: BarChart3, roles: ["admin", "doctor"] },
    { name: "Analytics", path: "/analytics", icon: PieChart, roles: ["admin"] },
    { name: "Settings", path: "/settings", icon: Settings, roles: ["admin"] },
  ];

  const filteredNavigation = navigation.filter(
    item => !item.roles || (profile && item.roles.includes(profile.role))
  );

  const formatRole = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const getUserInitials = () => {
    if (!profile?.full_name) return "U";
    
    const nameParts = profile.full_name.split(" ");
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
    }
    
    return nameParts[0].substring(0, 2).toUpperCase();
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Successfully signed out");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

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
            {filteredNavigation.map((item) => {
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
          <div className="glass rounded-xl p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="font-medium text-sm text-primary">{getUserInitials()}</span>
                </div>
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {profile?.full_name || "User"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {profile ? formatRole(profile.role) : "Guest"}
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full flex items-center justify-center"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" /> Sign Out
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
};
