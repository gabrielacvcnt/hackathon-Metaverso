import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { TrendingUp, Target, Zap, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
const insights = [{
  icon: TrendingUp,
  text: "Your accuracy increased by 12% this week",
  type: "success"
}, {
  icon: Target,
  text: "You perform better when playing on the right side of the map",
  type: "info"
}, {
  icon: Zap,
  text: "Reaction time improved by 23ms - keep up the momentum!",
  type: "success"
}, {
  icon: Sparkles,
  text: "Try practicing in the morning - your consistency is highest then",
  type: "info"
}];
export function InsightsCard() {
  return (
    <Card className="border-border shadow-md">
      <CardHeader className="pb-3 lg:pb-6">
        <CardTitle className="flex items-center gap-2 text-foreground text-lg lg:text-xl">
          Insights & Tips
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 lg:space-y-3 pt-0">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <div 
              key={index} 
              className={cn(
                "flex items-center gap-2 lg:gap-3 rounded-lg border p-2.5 lg:p-3 transition-all hover:shadow-md",
                insight.type === "success" 
                  ? "border-success/30 bg-success/5" 
                  : "border-primary/30 bg-primary/5"
              )}
            >
              <div 
                className={cn(
                  "rounded-md p-1.5 lg:p-2 flex-shrink-0",
                  insight.type === "success" 
                    ? "bg-success/10 text-success" 
                    : "bg-primary/10 text-primary"
                )}
              >
                <Icon className="h-3 w-3 lg:h-4 lg:w-4" />
              </div>
              <p className="flex-1 text-xs lg:text-sm text-foreground leading-relaxed">
                {insight.text}
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}