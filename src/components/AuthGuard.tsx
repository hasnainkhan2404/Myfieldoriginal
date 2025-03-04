import { useAuth } from '../providers/AuthProvider';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!user) {
    return <Navigate to="/sign-in" />;
  }
  
  return <>{children}</>;
} 