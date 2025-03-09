import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: ("admin" | "doctor" | "nurse" | "staff")[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRoles = [] 
}) => {
  const { session, profile, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading) {
      // If not authenticated, redirect to auth page
      if (!session) {
        navigate("/auth");
        return;
      }
      
      // If roles are specified and user doesn't have one of the required roles
      if (
        requiredRoles.length > 0 && 
        profile &&
        !requiredRoles.includes(profile.role)
      ) {
        // Redirect to dashboard with insufficient permissions
        navigate("/");
      }
    }
  }, [session, profile, loading, navigate, requiredRoles]);
  
  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  // If not authenticated, don't render children
  if (!session) {
    return null;
  }
  
  // If roles are specified and user doesn't have the required role, don't render children
  if (
    requiredRoles.length > 0 && 
    profile && 
    !requiredRoles.includes(profile.role)
  ) {
    return null;
  }
  
  // Otherwise, render the children
  return <>{children}</>;
};
