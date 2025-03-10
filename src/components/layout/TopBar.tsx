
import React, { useEffect } from "react";
import { BellIcon, Menu, Search, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface TopBarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ toggleSidebar, isSidebarOpen }) => {
  const { profile, user, signOut } = useAuth();
  
  useEffect(() => {
    // Debug logging to see what profile data we have
    if (user && !profile) {
      console.log("User is logged in but profile is missing", user);
      // Attempt to refetch profile if missing
      const fetchProfile = async () => {
        try {
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();
            
          if (error) {
            console.error("Error fetching profile in TopBar:", error);
          } else {
            console.log("Profile data in TopBar:", data);
          }
        } catch (error) {
          console.error("Unexpected error fetching profile in TopBar:", error);
        }
      };
      
      fetchProfile();
    }
  }, [user, profile]);
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Successfully signed out");
    } catch (error) {
      toast.error("Error signing out");
    }
  };
  
  // Format user initials
  const getUserInitials = () => {
    if (!profile?.full_name) {
      // If we have a user email but no profile name, use the first letter of the email
      if (user?.email) {
        return user.email.charAt(0).toUpperCase();
      }
      return "U";
    }
    
    const nameParts = profile.full_name.split(" ");
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
    }
    
    return nameParts[0].substring(0, 2).toUpperCase();
  };
  
  // Format user role with proper capitalization
  const formatRole = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };
  
  // Get user display name
  const getUserName = () => {
    if (profile?.full_name) {
      return profile.full_name;
    }
    if (user?.email) {
      // If no name, use email as fallback
      return user.email.split('@')[0]; // Use part before @
    }
    return "User";
  };

  return (
    <header className="h-16 border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-30">
      <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="lg:hidden"
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isSidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
          
          <div className="relative max-w-md hidden sm:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full pl-9 bg-background rounded-lg border-muted"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Button variant="ghost" size="icon" className="relative">
              <BellIcon className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">3</Badge>
            </Button>
          </div>
          
          <div className="h-8 w-px bg-border" />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium">{getUserName()}</p>
                  <p className="text-xs text-muted-foreground">
                    {profile ? formatRole(profile.role) : user ? "User" : "Guest"}
                  </p>
                </div>
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-medium text-sm text-primary">{getUserInitials()}</span>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => toast.info("Profile settings coming soon")}>
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
