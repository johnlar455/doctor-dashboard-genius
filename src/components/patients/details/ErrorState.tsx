
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  message: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center p-4">
          <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
          <div className="text-red-500 font-medium">{message}</div>
        </div>
      </CardContent>
    </Card>
  );
};
