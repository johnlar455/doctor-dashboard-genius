
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface ErrorStateProps {
  message: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center text-red-500">{message}</div>
      </CardContent>
    </Card>
  );
};
