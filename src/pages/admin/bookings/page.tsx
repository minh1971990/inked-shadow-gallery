import React, { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/admin-sidebar";
import { supabase } from "@/lib/supabase";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  style: string;
  size: string;
  placement: string;
  idea: string;
  date: string;
  respond: string | null;
  created_at: string;
}

const ITEMS_PER_PAGE = 10;

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      setError(null);

      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      let query = supabase
        .from("bookings")
        .select(
          "id, name, email, phone, style, size, placement, idea, date, respond, created_at",
          { count: "exact" }
        )
        .order("created_at", { ascending: false })
        .range(from, to);

      if (searchTerm) {
        query = query.or(
          `name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`
        );
      }

      const { data, error, count } = await query;

      if (error) {
        setError(error.message);
        setBookings([]);
        setTotalBookings(0);
      } else {
        setBookings(data as Booking[]);
        setTotalBookings(count || 0);
        setError(null);
      }
      setIsLoading(false);
    };

    fetchBookings();
  }, [currentPage, searchTerm]);

  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const totalPages = Math.ceil(totalBookings / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-black">
      <AdminSidebar />
      <div className="md:pl-64">
        <main className="p-8">
          <div className="flex flex-col gap-6 mx-auto w-full">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Bookings Management
            </h1>

            <div className="flex items-center gap-4 flex-wrap w-full">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/50" />
                <Input
                  type="search"
                  placeholder="Search bookings..."
                  className="pl-8 bg-black/30 border-white/20 text-white"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>

            {isLoading && (
              <p className="text-white text-center">Loading bookings...</p>
            )}
            {error && (
              <p className="text-red-500 text-center">Error: {error}</p>
            )}

            {!isLoading && !error && bookings.length > 0 && (
              <div className="rounded-md border border-white/20 overflow-hidden w-full">
                <Table>
                  <TableHeader className="bg-black/30">
                    <TableRow className="hover:bg-black/40 border-white/20">
                      <TableHead className="text-white/70">Name</TableHead>
                      <TableHead className="text-white/70">Email</TableHead>
                      <TableHead className="text-white/70">Phone</TableHead>
                      <TableHead className="text-white/70">Date</TableHead>
                      <TableHead className="text-white/70">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow
                        key={booking.id}
                        onClick={() => {
                          setSelectedBooking(booking);
                          setIsViewDialogOpen(true);
                        }}
                        className="text-white hover:bg-white/20 border-white/20 cursor-pointer"
                      >
                        <TableCell>{booking.name}</TableCell>
                        <TableCell>{booking.email}</TableCell>
                        <TableCell>{booking.phone}</TableCell>
                        <TableCell>
                          {new Date(booking.date).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {booking.respond === "Confirm" ? (
                            <span className="px-2 py-1 rounded bg-green-600/20 text-green-400 font-semibold">
                              Confirm
                            </span>
                          ) : booking.respond === "Reject" ? (
                            <span className="px-2 py-1 rounded bg-red-600/20 text-red-400 font-semibold">
                              Reject
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded bg-yellow-600/20 text-yellow-400 font-semibold">
                              Pending
                            </span>
                          )}
                        </TableCell>{" "}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {!isLoading && !error && bookings.length === 0 && (
              <p className="text-white text-center">No bookings found.</p>
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
        <DialogContent
          className="bg-black/95 border-2 border-white/20 text-white max-w-sm sm:max-w-md md:max-w-2xl p-0"
          style={{ maxHeight: "90vh" }}
        >
          <DialogHeader className="p-6 pb-2">
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription className="text-white/70">
              View detailed information about this booking.
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto px-6 pb-6 max-h-[60vh]">
            {selectedBooking && (
              <div className="space-y-6 py-2">
                {/* Customer Information */}
                <div>
                  <h4 className="font-semibold text-lg mb-3">
                    Customer Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="view-name">Name</Label>
                      <Input
                        id="view-name"
                        value={selectedBooking.name}
                        readOnly
                        className="bg-white/5 text-white border-white/20"
                      />
                    </div>
                    <div>
                      <Label htmlFor="view-email">Email</Label>
                      <Input
                        id="view-email"
                        value={selectedBooking.email}
                        readOnly
                        className="bg-white/5 text-white border-white/20"
                      />
                    </div>
                    <div>
                      <Label htmlFor="view-phone">Phone</Label>
                      <Input
                        id="view-phone"
                        value={selectedBooking.phone}
                        readOnly
                        className="bg-white/5 text-white border-white/20"
                      />
                    </div>
                    <div>
                      <Label htmlFor="view-status">Status</Label>
                      <div>
                        {selectedBooking.respond === "Confirm" ? (
                          <span className="px-2 py-1 rounded bg-green-600/20 text-green-400 font-semibold">
                            Confirm
                          </span>
                        ) : selectedBooking.respond === "Reject" ? (
                          <span className="px-2 py-1 rounded bg-red-600/20 text-red-400 font-semibold">
                            Reject
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded bg-yellow-600/20 text-yellow-400 font-semibold">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tattoo Information */}
                <div>
                  <h4 className="font-semibold text-lg mb-3">
                    Tattoo Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="view-style">Style</Label>
                      <Input
                        id="view-style"
                        value={selectedBooking.style}
                        readOnly
                        className="bg-white/5 text-white border-white/20"
                      />
                    </div>
                    <div>
                      <Label htmlFor="view-size">Size</Label>
                      <Input
                        id="view-size"
                        value={selectedBooking.size}
                        readOnly
                        className="bg-white/5 text-white border-white/20"
                      />
                    </div>
                    <div>
                      <Label htmlFor="view-placement">Placement</Label>
                      <Input
                        id="view-placement"
                        value={selectedBooking.placement}
                        readOnly
                        className="bg-white/5 text-white border-white/20"
                      />
                    </div>
                    <div>
                      <Label htmlFor="view-idea">Idea</Label>
                      <Input
                        id="view-idea"
                        value={selectedBooking.idea}
                        readOnly
                        className="bg-white/5 text-white border-white/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Date */}
                <div>
                  <h4 className="font-semibold text-lg mb-3">Booking Date</h4>
                  <Input
                    id="view-date"
                    value={
                      selectedBooking?.date
                        ? new Date(selectedBooking.date).toLocaleString(
                            undefined,
                            {
                              hour12: false,
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                              timeZone: "UTC",
                            }
                          )
                        : ""
                    }
                    readOnly
                    className="bg-white/5 text-white border-white/20 w-full"
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="p-6 pt-0">
            <Button
              variant="outline"
              onClick={() => setIsViewDialogOpen(false)}
              className="bg-white text-black hover:bg-white/90 w-full"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
