import AdminSidebar from "@/components/admin/admin-sidebar";

export default function AdminSettingsPage() {
  return (
    <div className="min-h-screen bg-black">
      <AdminSidebar />
      <div className="md:pl-64">
        <main className="p-8">
          <div className="flex flex-col gap-6 mx-auto w-full">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Settings
            </h1>

            <div className="grid gap-6 md:grid-cols-2 w-full">
              {/* Add settings content here */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
