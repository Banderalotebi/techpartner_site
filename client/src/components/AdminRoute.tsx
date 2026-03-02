import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface AdminRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        // Not logged in - redirect to login
        setLocation("/admin/login");
      } else if (!isAdmin) {
        // Logged in but not admin - redirect to client dashboard
        setLocation("/dashboard");
      }
    }
  }, [loading, isAuthenticated, isAdmin, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#01A1C1] mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
}
