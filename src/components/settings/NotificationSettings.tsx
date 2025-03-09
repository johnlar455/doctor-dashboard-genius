
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Check, Info } from "lucide-react";

export const NotificationSettings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("email");
  
  const [emailSettings, setEmailSettings] = useState({
    appointmentReminder: true,
    appointmentConfirmation: true,
    appointmentCancellation: true,
    newDoctorAvailable: false,
    medicalReportAvailable: true,
    marketingEmails: false,
    reminderTime: "24",
  });
  
  const [smsSettings, setSmsSettings] = useState({
    appointmentReminder: true,
    appointmentConfirmation: true,
    appointmentCancellation: true,
    urgentUpdates: true,
    reminderTime: "2",
  });
  
  const [pushSettings, setPushSettings] = useState({
    appointmentReminder: false,
    appointmentChanges: true,
    doctorAvailability: false,
    systemUpdates: true,
  });

  const saveEmailSettings = () => {
    // In a real app, this would send to the database
    toast({
      title: "Email settings saved",
      description: "Your email notification preferences have been updated",
    });
  };

  const saveSmsSettings = () => {
    // In a real app, this would send to the database
    toast({
      title: "SMS settings saved",
      description: "Your SMS notification preferences have been updated",
    });
  };

  const savePushSettings = () => {
    // In a real app, this would send to the database
    toast({
      title: "Push settings saved",
      description: "Your push notification preferences have been updated",
    });
  };
  
  const handleSave = () => {
    if (activeTab === "email") {
      saveEmailSettings();
    } else if (activeTab === "sms") {
      saveSmsSettings();
    } else {
      savePushSettings();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>
          Configure how and when you receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs 
          defaultValue="email" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="sms">SMS</TabsTrigger>
            <TabsTrigger value="push">Push</TabsTrigger>
          </TabsList>
          
          <TabsContent value="email" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b">
                <div>
                  <h3 className="font-medium">Appointment Reminders</h3>
                  <p className="text-sm text-muted-foreground">
                    Email reminder before scheduled appointments
                  </p>
                </div>
                <Switch 
                  checked={emailSettings.appointmentReminder} 
                  onCheckedChange={(checked) => 
                    setEmailSettings({...emailSettings, appointmentReminder: checked})
                  }
                />
              </div>
              
              {emailSettings.appointmentReminder && (
                <div className="ml-6 flex items-center gap-3">
                  <Label htmlFor="reminderTime" className="text-sm">
                    Send reminder
                  </Label>
                  <select
                    id="reminderTime"
                    className="flex h-8 w-24 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={emailSettings.reminderTime}
                    onChange={(e) => setEmailSettings({...emailSettings, reminderTime: e.target.value})}
                  >
                    <option value="1">1 hour</option>
                    <option value="2">2 hours</option>
                    <option value="4">4 hours</option>
                    <option value="12">12 hours</option>
                    <option value="24">24 hours</option>
                    <option value="48">2 days</option>
                  </select>
                  <span className="text-sm">before the appointment</span>
                </div>
              )}
              
              <div className="flex items-center justify-between pb-2 border-b">
                <div>
                  <h3 className="font-medium">Appointment Confirmations</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive confirmation emails when appointments are booked
                  </p>
                </div>
                <Switch 
                  checked={emailSettings.appointmentConfirmation} 
                  onCheckedChange={(checked) => 
                    setEmailSettings({...emailSettings, appointmentConfirmation: checked})
                  }
                />
              </div>
              
              <div className="flex items-center justify-between pb-2 border-b">
                <div>
                  <h3 className="font-medium">Appointment Cancellations</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive emails when appointments are cancelled
                  </p>
                </div>
                <Switch 
                  checked={emailSettings.appointmentCancellation} 
                  onCheckedChange={(checked) => 
                    setEmailSettings({...emailSettings, appointmentCancellation: checked})
                  }
                />
              </div>
              
              <div className="flex items-center justify-between pb-2 border-b">
                <div>
                  <h3 className="font-medium">New Doctor Availability</h3>
                  <p className="text-sm text-muted-foreground">
                    Get notified when new doctors join the practice
                  </p>
                </div>
                <Switch 
                  checked={emailSettings.newDoctorAvailable} 
                  onCheckedChange={(checked) => 
                    setEmailSettings({...emailSettings, newDoctorAvailable: checked})
                  }
                />
              </div>
              
              <div className="flex items-center justify-between pb-2 border-b">
                <div>
                  <h3 className="font-medium">Medical Reports</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive emails when new medical reports are available
                  </p>
                </div>
                <Switch 
                  checked={emailSettings.medicalReportAvailable} 
                  onCheckedChange={(checked) => 
                    setEmailSettings({...emailSettings, medicalReportAvailable: checked})
                  }
                />
              </div>
              
              <div className="flex items-center justify-between pb-2 border-b">
                <div className="flex items-center gap-1">
                  <h3 className="font-medium">Marketing Emails</h3>
                  <Popover>
                    <PopoverTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </PopoverTrigger>
                    <PopoverContent side="top" className="w-80">
                      <p className="text-sm">
                        Marketing emails include newsletters, health tips, and special offers from our clinic. 
                        You can unsubscribe at any time.
                      </p>
                    </PopoverContent>
                  </Popover>
                  <p className="text-sm text-muted-foreground ml-1">
                    Newsletters, health tips and offers
                  </p>
                </div>
                <Switch 
                  checked={emailSettings.marketingEmails} 
                  onCheckedChange={(checked) => 
                    setEmailSettings({...emailSettings, marketingEmails: checked})
                  }
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="sms" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b">
                <div>
                  <h3 className="font-medium">Appointment Reminders</h3>
                  <p className="text-sm text-muted-foreground">
                    SMS reminder before scheduled appointments
                  </p>
                </div>
                <Switch 
                  checked={smsSettings.appointmentReminder} 
                  onCheckedChange={(checked) => 
                    setSmsSettings({...smsSettings, appointmentReminder: checked})
                  }
                />
              </div>
              
              {smsSettings.appointmentReminder && (
                <div className="ml-6 flex items-center gap-3">
                  <Label htmlFor="sms-reminderTime" className="text-sm">
                    Send reminder
                  </Label>
                  <select
                    id="sms-reminderTime"
                    className="flex h-8 w-24 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={smsSettings.reminderTime}
                    onChange={(e) => setSmsSettings({...smsSettings, reminderTime: e.target.value})}
                  >
                    <option value="1">1 hour</option>
                    <option value="2">2 hours</option>
                    <option value="4">4 hours</option>
                    <option value="12">12 hours</option>
                    <option value="24">24 hours</option>
                  </select>
                  <span className="text-sm">before the appointment</span>
                </div>
              )}
              
              <div className="flex items-center justify-between pb-2 border-b">
                <div>
                  <h3 className="font-medium">Appointment Confirmations</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive SMS when appointments are booked
                  </p>
                </div>
                <Switch 
                  checked={smsSettings.appointmentConfirmation} 
                  onCheckedChange={(checked) => 
                    setSmsSettings({...smsSettings, appointmentConfirmation: checked})
                  }
                />
              </div>
              
              <div className="flex items-center justify-between pb-2 border-b">
                <div>
                  <h3 className="font-medium">Appointment Cancellations</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive SMS when appointments are cancelled
                  </p>
                </div>
                <Switch 
                  checked={smsSettings.appointmentCancellation} 
                  onCheckedChange={(checked) => 
                    setSmsSettings({...smsSettings, appointmentCancellation: checked})
                  }
                />
              </div>
              
              <div className="flex items-center justify-between pb-2 border-b">
                <div>
                  <h3 className="font-medium">Urgent Updates</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive urgent notifications via SMS
                  </p>
                </div>
                <Switch 
                  checked={smsSettings.urgentUpdates} 
                  onCheckedChange={(checked) => 
                    setSmsSettings({...smsSettings, urgentUpdates: checked})
                  }
                />
              </div>
              
              <div className="border-t pt-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">Phone Number for SMS</Label>
                  <div className="flex gap-2">
                    <Input id="phone" placeholder="+1 555 123 4567" />
                    <Button variant="outline" size="sm">Verify</Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Standard message and data rates may apply
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="push" className="space-y-6">
            <div className="space-y-4">
              <div className="mb-4 p-4 bg-blue-50 text-blue-800 rounded-md">
                <p className="text-sm">
                  Push notifications require permission from your browser. 
                  Make sure to allow notifications when prompted.
                </p>
              </div>
            
              <div className="flex items-center justify-between pb-2 border-b">
                <div>
                  <h3 className="font-medium">Appointment Reminders</h3>
                  <p className="text-sm text-muted-foreground">
                    Push notification before scheduled appointments
                  </p>
                </div>
                <Switch 
                  checked={pushSettings.appointmentReminder} 
                  onCheckedChange={(checked) => 
                    setPushSettings({...pushSettings, appointmentReminder: checked})
                  }
                />
              </div>
              
              <div className="flex items-center justify-between pb-2 border-b">
                <div>
                  <h3 className="font-medium">Appointment Changes</h3>
                  <p className="text-sm text-muted-foreground">
                    Notifications for any changes to your appointments
                  </p>
                </div>
                <Switch 
                  checked={pushSettings.appointmentChanges} 
                  onCheckedChange={(checked) => 
                    setPushSettings({...pushSettings, appointmentChanges: checked})
                  }
                />
              </div>
              
              <div className="flex items-center justify-between pb-2 border-b">
                <div>
                  <h3 className="font-medium">Doctor Availability</h3>
                  <p className="text-sm text-muted-foreground">
                    Get notified when your preferred doctors have open slots
                  </p>
                </div>
                <Switch 
                  checked={pushSettings.doctorAvailability} 
                  onCheckedChange={(checked) => 
                    setPushSettings({...pushSettings, doctorAvailability: checked})
                  }
                />
              </div>
              
              <div className="flex items-center justify-between pb-2 border-b">
                <div>
                  <h3 className="font-medium">System Updates</h3>
                  <p className="text-sm text-muted-foreground">
                    Notifications about system maintenance and updates
                  </p>
                </div>
                <Switch 
                  checked={pushSettings.systemUpdates} 
                  onCheckedChange={(checked) => 
                    setPushSettings({...pushSettings, systemUpdates: checked})
                  }
                />
              </div>
              
              <div className="mt-4">
                <Button variant="outline" className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Test Push Notification
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end mt-6">
          <Button onClick={handleSave}>Save Settings</Button>
        </div>
      </CardContent>
    </Card>
  );
};
