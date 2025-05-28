import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PiSparkleFill } from "react-icons/pi";
import {
  LayoutDashboard,
  Users,
  ImageIcon,
  Tag,
  Calendar,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export default function AdminSidebar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Categories", href: "/admin/categories", icon: Tag },
    { name: "Designs", href: "/admin/designs", icon: ImageIcon },
    { name: "Bookings", href: "/admin/bookings", icon: Calendar },
  ];

  const isActive = (path: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 right-4 z-50 md:hidden text-white"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </Button>

      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow border-r border-white/20 bg-black/50 backdrop-blur-md pt-5 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 mb-5">
            <div className="flex items-center">
              <div className="w-10 h-10 mr-2 relative hidden sm:block">
                <div className="absolute inset-0 bg-white rounded-full opacity-10"></div>
                <div className="absolute inset-1 bg-black rounded-full flex items-center justify-center">
                  <PiSparkleFill className="text-white/80 text-lg" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight text-white">
                  ART LLLEX
                </h3>
                <div className="text-[10px] text-white/60 uppercase tracking-widest -mt-1">
                  Admin Panel
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5 flex-1 flex flex-col px-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                  ${
                    isActive(item.href)
                      ? "bg-white text-black"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }
                `}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 ${
                    isActive(item.href)
                      ? "text-black"
                      : "text-white/70 group-hover:text-white"
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div
        className={`fixed inset-0 z-40 md:hidden bg-black/95 backdrop-blur-lg transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col pt-16 pb-6 px-4 h-full overflow-y-auto">
          <div className="flex-1 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  flex items-center px-4 py-3 text-base font-medium rounded-md transition-colors
                  ${
                    isActive(item.href)
                      ? "bg-white text-black"
                      : "text-white hover:bg-white/10"
                  }
                `}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon
                  className={`mr-4 h-6 w-6 ${
                    isActive(item.href) ? "text-black" : "text-white/70"
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            ))}
          </div>
          <div className="mt-auto pt-6 border-t border-white/20">
            <Button
              variant="ghost"
              className="w-full justify-start py-3 text-white/70 hover:text-white hover:bg-white/10"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <LogOut className="mr-4 h-6 w-6" aria-hidden="true" />
              Sign out
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
