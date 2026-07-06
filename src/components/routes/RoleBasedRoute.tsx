import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Usuario } from '@/types/usuario';

interface RoleBasedRouteProps {
  allowedRoles: Usuario['papel'][];
  children: React.ReactNode;
  redirectTo?: string;
}

// Component that restricts access based on user role.
// Hides administrative pages from non-admin users even when accessing URL directly.
export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ allowedRoles, children, redirectTo = '/app/login' }) => {
  const { usuario } = useAuth();

  if (!usuario) return <Navigate to={redirectTo} replace />;

  if (!allowedRoles.includes(usuario.papel)) {
    // If user is authenticated but does not have required role, block access.
    return <Navigate to="/app/login" replace />;
  }

  return <>{children}</>;
};

export default RoleBasedRoute;
