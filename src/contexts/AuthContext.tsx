import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

interface User {
  id: string;
  username: string;
  email: string;
  aura: number;
  joinDate: Date;
}

// create AuthContext type.
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  // This type can also be functions and they are declared here.
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserAura: (newAura: number) => void;
}

// Auth context can have either undefined or AuthContextType type value.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Simulating loading user data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // For demo purposes, we'll use localStorage to simulate authentication
  // In a real app, this would use API calls to a backend server
  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {

      // Mock user for demo purposes
      if (username === "demo@example.com" && password === "password") {
        const userData: User = {
          id: "123456",
          username: "DemoUser",
          email: "demo@example.com",
          aura: 50,
          joinDate: new Date(),
        };

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
      }
      else {
        const response = await axios.post(`${API_URL}/login`, {
          username: username,
          password: password,
        });
        const userData: User = {
          id: response.data.user.id,
          username: response.data.user.username,
          email: response.data.user.email,
          // TODO: here aura and joinDate are actually fake. Make attributes called aura and joinDate in db
          aura: 50,
          joinDate: new Date(),
        };

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // TODO: use this function to authenticate signup.
  const signup = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock user creation
      const userData: User = {
        id: "user_" + Date.now().toString(),
        username,
        email,
        aura: 0,
        joinDate: new Date(),
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      toast({
        title: "Account created",
        description: "Welcome to Samvidhaan Samvaad!",
      });
    } catch (error) {
      toast({
        title: "Signup failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  const updateUserAura = (newAura: number) => {
    if (user) {
      const updatedUser = { ...user, aura: newAura };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateUserAura,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
