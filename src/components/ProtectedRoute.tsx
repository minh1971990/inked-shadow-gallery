import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import React from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // Optional: specify required roles
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, userProfile, loading } = useAuth();

  // If initial session loading is still in progress
  if (loading) {
    return null; // Or a simple loading spinner
  }

  // After initial session loading, check if user is present.
  // If user is present, userProfile is being loaded by AuthContext's useEffect.
  // We need to wait for userProfile to be non-null if user is present and role protection is active.
  const isRoleProtected = allowedRoles && allowedRoles.length > 0;

  if (isRoleProtected) {
    // If user is present but profile is still null, we are waiting for the profile to load.
    if (user && userProfile === null) {
      return null; // Wait for the profile to be loaded
    }

    // Now check if user and profile exist and role is allowed
    const isAuthorized =
      user && userProfile && allowedRoles.includes(userProfile.role);

    if (!isAuthorized) {
      return <Navigate to="/404" replace />;
    }
  } else {
    // Basic authentication check (user must exist if not role-protected)
    if (!user) {
      return <Navigate to="/login" replace />;
    }
  }

  // If authenticated and authorized, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
