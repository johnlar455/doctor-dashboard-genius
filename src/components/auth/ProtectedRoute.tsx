import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

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
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Only check authorization when loading is complete
    if (!loading) {
      console.log("ProtectedRoute auth check:", { session, profile, requiredRoles });
      
      // If not authenticated, redirect to auth page
      if (!session) {
        console.log("No session, redirecting to auth page");
        setIsAuthorized(false);
        navigate("/auth");
        return;
      }
      
      // If roles are specified and user doesn't have one of the required roles
      if (
        requiredRoles.length > 0 && 
        profile &&
        !requiredRoles.includes(profile.role)
      ) {
        console.log("Insufficient permissions:", profile.role, "not in", requiredRoles);
        // Show insufficient permissions toast
        toast.error("Insufficient permissions to access this page");
        // Redirect to dashboard
        setIsAuthorized(false);
        navigate("/");
        return;
      }
      
      // User is authorized
      setIsAuthorized(true);
    }
  }, [session, profile, loading, navigate, requiredRoles]);
  
  // Show loading state while checking authentication
  if (loading || isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  // If not authorized, don't render children (should've been redirected)
  if (!isAuthorized) {
    return null;
  }
  
  // Otherwise, render the children
  return <>{children}</>;
};
