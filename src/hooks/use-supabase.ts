import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/supabase";

type Tables = Database["public"]["Tables"];

export function useDesigns() {
  const queryClient = useQueryClient();

  const { data: designs, isLoading } = useQuery({
    queryKey: ["designs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("designs")
        .select(
          `
            *,
            design_categories (
              category_id,
      category:categories (
                id,
                name
              )
            )
          `
        )
        .order("featured", { ascending: false })
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const featuredDesigns = useMemo(() => {
    if (!designs) return [];

    return designs
      .filter((design) => design.featured)
      .sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )
      .slice(0, 3);
  }, [designs]);

  const addDesign = useMutation({
    mutationFn: async (newDesign: Omit<Tables["designs"]["Insert"], "id">) => {
      const { data, error } = await supabase
        .from("designs")
        .insert(newDesign)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["designs"] });
    },
  });

  const updateDesign = useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Tables["designs"]["Update"] & { id: number }) => {
      const { data, error } = await supabase
        .from("designs")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["designs"] });
    },
  });

  const deleteDesign = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from("designs").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["designs"] });
    },
  });

  const addDesignCategory = useMutation({
    mutationFn: async ({
      design_id,
      category_id,
    }: Tables["design_categories"]["Insert"]) => {
      const { error } = await supabase
        .from("design_categories")
        .insert({ design_id, category_id });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["designs"] });
    },
  });

  const removeDesignCategory = useMutation({
    mutationFn: async ({
      design_id,
      category_id,
    }: Tables["design_categories"]["Insert"]) => {
      const { error } = await supabase
        .from("design_categories")
        .delete()
        .eq("design_id", design_id)
        .eq("category_id", category_id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["designs"] });
    },
  });

  return {
    designs,
    featuredDesigns,
    isLoading,
    addDesign,
    updateDesign,
    deleteDesign,
    addDesignCategory,
    removeDesignCategory,
  };
}

export function useCategories(sortBy: "newest" | "oldest" = "newest") {
  const queryClient = useQueryClient();

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories", sortBy],
    queryFn: async () => {
      const ascendingOrder = sortBy === "oldest";

      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("featured", { ascending: false })
        .order("created_at", { ascending: ascendingOrder });

      if (error) throw error;
      return data as Tables["categories"]["Row"][];
    },
  });

  const { data: featuredCategories } = useQuery({
    queryKey: ["featured-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("featured", true)
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) throw error;
      return data as Tables["categories"]["Row"][];
    },
  });

  const addCategory = useMutation({
    mutationFn: async (newCategory: Tables["categories"]["Insert"]) => {
      const { data, error } = await supabase
        .from("categories")
        .insert(newCategory)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const updateCategory = useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Tables["categories"]["Update"] & { id: number }) => {
      const { data, error } = await supabase
        .from("categories")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return {
    categories,
    featuredCategories,
    isLoading,
    addCategory,
    updateCategory,
    deleteCategory,
  };
}

export function useBookings() {
  const queryClient = useQueryClient();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Tables["bookings"]["Row"][];
    },
  });

  const addBooking = useMutation({
    mutationFn: async (newBooking: Tables["bookings"]["Insert"]) => {
      const { data, error } = await supabase
        .from("bookings")
        .insert(newBooking)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });

  const updateBooking = useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Tables["bookings"]["Update"] & { id: string }) => {
      const { data, error } = await supabase
        .from("bookings")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });

  const deleteBooking = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("bookings").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });

  return {
    bookings,
    isLoading,
    addBooking,
    updateBooking,
    deleteBooking,
  };
}

export function useStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      // Get total users
      const { count: totalUsers } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // Get total bookings
      const { count: totalBookings } = await supabase
        .from("bookings")
        .select("*", { count: "exact", head: true });

      // Get total designs
      const { count: totalDesigns } = await supabase
        .from("designs")
        .select("*", { count: "exact", head: true });

      // Get total categories
      const { count: totalCategories } = await supabase
        .from("categories")
        .select("*", { count: "exact", head: true });

      // Get bookings for today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count: todayBookings } = await supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .gte("date", today.toISOString());

      // Get new users this month
      const firstDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );
      const { count: newUsersThisMonth } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gte("created_at", firstDayOfMonth.toISOString());

      // Get new designs this month
      const { count: newDesignsThisMonth } = await supabase
        .from("designs")
        .select("*", { count: "exact", head: true })
        .gte("created_at", firstDayOfMonth.toISOString());

      // Get new categories this month
      const { count: newCategoriesThisMonth } = await supabase
        .from("categories")
        .select("*", { count: "exact", head: true })
        .gte("created_at", firstDayOfMonth.toISOString());

      // Get daily stats for the last 30 days
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);

      const { data: dailyStats } = await supabase
        .from("profiles")
        .select("created_at")
        .gte("created_at", thirtyDaysAgo.toISOString());

      const { data: dailyBookings } = await supabase
        .from("bookings")
        .select("date")
        .gte("date", thirtyDaysAgo.toISOString());

      // Get monthly designs for the last 6 months
      const sixMonthsAgo = new Date(today);
      sixMonthsAgo.setMonth(today.getMonth() - 6);

      const { data: monthlyDesigns } = await supabase
        .from("designs")
        .select("created_at")
        .gte("created_at", sixMonthsAgo.toISOString());

      // Process daily stats
      const dailyData = Array.from({ length: 30 }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        date.setHours(0, 0, 0, 0);
        const dateStr = date.toISOString().split("T")[0];

        const users =
          dailyStats?.filter(
            (stat) => stat.created_at.split("T")[0] === dateStr
          ).length || 0;

        const bookings =
          dailyBookings?.filter(
            (booking) => booking.date.split("T")[0] === dateStr
          ).length || 0;

        return {
          name: date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          users,
          bookings,
        };
      }).reverse();

      // Process monthly designs
      const monthlyData = Array.from({ length: 6 }, (_, i) => {
        const date = new Date(today);
        date.setMonth(today.getMonth() - i);
        date.setDate(1);
        date.setHours(0, 0, 0, 0);
        const nextMonth = new Date(date);
        nextMonth.setMonth(date.getMonth() + 1);

        const designs =
          monthlyDesigns?.filter(
            (design) =>
              new Date(design.created_at) >= date &&
              new Date(design.created_at) < nextMonth
          ).length || 0;

        return {
          name: date.toLocaleDateString("en-US", { month: "short" }),
          designs,
        };
      }).reverse();

      return {
        totalUsers,
        totalBookings,
        totalDesigns,
        totalCategories,
        todayBookings,
        newUsersThisMonth,
        newCategoriesThisMonth,
        dailyData,
        monthlyData,
        newDesignsThisMonth,
      };
    },
  });

  return {
    stats,
    isLoading,
  };
}
