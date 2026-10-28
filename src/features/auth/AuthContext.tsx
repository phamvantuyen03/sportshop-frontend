import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { api, setToken } from "../../lib/api";
import type { User, AuthResponse } from "../../types";
const AuthContext = createContext<{
  user: User | null;
  authenticate: (
    mode: "login" | "register",
    data: Record<string, string>,
  ) => Promise<void>;
  logout: () => void;
} | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  function logout() {
    setToken(null);
    setUser(null);
  }
  useEffect(() => {
    window.addEventListener("auth-expired", logout);
    return () => window.removeEventListener("auth-expired", logout);
  }, []);
  async function authenticate(
    mode: "login" | "register",
    data: Record<string, string>,
  ) {
    const result = await api<AuthResponse>("/auth/" + mode, {
      method: "POST",
      body: JSON.stringify(data),
    });
    setToken(result.token);
    setUser(result.user);
  }
  return (
    <AuthContext.Provider value={{ user, authenticate, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  return useContext(AuthContext)!;
}
