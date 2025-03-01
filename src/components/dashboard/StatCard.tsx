
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string | number;
    positive: boolean;
  };
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  description?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  iconColor = "text-primary",
  iconBg = "bg-primary/10",
  description,
  className,
}) => {
  return (
    <Card className={cn("overflow-hidden card-hover", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            
            {change && (
              <div className="flex items-center mt-1">
                <span
                  className={cn(
                    "text-xs font-medium",
                    change.positive ? "text-green-600" : "text-red-600"
                  )}
                >
                  {change.positive ? "+" : ""}{change.value}
                </span>
                {description && (
                  <span className="ml-1 text-xs text-muted-foreground">
                    {description}
                  </span>
                )}
              </div>
            )}
          </div>
          
          <div className={cn("p-2 rounded-full", iconBg)}>
            <Icon className={cn("h-6 w-6", iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
