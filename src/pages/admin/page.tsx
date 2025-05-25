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
import AdminSidebar from "@/components/admin/admin-sidebar";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-black">
      <AdminSidebar />
      <div className="md:pl-64">
        <main className="p-8">
          <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Admin Dashboard
            </h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-black/50 border-white/10">
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
                  <div className="text-2xl font-bold text-white">245</div>
                  <p className="text-xs text-white/50 mt-1">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-white/10">
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
                  <div className="text-2xl font-bold text-white">18</div>
                  <p className="text-xs text-white/50 mt-1">
                    +2 scheduled today
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-white/10">
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
                  <div className="text-2xl font-bold text-white">132</div>
                  <p className="text-xs text-white/50 mt-1">+8 new this week</p>
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-white/10">
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
                  <div className="text-2xl font-bold text-white">9</div>
                  <p className="text-xs text-white/50 mt-1">+1 new category</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4 bg-black/50 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Overview</CardTitle>
                  <CardDescription className="text-white/50">
                    User registrations and bookings for the past 30 days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Overview />
                </CardContent>
              </Card>

              <Card className="col-span-3 bg-black/50 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Recent Users</CardTitle>
                  <CardDescription className="text-white/50">
                    Recently registered users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentUsers />
                </CardContent>
              </Card>
            </div>

            <Card className="bg-black/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Recent Designs</CardTitle>
                <CardDescription className="text-white/50">
                  Recently added tattoo designs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentDesigns />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
