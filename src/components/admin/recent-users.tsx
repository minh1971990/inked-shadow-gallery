import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data for recent users
const recentUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    avatar: "/avatars/01.png",
    joinedAt: "2024-03-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    avatar: "/avatars/02.png",
    joinedAt: "2024-03-14",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    avatar: "/avatars/03.png",
    joinedAt: "2024-03-13",
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah@example.com",
    avatar: "/avatars/04.png",
    joinedAt: "2024-03-12",
  },
  {
    id: 5,
    name: "David Brown",
    email: "david@example.com",
    avatar: "/avatars/05.png",
    joinedAt: "2024-03-11",
  },
];

export function RecentUsers() {
  return (
    <div className="space-y-8">
      {recentUsers.map((user) => (
        <div key={user.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none text-white">
              {user.name}
            </p>
            <p className="text-sm text-white/50">{user.email}</p>
          </div>
          <div className="ml-auto font-medium text-sm text-white/50">
            {new Date(user.joinedAt).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}
