import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";

const heatmapData = [
  [0.3, 0.5, 0.7, 0.9, 0.8],
  [0.4, 0.6, 0.8, 0.7, 0.6],
  [0.5, 0.7, 0.9, 0.8, 0.7],
  [0.6, 0.8, 0.7, 0.6, 0.5],
  [0.4, 0.6, 0.5, 0.4, 0.3],
];

export function HeatmapCard() {
  const getHeatColor = (value: number) => {
    if (value >= 0.8) return "bg-success/80";
    if (value >= 0.6) return "bg-success/60";
    if (value >= 0.4) return "bg-warning/60";
    return "bg-destructive/40";
  };

  return (
    <Card className="border-border shadow-md">
      <CardHeader className="pb-3 lg:pb-6">
        <CardTitle className="text-foreground text-lg lg:text-xl">
          Performance Heatmap
        </CardTitle>
        <p className="text-xs lg:text-sm text-muted-foreground">
          Map positioning analysis - darker areas show higher performance
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-1.5 lg:space-y-2">
          {heatmapData.map((row, i) => (
            <div key={i} className="flex gap-1.5 lg:gap-2">
              {row.map((cell, j) => (
                <div
                  key={j}
                  className={cn(
                    "h-10 lg:h-16 flex-1 rounded-md transition-all hover:scale-105",
                    getHeatColor(cell)
                  )}
                  title={`Performance: ${(cell * 100).toFixed(0)}%`}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="mt-3 lg:mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>Lower Performance</span>
          <span>Higher Performance</span>
        </div>
      </CardContent>
    </Card>
  );
}
