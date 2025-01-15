"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  city: string;
  phoneNumber: string;
  roles: string[];
}

interface UserContextType {
  user: User | null;
  fetchUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = useCallback(async () => {
    if (!token) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const userData = await response.json();
      setUser(userData);
      console.log("User data:", userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUser(null);
    }
  }, [token]);

  useEffect(() => {
    fetchUser();
  }, [token, fetchUser]);

  return (
    <UserContext.Provider value={{ user, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
