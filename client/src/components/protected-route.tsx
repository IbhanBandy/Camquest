import { ReactNode } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/lib/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

export function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { user, loading, isAdmin } = useAuth();
  const [, setLocation] = useLocation();

  if (loading) {
    // Show loading spinner or placeholder while checking auth
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Not logged in, redirect to login
  if (!user) {
    setLocation('/login');
    return null;
  }

  // If admin-only route and user is not admin, redirect to home
  if (adminOnly && !isAdmin) {
    setLocation('/');
    return null;
  }

  // If all checks pass, render the children
  return <>{children}</>;
}