
import React, { useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

interface DashboardLayoutProps {
  children: React.ReactNode;
  requiredRoles?: ("admin" | "doctor" | "nurse" | "staff")[];
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children,
  requiredRoles = []
}) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  // Ensure unauthenticated users are redirected to auth page
  useEffect(() => {
    if (!loading && !session) {
      navigate("/auth");
    }
  }, [session, loading, navigate]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Show loading state if auth is still being checked
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

  // Redirect to auth page if not authenticated
  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <ProtectedRoute requiredRoles={requiredRoles}>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar isOpen={sidebarOpen} />
        
        <div className="flex flex-col flex-1 overflow-hidden">
          <TopBar toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
          
          <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="animate-fade-in">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};
