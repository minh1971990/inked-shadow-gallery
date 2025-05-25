import { Users, Calendar, Image, Tag } from "lucide-react";
import { useStats } from "@/hooks/use-supabase";

export function Stats() {
  const { stats, isLoading } = useStats();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 animate-pulse"
          >
            <div className="h-8 w-8 rounded-full bg-white/10 mb-4" />
            <div className="h-4 w-24 bg-white/10 rounded mb-2" />
            <div className="h-6 w-16 bg-white/10 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const statItems = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      change: stats?.newUsersThisMonth || 0,
      changeLabel: "this month",
    },
    {
      title: "Total Bookings",
      value: stats?.totalBookings || 0,
      icon: Calendar,
      change: stats?.todayBookings || 0,
      changeLabel: "today",
    },
    {
      title: "Total Designs",
      value: stats?.totalDesigns || 0,
      icon: Image,
      change: stats?.newDesignsThisWeek || 0,
      changeLabel: "this week",
    },
    {
      title: "Total Categories",
      value: stats?.totalCategories || 0,
      icon: Tag,
      change: stats?.newCategoriesThisMonth || 0,
      changeLabel: "this month",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item) => (
        <div
          key={item.title}
          className="rounded-lg border bg-card text-card-foreground shadow-sm"
        >
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">{item.title}</h3>
            <item.icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{item.value}</div>
            <p className="text-xs text-muted-foreground">
              +{item.change} {item.changeLabel}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
