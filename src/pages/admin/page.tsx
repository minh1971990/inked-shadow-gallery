import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Overview } from "@/components/admin/overview";
import { RecentUsers } from "@/components/admin/recent-users";
import { RecentDesigns } from "@/components/admin/recent-designs";
import { MonthlyDesigns } from "@/components/admin/monthly-designs";
import AdminSidebar from "@/components/admin/admin-sidebar";
import { useStats } from "@/hooks/use-supabase";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const { stats, isLoading: statsLoading } = useStats();
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) {
        console.error("Error fetching users:", error);
        throw error;
      }
      return data;
    },
  });

  const isLoading = statsLoading || usersLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <AdminSidebar />
        <div className="md:pl-64">
          <main className="p-8">
            <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
              <div className="text-white">Loading...</div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <AdminSidebar />
      <div className="md:pl-64">
        <main className="p-8">
          <div className="flex flex-col gap-6 mx-auto w-full">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Admin Dashboard
            </h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-black/50 border-white/20">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-white/70">
                    Total Users
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-white/70"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {users?.length || 0}
                  </div>
                  <p className="text-xs text-white/50 mt-1">
                    +{stats?.newUsersThisMonth || 0} this month
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-white/20">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-white/70">
                    Active Bookings
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-white/70"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M8 12h8M12 8v8" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {stats?.totalBookings || 0}
                  </div>
                  <p className="text-xs text-white/50 mt-1">
                    +{stats?.todayBookings || 0} scheduled today
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-white/20">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-white/70">
                    Total Designs
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-white/70"
                  >
                    <path d="M12 2H2v10h10V2Z" />
                    <path d="M22 12h-4v10h4V12Z" />
                    <path d="M14 18h-4V8h4v10Z" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {stats?.totalDesigns || 0}
                  </div>
                  <p className="text-xs text-white/50 mt-1">
                    +{stats?.newDesignsThisMonth || 0} this month
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-white/20">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-white/70">
                    Categories
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-white/70"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {stats?.totalCategories || 0}
                  </div>
                  <p className="text-xs text-white/50 mt-1">
                    +{stats?.newCategoriesThisMonth || 0} new this month
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4 bg-black/50 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Overview</CardTitle>
                  <CardDescription className="text-white/50">
                    User registrations and bookings for the past 30 days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Overview data={stats?.dailyData || []} />
                </CardContent>
              </Card>

              <Card className="col-span-3 bg-black/50 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Recent Users</CardTitle>
                  <CardDescription className="text-white/50">
                    Last 5 registered users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentUsers limit={5} />
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-black/50 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Monthly Designs</CardTitle>
                  <CardDescription className="text-white/50">
                    Number of designs added per month
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MonthlyDesigns data={stats?.monthlyData || []} />
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Recent Designs</CardTitle>
                  <CardDescription className="text-white/50">
                    Last 6 added tattoo designs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentDesigns limit={6} />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
