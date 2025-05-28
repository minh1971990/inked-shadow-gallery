"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Search,
  UserPlus,
  Mail,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import AdminSidebar from "@/components/admin/admin-sidebar";
import { supabase } from "@/lib/supabase";

interface User {
  id: string;
  full_name: string;
  email: string;
  role: "user" | "admin";
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

const ITEMS_PER_PAGE = 10;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [filterOrder, setFilterOrder] = useState<"newest" | "oldest">("newest");

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);

      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const ascendingOrder = filterOrder === "oldest";

      let query = supabase
        .from("profiles")
        .select(
          "id, full_name, email, role, email_verified, created_at, updated_at",
          { count: "exact" }
        )
        .eq("role", "user")
        .order("created_at", { ascending: ascendingOrder })
        .range(from, to);

      if (searchTerm) {
        query = query.or(
          `full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`
        );
      }

      const { data, error, count } = await query;

      if (error) {
        console.error("Error fetching users:", error);
        setError(error.message);
        setUsers([]);
        setTotalUsers(0);
      } else {
        setUsers(data as User[]);
        setTotalUsers(count || 0);
        setError(null);
      }
      setIsLoading(false);
    };

    fetchUsers();
  }, [currentPage, searchTerm, filterOrder]);

  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User>({
    id: "",
    full_name: "",
    email: "",
    role: "user",
    email_verified: false,
    created_at: "",
    updated_at: "",
  });

  const totalPages = Math.ceil(totalUsers / ITEMS_PER_PAGE);

  const displayedUsers = users;

  return (
    <div className="min-h-screen bg-black">
      <AdminSidebar />
      <div className="md:pl-64">
        <main className="p-8">
          <div className="flex flex-col gap-6 mx-auto w-full">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Users Management
            </h1>

            <div className="flex items-center gap-4 flex-wrap w-full">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/50" />
                <Input
                  type="search"
                  placeholder="Search users..."
                  className="pl-8 bg-black/30 border-white/20 text-white"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-white/20 text-black"
                  >
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="text-black bg-white border-white/20">
                  <DropdownMenuLabel>Order by Date</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setFilterOrder("newest")}
                    className={filterOrder === "newest" ? "bg-white/10" : ""}
                  >
                    From new to old
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setFilterOrder("oldest")}
                    className={filterOrder === "oldest" ? "bg-white/10" : ""}
                  >
                    From old to new
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {isLoading && (
              <p className="text-white text-center">Loading users...</p>
            )}
            {error && (
              <p className="text-red-500 text-center">Error: {error}</p>
            )}

            {!isLoading && !error && displayedUsers.length > 0 && (
              <div className="rounded-md border border-white/20 overflow-hidden w-full">
                <Table>
                  <TableHeader className="bg-black/30">
                    <TableRow className="hover:bg-black/40 border-white/20">
                      <TableHead className="text-white/70">Name</TableHead>
                      <TableHead className="text-white/70 hidden md:table-cell">
                        <span className="md:hidden font-semibold text-white/70">
                          Email:{" "}
                        </span>
                        Email
                      </TableHead>
                      <TableHead className="text-white/70 hidden lg:table-cell">
                        <span className="xs:hidden font-semibold text-white/70">
                          Role
                        </span>
                      </TableHead>
                      <TableHead className="text-white/70">
                        <span className="font-semibold text-white/70">
                          Email Verified{" "}
                        </span>
                      </TableHead>
                      <TableHead className="text-white/70 hidden lg:table-cell">
                        <span className="lg:hidden font-semibold text-white/70">
                          Joined:{" "}
                        </span>
                        Joined
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayedUsers.map((user) => (
                      <TableRow
                        key={user.id}
                        onClick={() => {
                          setSelectedUser(user);
                          setIsViewDialogOpen(true);
                        }}
                        className="text-white hover:bg-white/20 border-white/20 cursor-pointer"
                      >
                        <TableCell className="font-medium">
                          {user.full_name || "N/A"}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className="md:hidden font-semibold text-white/70">
                            Email:{" "}
                          </span>
                          {user.email}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge
                            variant={
                              user.role === "admin" ? "default" : "outline"
                            }
                            className={
                              user.role === "admin"
                                ? "bg-white text-black hover:bg-white"
                                : "text-white border-white/20"
                            }
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.email_verified ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              DONE
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              NOPE
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <span className="lg:hidden font-semibold text-white/70">
                            Joined:{" "}
                          </span>
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {!isLoading && !error && displayedUsers.length === 0 && (
              <p className="text-white text-center">No users found.</p>
            )}

            {/* Pagination Controls */}
            {!isLoading && !error && totalPages > 1 && (
              <div className="flex items-center justify-end space-x-2 py-4 text-white w-full">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="bg-black/95 border border-white/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription className="text-white/70">
              View detailed information about this user.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="view-fullname">Full Name</Label>
              <Input
                id="view-fullname"
                value={selectedUser.full_name}
                readOnly
                className="bg-white/5 text-white border-white/20"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="view-email">Email</Label>
              <Input
                id="view-email"
                value={selectedUser.email}
                readOnly
                className="bg-white/5 text-white border-white/20"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="view-created">Joined</Label>
              <Input
                id="view-created"
                value={new Date(selectedUser.created_at).toLocaleString()}
                readOnly
                className="bg-white/5 text-white border-white/20"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsViewDialogOpen(false)}
              className="bg-white text-black hover:bg-white/90"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
