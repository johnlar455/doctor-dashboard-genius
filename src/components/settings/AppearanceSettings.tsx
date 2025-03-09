
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Sun, 
  Moon, 
  Monitor, 
  Palette, 
  Type, 
  ZoomIn, 
  CornerRightDown,
  Check 
} from "lucide-react";

export const AppearanceSettings = () => {
  const { toast } = useToast();
  const [theme, setTheme] = useState("system");
  const [settings, setSettings] = useState({
    reduceMotion: false,
    highContrast: false,
    largeText: false,
    fontFamily: "inter",
    accentColor: "blue",
  });

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    // In a real app, this would apply the theme to the application
  };

  const handleSave = () => {
    // In a real app, this would send to the database and apply settings
    toast({
      title: "Appearance settings saved",
      description: "Your display preferences have been updated",
    });
  };

  const applyChange = (key: keyof typeof settings, value: any) => {
    setSettings({
      ...settings,
      [key]: value,
    });
    // In a real app, this would apply the setting immediately
  };

  const accentColors = [
    { name: "Blue", value: "blue", class: "bg-blue-500" },
    { name: "Green", value: "green", class: "bg-green-500" },
    { name: "Purple", value: "purple", class: "bg-purple-500" },
    { name: "Orange", value: "orange", class: "bg-orange-500" },
    { name: "Red", value: "red", class: "bg-red-500" },
    { name: "Gray", value: "gray", class: "bg-gray-500" },
  ];

  const fonts = [
    { name: "Inter", value: "inter" },
    { name: "Roboto", value: "roboto" },
    { name: "SF Pro", value: "sf-pro" },
    { name: "Open Sans", value: "open-sans" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance & Accessibility</CardTitle>
        <CardDescription>
          Customize the display and accessibility settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <h3 className="text-lg font-medium mb-3">Theme</h3>
          <div className="grid grid-cols-3 gap-4">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              className="flex flex-col items-center justify-center gap-2 h-24"
              onClick={() => handleThemeChange("light")}
            >
              <Sun className="h-6 w-6" />
              <span>Light</span>
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              className="flex flex-col items-center justify-center gap-2 h-24"
              onClick={() => handleThemeChange("dark")}
            >
              <Moon className="h-6 w-6" />
              <span>Dark</span>
            </Button>
            <Button
              variant={theme === "system" ? "default" : "outline"}
              className="flex flex-col items-center justify-center gap-2 h-24"
              onClick={() => handleThemeChange("system")}
            >
              <Monitor className="h-6 w-6" />
              <span>System</span>
            </Button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">Accent Color</h3>
          <div className="grid grid-cols-6 gap-3">
            {accentColors.map((color) => (
              <button
                key={color.value}
                className={`relative w-full aspect-square rounded-full ${color.class}`}
                onClick={() => applyChange("accentColor", color.value)}
              >
                {settings.accentColor === color.value && (
                  <Check className="absolute inset-0 m-auto text-white h-5 w-5" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">Font Family</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {fonts.map((font) => (
              <button
                key={font.value}
                className={`px-4 py-3 rounded-md border ${
                  settings.fontFamily === font.value
                    ? "border-primary bg-primary/10"
                    : "border-gray-200"
                }`}
                onClick={() => applyChange("fontFamily", font.value)}
              >
                {font.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">Accessibility</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ZoomIn className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="largeText" className="text-base">
                    Larger Text
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Increase the text size throughout the application
                  </p>
                </div>
              </div>
              <Switch
                id="largeText"
                checked={settings.largeText}
                onCheckedChange={(checked) => applyChange("largeText", checked)}
              />
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="highContrast" className="text-base">
                    High Contrast
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Increase contrast for better readability
                  </p>
                </div>
              </div>
              <Switch
                id="highContrast"
                checked={settings.highContrast}
                onCheckedChange={(checked) => applyChange("highContrast", checked)}
              />
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <CornerRightDown className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="reduceMotion" className="text-base">
                    Reduce Motion
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Minimize animations and transitions
                  </p>
                </div>
              </div>
              <Switch
                id="reduceMotion"
                checked={settings.reduceMotion}
                onCheckedChange={(checked) => applyChange("reduceMotion", checked)}
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-end">
            <Button onClick={handleSave}>Save Preferences</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
