
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { format, subMonths, subWeeks, subQuarters, subYears, parseISO, startOfMonth, endOfMonth } from "date-fns";
import { Loader2, DollarSign, TrendingUp, TrendingDown, CreditCard } from "lucide-react";

interface FinancialInsightsProps {
  dateRange: "week" | "month" | "quarter" | "year";
}

export const FinancialInsights: React.FC<FinancialInsightsProps> = ({ dateRange }) => {
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [serviceRevenueData, setServiceRevenueData] = useState<any[]>([]);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState<any[]>([]);
  const [topServicesData, setTopServicesData] = useState<any[]>([]);
  
  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Calculate date range
      const currentDate = new Date();
      let startDate;
      
      switch (dateRange) {
        case "week":
          startDate = subWeeks(currentDate, 1);
          break;
        case "month":
          startDate = subMonths(currentDate, 1);
          break;
        case "quarter":
          startDate = subQuarters(currentDate, 1);
          break;
        case "year":
          startDate = subYears(currentDate, 1);
          break;
      }
      
      // Get appointments from Supabase
      // In a real application, this would likely involve a financials or payments table
      const { data: appointments, error } = await supabase
        .from('appointments')
        .select('*')
        .gte('appointment_date', startDate.toISOString());
      
      if (error) throw error;
      
      // Since we don't have actual financial data, we'll generate mock data based on appointments
      
      // Generate revenue data by status
      const generateRevenue = () => {
        // These would be actual fees in a real application
        const consultationFee = 150;
        const followUpFee = 100;
        const specializedFee = 250;
        
        let completedRevenue = 0;
        let cancelledRevenue = 0;
        let upcomingRevenue = 0;
        
        if (appointments) {
          appointments.forEach(appointment => {
            let fee;
            
            // Determine fee based on appointment type
            if (appointment.type?.toLowerCase().includes('follow')) {
              fee = followUpFee;
            } else if (appointment.type?.toLowerCase().includes('special')) {
              fee = specializedFee;
            } else {
              fee = consultationFee;
            }
            
            // Distribute based on appointment status
            if (appointment.status === 'completed') {
              completedRevenue += fee;
            } else if (appointment.status === 'cancelled') {
              // Assuming 20% cancellation fee
              cancelledRevenue += fee * 0.2;
            } else if (appointment.status === 'upcoming') {
              upcomingRevenue += fee;
            }
          });
        }
        
        return [
          { name: 'Completed', value: completedRevenue, color: '#10b981' },
          { name: 'Cancelled', value: cancelledRevenue, color: '#ef4444' },
          { name: 'Scheduled', value: upcomingRevenue, color: '#3b82f6' }
        ];
      };
      
      // Generate service revenue data
      const generateServiceRevenue = () => {
        const services = {
          'General Checkup': 0,
          'Consultation': 0,
          'Follow-up': 0,
          'Specialized': 0,
          'Other': 0
        };
        
        const fees = {
          'General Checkup': 150,
          'Consultation': 175,
          'Follow-up': 100,
          'Specialized': 250,
          'Other': 125
        };
        
        if (appointments) {
          appointments.forEach(appointment => {
            if (appointment.status === 'completed') {
              // Categorize by appointment type
              if (appointment.type?.includes('Check')) {
                services['General Checkup']++;
              } else if (appointment.type?.includes('Consult')) {
                services['Consultation']++;
              } else if (appointment.type?.includes('Follow')) {
                services['Follow-up']++;
              } else if (appointment.type?.includes('Special')) {
                services['Specialized']++;
              } else {
                services['Other']++;
              }
            }
          });
        }
        
        return Object.entries(services).map(([name, count]) => ({
          name,
          revenue: count * fees[name as keyof typeof fees]
        }));
      };
      
      // Generate monthly revenue data
      const generateMonthlyRevenue = () => {
        const months = [];
        const currentMonth = currentDate.getMonth();
        
        for (let i = 11; i >= 0; i--) {
          const monthDate = new Date(currentDate);
          monthDate.setMonth(currentMonth - i);
          
          months.push({
            name: format(monthDate, 'MMM'),
            revenue: 0,
            expenses: 0,
            profit: 0
          });
        }
        
        if (appointments) {
          appointments.forEach(appointment => {
            if (appointment.status === 'completed') {
              const appointmentDate = parseISO(appointment.appointment_date);
              const monthName = format(appointmentDate, 'MMM');
              const monthIndex = months.findIndex(m => m.name === monthName);
              
              if (monthIndex !== -1) {
                // Add random revenue between $100-$300
                const revenue = Math.floor(Math.random() * 200) + 100;
                months[monthIndex].revenue += revenue;
                
                // Calculate expenses (60-80% of revenue)
                const expenseRate = 0.6 + Math.random() * 0.2;
                const expenses = Math.floor(revenue * expenseRate);
                months[monthIndex].expenses += expenses;
                
                // Calculate profit
                months[monthIndex].profit += (revenue - expenses);
              }
            }
          });
        }
        
        // If we have no real data, generate meaningful mock data
        if (!appointments || appointments.length === 0) {
          months.forEach(month => {
            month.revenue = Math.floor(Math.random() * 15000) + 20000;
            month.expenses = Math.floor(month.revenue * (0.6 + Math.random() * 0.2));
            month.profit = month.revenue - month.expenses;
          });
        }
        
        return months;
      };
      
      // Generate top revenue services
      const generateTopServices = () => {
        const serviceTypes = [
          'Regular Consultation',
          'Specialized Consultation',
          'Follow-up Visit',
          'Emergency Consultation',
          'Diagnostic Tests',
          'Preventive Checkup',
          'Virtual Consultation'
        ];
        
        return serviceTypes.map(service => {
          const appointments = Math.floor(Math.random() * 100) + 50;
          const revenue = appointments * (Math.floor(Math.random() * 150) + 100);
          const growth = Math.floor(Math.random() * 40) - 10; // -10% to +30%
          
          return {
            service,
            appointments,
            revenue,
            growth
          };
        }).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
      };
      
      // Set data states
      setRevenueData(generateRevenue());
      setServiceRevenueData(generateServiceRevenue());
      setMonthlyRevenueData(generateMonthlyRevenue());
      setTopServicesData(generateTopServices());
    } catch (error) {
      console.error('Error fetching financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    if (percent < 0.05) return null;
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
      >
        {name}: ${(percent * 100).toFixed(0)}%
      </text>
    );
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading financial insights...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Status</CardTitle>
            <CardDescription>
              Revenue distribution by appointment status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
                      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                      const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                      const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                      
                      return (
                        <text 
                          x={x} 
                          y={y} 
                          fill="white" 
                          textAnchor={x > cx ? 'start' : 'end'} 
                          dominantBaseline="central"
                        >
                          {`${name}: ${(percent * 100).toFixed(0)}%`}
                        </text>
                      );
                    }}
                    outerRadius={110}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {revenueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend formatter={(value) => `${value}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Service Type</CardTitle>
            <CardDescription>
              Revenue breakdown by service category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={serviceRevenueData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 65,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={70}
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue Trends</CardTitle>
          <CardDescription>
            Revenue, expenses, and profit over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlyRevenueData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3b82f6" 
                  name="Revenue" 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#ef4444" 
                  name="Expenses" 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="#10b981" 
                  name="Profit" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

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
    </div>
  );
};
