import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { signInWithGoogle } from '@/lib/firebase';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

// Create inline Google icon since we're having import issues
const GoogleIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className}
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24"
  >
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Use useEffect for redirection to avoid setState during render
  useEffect(() => {
    if (user) {
      setLocation('/admin');
    }
  }, [user, setLocation]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await signInWithGoogle();
      setLocation('/admin');
    } catch (error) {
      setError('Failed to sign in with Google. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Admin Login</h2>
          <p className="text-gray-600 text-center mb-6">
            Sign in with your Google account to access the admin panel.
          </p>

          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
              {error}
            </div>
          )}

          <Button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-6"
          >
            <GoogleIcon className="h-5 w-5" />
            <span>{loading ? 'Signing in...' : 'Sign in with Google'}</span>
          </Button>
          
          <p className="mt-6 text-center text-sm text-gray-500">
            Only authorized administrators can access the admin panel.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}