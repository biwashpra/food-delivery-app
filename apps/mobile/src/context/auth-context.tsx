import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { deleteToken, getToken, saveToken } from "@/lib/auth";
import { api } from "@/lib/axios";
import type { User } from "@food-delivery-app/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  register: (data: RegisterData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

interface LoginData {
  email: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkExistingSession();
  }, []);

  async function checkExistingSession() {
    try {
      const token = await getToken();
      if (token) {
        const res = await api.get("/auth/me");
        setUser(res.data);
      }
    } catch {
      await deleteToken();
    } finally {
      setIsLoading(false);
    }
  }

  async function register(data: RegisterData) {
    const res = await api.post("/auth/register", data);
    await saveToken(res.data.token);
    setUser(res.data.user);
  }

  async function login(data: LoginData) {
    const res = await api.post("/auth/login", data);
    await saveToken(res.data.token);
    setUser(res.data.user);
  }

  async function logout() {
    await deleteToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
