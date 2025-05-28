import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface RecentDesignsProps {
  limit?: number;
}

export function RecentDesigns({ limit = 6 }: RecentDesignsProps) {
  const { data: designs, isLoading } = useQuery({
    queryKey: ["recent-designs"],
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
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="group relative overflow-hidden rounded-lg border border-white/20 bg-black/30 animate-pulse"
          >
            <AspectRatio ratio={1}>
              <div className="absolute inset-0 bg-white/10" />
            </AspectRatio>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="h-6 w-32 bg-white/10 rounded mb-2" />
              <div className="flex items-center justify-between">
                <div className="h-4 w-20 bg-white/10 rounded" />
                <div className="h-4 w-24 bg-white/10 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {designs?.map((design) => (
        <div
          key={design.id}
          className="group relative overflow-hidden rounded-lg border border-white/20 bg-black/30"
        >
          <AspectRatio ratio={1}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <img
              src={design.image_url}
              alt={design.title}
              className="object-cover w-full h-full transition-transform group-hover:scale-105"
            />
          </AspectRatio>
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="text-lg font-semibold text-white">{design.title}</h3>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-white/50">
                {new Date(design.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
