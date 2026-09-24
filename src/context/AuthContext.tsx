 "use client";

import { createContext, useContext, useEffect, useState } from "react";
import { login as loginApi } from "@/services/authService";
import { clearStoredAuth, getStoredAuth, setStoredAuth } from "@/lib/storage";
import { User } from "@/types/auth";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getStoredAuth();
    if (auth) {
      setUser(auth.user);
      setToken(auth.token);
    }
    setLoading(false);
  }, []);

  async function login(username: string, password: string) {
    const data = await loginApi(username, password);
    const authToken = data.token || data.accessToken;
    if (!authToken) throw new Error("Login succeeded but no token was returned.");
    setStoredAuth(authToken, data);
    setUser(data);
    setToken(authToken);
  }

  function logout() {
    clearStoredAuth();
    setUser(null);
    setToken(null);
    window.location.href = "/login";
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}