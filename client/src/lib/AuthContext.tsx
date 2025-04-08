import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { auth, isAdmin } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Define the Auth context shape
interface AuthContextProps {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
}

// Create the Auth context
const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: true,
  isAdmin: false,
});

// Auth Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    isAdmin: isAdmin(user),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the Auth context
export const useAuth = () => {
  return useContext(AuthContext);
};