
import React from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
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
  );
};
