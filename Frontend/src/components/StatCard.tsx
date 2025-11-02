import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "success" | "warning";
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
}: StatCardProps) {
  const variantStyles = {
    default: "from-primary/10 to-primary/5",
    success: "from-success/10 to-success/5",
    warning: "from-warning/10 to-warning/5",
  };

  const iconVariantStyles = {
    default: "bg-primary text-primary-foreground",
    success: "bg-success text-success-foreground",
    warning: "bg-warning text-warning-foreground",
  };

  return (
    <Card className="overflow-hidden border-border shadow-md transition-all hover:shadow-lg">
      <CardContent className="p-3 lg:p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1 lg:space-y-2 flex-1 min-w-0">
            <p className="text-xs lg:text-sm font-medium text-muted-foreground truncate">
              {title}
            </p>
            <div className="flex items-baseline gap-1 lg:gap-2">
              <h3 className="text-lg lg:text-3xl font-bold text-foreground">
                {value}
              </h3>
              {trend && (
                <span
                  className={cn(
                    "text-xs lg:text-sm font-medium",
                    trend.isPositive ? "text-success" : "text-destructive"
                  )}
                >
                  {trend.isPositive ? "+" : ""}
                  {trend.value}%
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {subtitle}
              </p>
            )}
          </div>
          <div
            className={cn(
              "rounded-lg p-2 lg:p-3 flex-shrink-0 ml-2",
              iconVariantStyles[variant]
            )}
          >
            <Icon className="h-4 w-4 lg:h-6 lg:w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
