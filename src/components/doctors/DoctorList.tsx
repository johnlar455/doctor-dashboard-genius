
import React, { useState, useMemo } from "react";
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Doctor, mockDoctors, departments, specialties } from "@/data/doctors";
import { Search, Edit, Trash, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { EditDoctorDialog } from "./EditDoctorDialog";
import { format } from "date-fns";
import { DoctorScheduleDialog } from "./DoctorScheduleDialog";

export const DoctorList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("");
  const [specialtyFilter, setSpecialtyFilter] = useState<string>("");
  const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [viewingSchedule, setViewingSchedule] = useState<Doctor | null>(null);
  const { toast } = useToast();

  const filteredDoctors = useMemo(() => {
    return doctors.filter(doctor => {
      const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           doctor.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDepartment = !departmentFilter || doctor.department === departmentFilter;
      const matchesSpecialty = !specialtyFilter || doctor.specialty === specialtyFilter;

      return matchesSearch && matchesDepartment && matchesSpecialty;
    });
  }, [doctors, searchQuery, departmentFilter, specialtyFilter]);

  const handleDeleteDoctor = (id: string) => {
    setDoctors(doctors.filter(doc => doc.id !== id));
    toast({
      title: "Doctor deleted",
      description: "The doctor profile has been removed successfully.",
    });
  };

  const handleSaveDoctor = (updatedDoctor: Doctor) => {
    setDoctors(doctors.map(doc => doc.id === updatedDoctor.id ? updatedDoctor : doc));
    setEditingDoctor(null);
    toast({
      title: "Doctor updated",
      description: "The doctor profile has been updated successfully.",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search doctors..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 md:w-2/5">
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-departments">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-specialties">All Specialties</SelectItem>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Doctor</TableHead>
                  <TableHead className="hidden md:table-cell">Department</TableHead>
                  <TableHead className="hidden md:table-cell">Specialty</TableHead>
                  <TableHead className="hidden lg:table-cell">Contact</TableHead>
                  <TableHead className="hidden lg:table-cell">Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDoctors.length > 0 ? (
                  filteredDoctors.map((doctor) => (
                    <TableRow key={doctor.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={doctor.avatar} />
                            <AvatarFallback>{getInitials(doctor.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{doctor.name}</div>
                            <div className="text-sm text-muted-foreground md:hidden">
                              {doctor.department} - {doctor.specialty}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline">{doctor.department}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{doctor.specialty}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="text-sm">
                          <div>{doctor.email}</div>
                          <div className="text-muted-foreground">{doctor.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {format(doctor.createdAt, "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => setViewingSchedule(doctor)}
                          >
                            <Calendar className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => setEditingDoctor(doctor)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleDeleteDoctor(doctor.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No doctors found. Try adjusting your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {editingDoctor && (
        <EditDoctorDialog 
          doctor={editingDoctor} 
          open={!!editingDoctor} 
          onOpenChange={(open) => !open && setEditingDoctor(null)}
          onSave={handleSaveDoctor}
        />
      )}

      {viewingSchedule && (
        <DoctorScheduleDialog
          doctor={viewingSchedule}
          open={!!viewingSchedule}
          onOpenChange={(open) => !open && setViewingSchedule(null)}
        />
      )}
    </>
  );
};
