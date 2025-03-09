
import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserManagement } from "@/components/settings/UserManagement";
import { SpecialtyManagement } from "@/components/settings/SpecialtyManagement";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { AppearanceSettings } from "@/components/settings/AppearanceSettings";
import { Cog, Users, Stethoscope, Bell, Moon } from "lucide-react";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("user-management");
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account and application settings
          </p>
        </div>
        
        <Tabs 
          defaultValue="user-management" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <TabsTrigger value="user-management" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden md:inline">User Management</span>
              <span className="inline md:hidden">Users</span>
            </TabsTrigger>
            <TabsTrigger value="specialty-management" className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4" />
              <span className="hidden md:inline">Specialties</span>
              <span className="inline md:hidden">Services</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden md:inline">Notifications</span>
              <span className="inline md:hidden">Notify</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Moon className="h-4 w-4" />
              <span className="hidden md:inline">Appearance</span>
              <span className="inline md:hidden">Theme</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="user-management" className="space-y-4">
            <UserManagement />
          </TabsContent>
          
          <TabsContent value="specialty-management" className="space-y-4">
            <SpecialtyManagement />
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <NotificationSettings />
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-4">
            <AppearanceSettings />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
