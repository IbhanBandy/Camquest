import { ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/lib/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

export function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { user, loading, isAdmin } = useAuth();
  const [, setLocation] = useLocation();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // Wait until auth is checked
    if (loading) return;

    // Not logged in, redirect to login
    if (!user) {
      setLocation('/login');
      return;
    }

    // If admin-only route and user is not admin, redirect to home
    if (adminOnly && !isAdmin) {
      setLocation('/');
      return;
    }

    // If all checks pass, render the children
    setAuthorized(true);
  }, [user, loading, isAdmin, adminOnly, setLocation]);

  if (loading) {
    // Show loading spinner or placeholder while checking auth
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Wait until the authorized state is set by the effect
  if (authorized !== true) {
    return null;
  }

  // If all checks pass, render the children
  return <>{children}</>;
}