import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { authApi, User } from "@/services/api";

export function useAuth(requireAuth = true) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      if (requireAuth) router.push("/login");
      return;
    }

    try {
      const { data } = await authApi.profile();
      setUser(data);
    } catch {
      localStorage.removeItem("token");
      setUser(null);
      if (requireAuth) router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [requireAuth, router]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  };

  return { user, loading, logout, refresh: fetchProfile };
}
