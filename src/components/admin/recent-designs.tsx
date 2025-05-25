import { AspectRatio } from "@/components/ui/aspect-ratio";

const recentDesigns = [
  {
    id: 1,
    title: "Japanese Dragon",
    category: "Traditional",
    image: "/designs/dragon.jpg",
    artist: "John Smith",
    createdAt: "2024-03-15",
  },
  {
    id: 2,
    title: "Geometric Wolf",
    category: "Geometric",
    image: "/designs/wolf.jpg",
    artist: "Sarah Johnson",
    createdAt: "2024-03-14",
  },
  {
    id: 3,
    title: "Floral Mandala",
    category: "Mandala",
    image: "/designs/mandala.jpg",
    artist: "Mike Brown",
    createdAt: "2024-03-13",
  },
  {
    id: 4,
    title: "Minimalist Cat",
    category: "Minimalist",
    image: "/designs/cat.jpg",
    artist: "Emma Wilson",
    createdAt: "2024-03-12",
  },
  {
    id: 5,
    title: "Watercolor Rose",
    category: "Watercolor",
    image: "/designs/rose.jpg",
    artist: "David Lee",
    createdAt: "2024-03-11",
  },
];

export function RecentDesigns() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recentDesigns.map((design) => (
        <div
          key={design.id}
          className="group relative overflow-hidden rounded-lg border border-white/10 bg-black/30"
        >
          <AspectRatio ratio={1}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <img
              src={design.image}
              alt={design.title}
              className="object-cover w-full h-full transition-transform group-hover:scale-105"
            />
          </AspectRatio>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-lg font-semibold text-white">{design.title}</h3>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-white/70">{design.category}</span>
              <span className="text-sm text-white/50">by {design.artist}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
