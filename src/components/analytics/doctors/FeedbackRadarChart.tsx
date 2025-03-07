
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";

interface FeedbackRadarChartProps {
  feedbackRadarData: Array<{
    name: string;
    value: number;
  }>;
  doctorName: string;
}

export const FeedbackRadarChart: React.FC<FeedbackRadarChartProps> = ({ 
  feedbackRadarData, 
  doctorName 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Feedback Analysis</CardTitle>
        <CardDescription>
          Patient ratings for {doctorName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={feedbackRadarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis angle={30} domain={[0, 5]} />
              <Radar
                name="Rating"
                dataKey="value"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.6}
              />
              <Tooltip />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
