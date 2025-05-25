import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { useStats } from "@/hooks/use-supabase";

export function Overview() {
  const { stats, isLoading } = useStats();

  if (isLoading) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center">
        <div className="text-white/70">Loading statistics...</div>
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={stats?.dailyData}>
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "6px",
              color: "white",
            }}
          />
          <Bar
            dataKey="users"
            fill="#ffffff"
            radius={[4, 4, 0, 0]}
            className="fill-white"
          />
          <Bar
            dataKey="bookings"
            fill="#ffffff"
            radius={[4, 4, 0, 0]}
            className="fill-white/50"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
