
import React from "react";
import { BellIcon, Menu, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface TopBarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ toggleSidebar, isSidebarOpen }) => {
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
          
          <div className="flex items-center space-x-2">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium">Dr. Alex Smith</p>
              <p className="text-xs text-muted-foreground">Cardiologist</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="font-medium text-sm text-primary">AS</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
