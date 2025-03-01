
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clipboard, 
  FileText, 
  Activity, 
  Calendar,
  Edit,
  User
} from "lucide-react";
import { mockPatients, mockMedicalRecords, mockAppointments } from "@/data/patients";

interface PatientDetailsProps {
  patientId: string;
}

export const PatientDetails: React.FC<PatientDetailsProps> = ({ patientId }) => {
  const [activeTab, setActiveTab] = useState("profile");
  
  const patient = mockPatients.find(p => p.id === patientId);
  const medicalRecords = mockMedicalRecords.filter(record => record.patientId === patientId);
  const appointments = mockAppointments.filter(apt => apt.patientId === patientId);

  if (!patient) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">Patient not found</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{patient.name}</CardTitle>
              <CardDescription>
                Patient ID: {patient.id} • {patient.age} years old • {patient.gender}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge variant={patient.status === "Active" ? "default" : "outline"}>
                {patient.status}
              </Badge>
              <Button variant="outline" size="sm">
                <Edit size={16} className="mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="profile">
                <User size={16} className="mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="medical">
                <Clipboard size={16} className="mr-2" />
                Medical Records
              </TabsTrigger>
              <TabsTrigger value="visits">
                <Activity size={16} className="mr-2" />
                Visit History
              </TabsTrigger>
              <TabsTrigger value="appointments">
                <Calendar size={16} className="mr-2" />
                Appointments
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Personal Information</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2">
                      <div className="text-muted-foreground">Full Name</div>
                      <div>{patient.name}</div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="text-muted-foreground">Date of Birth</div>
                      <div>{patient.dateOfBirth}</div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="text-muted-foreground">Gender</div>
                      <div>{patient.gender}</div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="text-muted-foreground">Blood Type</div>
                      <div>{patient.bloodType}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2">
                      <div className="text-muted-foreground">Email</div>
                      <div>{patient.email}</div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="text-muted-foreground">Phone</div>
                      <div>{patient.phone}</div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="text-muted-foreground">Address</div>
                      <div>{patient.address}</div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="text-muted-foreground">Emergency Contact</div>
                      <div>{patient.emergencyContact}</div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="medical" className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Medical Records</h3>
                <Button size="sm">
                  <FileText size={16} className="mr-2" />
                  Add Record
                </Button>
              </div>
              
              {medicalRecords.length > 0 ? (
                <div className="space-y-4">
                  {medicalRecords.map((record, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">{record.type}</CardTitle>
                          <Badge variant="outline">{record.date}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p>{record.description}</p>
                        {record.prescriptions && (
                          <div className="mt-3">
                            <div className="font-semibold text-sm mb-1">Prescriptions:</div>
                            <ul className="list-disc pl-5">
                              {record.prescriptions.map((med, i) => (
                                <li key={i} className="text-sm">{med}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No medical records found for this patient.
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="visits" className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Visit History</h3>
              </div>
              
              {appointments.filter(apt => apt.status === "completed").length > 0 ? (
                <div className="space-y-4">
                  {appointments
                    .filter(apt => apt.status === "completed")
                    .map((visit, index) => (
                      <Card key={index}>
                        <CardContent className="py-4">
                          <div className="flex justify-between mb-2">
                            <div className="font-medium">{visit.date} - {visit.time}</div>
                            <Badge variant="outline">{visit.type}</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">
                            <span className="font-medium">Doctor:</span> {visit.doctorName}
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Notes:</span> {visit.notes || "No notes available"}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No past visits found for this patient.
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="appointments" className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Appointments</h3>
                <Button size="sm">
                  <Calendar size={16} className="mr-2" />
                  Schedule Appointment
                </Button>
              </div>
              
              {appointments.filter(apt => apt.status !== "completed").length > 0 ? (
                <div className="space-y-4">
                  {appointments
                    .filter(apt => apt.status !== "completed")
                    .map((appointment, index) => (
                      <Card key={index}>
                        <CardContent className="py-4">
                          <div className="flex justify-between mb-2">
                            <div className="font-medium">{appointment.date} - {appointment.time}</div>
                            <Badge 
                              variant={appointment.status === "confirmed" ? "default" : "outline"}
                            >
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">
                            <span className="font-medium">Doctor:</span> {appointment.doctorName}
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Reason:</span> {appointment.type}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No upcoming appointments for this patient.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
