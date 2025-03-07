
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface FrequentPatient {
  name: string;
  gender: string;
  age: number | string;
  visits: number;
}

interface FrequentPatientsTableProps {
  patients: FrequentPatient[];
}

export const FrequentPatientsTable: React.FC<FrequentPatientsTableProps> = ({ patients }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Most Frequent Patients</CardTitle>
        <CardDescription>
          Patients with highest visit counts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Visits</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{patient.name}</TableCell>
                <TableCell>{patient.gender}</TableCell>
                <TableCell>{patient.age}</TableCell>
                <TableCell>{patient.visits}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
