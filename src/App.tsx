import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { BookingProvider } from "@/components/BookingContent";
import Index from "./pages/Index";
import AuthPage from "@/pages/auth/page";
import ResetPasswordPage from "@/pages/auth/reset-password";
import AdminDashboard from "@/pages/admin/page";
import AdminUsersPage from "@/pages/admin/users/page";
import AdminDesignsPage from "@/pages/admin/designs/page";
import AdminCategoriesPage from "@/pages/admin/categories/page";
import AdminBookingsPage from "@/pages/admin/bookings/page";
import AdminSettingsPage from "@/pages/admin/settings/page";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Suspense } from "react";

const queryClient = new QueryClient();

const AppContent = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/404" element={<NotFound />} />

      {/* Auth Routes */}
      <Route path="/login" element={<AuthPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Admin Routes - Protected */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            {" "}
            {/* Only allow users with role 'admin' */}
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            {" "}
            {/* Only allow users with role 'admin' */}
            <AdminUsersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/designs"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            {" "}
            {/* Only allow users with role 'admin' */}
            <AdminDesignsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/categories"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            {" "}
            {/* Only allow users with role 'admin' */}
            <AdminCategoriesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/bookings"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            {" "}
            {/* Only allow users with role 'admin' */}
            <AdminBookingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            {" "}
            {/* Only allow users with role 'admin' */}
            <AdminSettingsPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router>
          <AuthProvider>
            <Sonner />
            <Toaster />
            <BookingProvider>
              <Suspense fallback={<div>Loading...</div>}>
                <AppContent />
              </Suspense>
            </BookingProvider>
          </AuthProvider>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
