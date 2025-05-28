import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface RecentUsersProps {
  limit?: number;
}

export function RecentUsers({ limit = 5 }: RecentUsersProps) {
  const { data: users, isLoading } = useQuery({
    queryKey: ["recent-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Error fetching users:", error);
        throw error;
      }

      console.log("Fetched users:", data);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center animate-pulse">
            <div className="h-9 w-9 rounded-full bg-white/10" />
            <div className="ml-4 space-y-2">
              <div className="h-4 w-24 bg-white/10 rounded" />
              <div className="h-3 w-32 bg-white/10 rounded" />
            </div>
            <div className="ml-auto h-4 w-20 bg-white/10 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!users || users.length === 0) {
    return <div className="text-center text-white/50 py-4">No users found</div>;
  }

  return (
    <div className="space-y-8">
      {users.map((user) => (
        <div key={user.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={`https://avatar.vercel.sh/${user.email}`}
              alt={user.full_name || ""}
            />
            <AvatarFallback>
              {(user.full_name || "").slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none text-white">
              {user.full_name || "Unnamed User"}
            </p>
            <p className="text-sm text-white/50">{user.email}</p>
          </div>
          <div className="ml-auto font-medium text-white/50">
            {new Date(user.created_at).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}
