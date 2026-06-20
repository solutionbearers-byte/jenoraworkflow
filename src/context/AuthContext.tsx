"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AuthUser = {
  id:              string;
  email:           string;
  full_name:       string;
  org_id:          string;
  role_name:       string;
  hierarchy_level: number;
  is_super_admin:  boolean;
};

type AuthContextType = {
  user:    AuthUser | null;
  loading: boolean;
  logout:  () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user:    null,
  loading: true,
  logout:  async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]       = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router                = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        setUser(data?.user ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);