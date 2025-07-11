import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL;

interface User {
  id: string;
  fullName: string,
  username: string;
  email: string;
  aura: number;
  joinDate: Date;
  token: string | null;
}

// create AuthContext type.
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  // This type can also be functions and they are declared here.
  login: (email: string, password: string) => Promise<void>;
  signup: (fullName: string, username: string, email: string, password: string) => Promise<void>;
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
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {

      // Mock user for demo purposes
      if (email === "demo@example.com" && password === "password") {
        const userData: User = {
          id: "123456",
          fullName: "Demo User",
          username: "DemoUser",
          email: "demo@example.com",
          aura: 50,
          joinDate: new Date(),
          token: null
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
          email: email,
          password: password,
        });
        const userData: User = {
          id: response.data.user.id,
          fullName: response.data.user.fullName,
          username: response.data.user.username,
          email: response.data.user.email,
          joinDate: response.data.user.createdAt,
          aura: response.data.user.aura,
          token: response.data.token
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
        description: (error.response && error.response.data) ? error.response.data.message : "Unknown error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // TODO: use this function to authenticate signup.
  const signup = async (fullName: string, username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        fullName: fullName,
        email: email,
        username: username,
        password: password,
      });
      console.log('Sign successful', response.data)


      // Mock user creation
      const userData: User = {
        id: "user_" + Date.now().toString(),
        fullName,
        username,
        email,
        aura: 0,
        joinDate: new Date(),
        token: response.data.token,
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
        description: (error.response && error.response.data) ? error.response.data.message : "Unknown error occurred",
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
