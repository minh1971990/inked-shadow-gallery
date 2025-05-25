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
  const { user, userProfile } = useAuth();

  const isRoleProtected = allowedRoles && allowedRoles.length > 0;

  if (isRoleProtected) {
    if (!user || !userProfile || !allowedRoles.includes(userProfile.role)) {
      return <Navigate to="/404" replace />;
    }
  } else {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
