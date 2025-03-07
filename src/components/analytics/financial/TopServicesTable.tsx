
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, TrendingDown } from "lucide-react";

interface TopService {
  service: string;
  appointments: number;
  revenue: number;
  growth: number;
}

interface TopServicesTableProps {
  topServicesData: TopService[];
  formatCurrency: (value: number) => string;
}

export const TopServicesTable: React.FC<TopServicesTableProps> = ({ 
  topServicesData, 
  formatCurrency 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Revenue Services</CardTitle>
        <CardDescription>
          Services generating the most revenue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Appointments</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Growth</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topServicesData.map((service, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{service.service}</TableCell>
                <TableCell>{service.appointments}</TableCell>
                <TableCell>{formatCurrency(service.revenue)}</TableCell>
                <TableCell>
                  <div className={`flex items-center ${service.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {service.growth >= 0 ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    )}
                    {Math.abs(service.growth)}%
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
