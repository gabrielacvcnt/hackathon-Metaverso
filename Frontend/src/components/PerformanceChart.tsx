import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { date: "Mon", accuracy: 65, winRate: 55 },
  { date: "Tue", accuracy: 68, winRate: 58 },
  { date: "Wed", accuracy: 72, winRate: 62 },
  { date: "Thu", accuracy: 70, winRate: 60 },
  { date: "Fri", accuracy: 75, winRate: 65 },
  { date: "Sat", accuracy: 78, winRate: 68 },
  { date: "Sun", accuracy: 80, winRate: 70 },
];

export function PerformanceChart() {
  return (
    <Card className="border-border shadow-md">
      <CardHeader className="pb-3 lg:pb-6">
        <CardTitle className="text-foreground text-lg lg:text-xl">
          Weekly Performance Trend
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={250} className="lg:h-[300px]">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="accuracy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="winRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              className="lg:text-xs"
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
              className="lg:text-xs"
              hide={window.innerWidth < 768}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border border-border bg-card p-2 lg:p-3 shadow-lg">
                      <p className="mb-1 lg:mb-2 text-xs lg:text-sm font-semibold text-card-foreground">
                        {payload[0].payload.date}
                      </p>
                      {payload.map((entry, index) => (
                        <p
                          key={index}
                          className="text-xs lg:text-sm"
                          style={{ color: entry.color }}
                        >
                          {entry.name}: {entry.value}%
                        </p>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="accuracy"
              name="Accuracy"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#accuracy)"
            />
            <Area
              type="monotone"
              dataKey="winRate"
              name="Win Rate"
              stroke="hsl(var(--success))"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#winRate)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
