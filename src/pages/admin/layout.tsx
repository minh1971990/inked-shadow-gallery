import type React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AdminSidebar from "@/components/admin/admin-sidebar";

export const metadata: Metadata = {
  title: "Admin Dashboard | Ink & Shadow",
  description: "Admin dashboard for Ink & Shadow tattoo studio",
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  try {
    const cookieStore = cookies();
    const supabase = createServerComponentClient({
      cookies: () => cookieStore,
    });

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("Session fetch error:", sessionError);
    }

    if (!session) {
      console.log("No session found, redirecting to login.");
      redirect("/login?redirectTo=/admin");
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (profileError) {
      console.error("Profile fetch error:", profileError);
    }

    if (!profile || profile.role !== "admin") {
      console.log("User is not admin, redirecting to home.");
      redirect("/");
    }

    console.log("Admin profile found, rendering layout.");
    return (
      <div className="flex h-screen bg-black text-white">
        <AdminSidebar />
        <div className="flex-1 overflow-auto">
          <main className="p-6">{children}</main>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in AdminLayout:", error);
    throw error;
  }
}
