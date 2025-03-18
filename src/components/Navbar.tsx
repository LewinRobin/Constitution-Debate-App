
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Flame, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <nav className="bg-constitution-blue text-white p-4 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <Link to="/" className="text-2xl font-bold mb-4 md:mb-0">
          Samvidhaan Samvaad
        </Link>
        
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <div className="flex items-center mr-4">
                <Flame 
                  className={`fire-icon mr-1 ${user && user.aura > 0 ? 'text-aura-positive animate-fire-pulse' : 'text-aura-negative'}`} 
                  size={20} 
                />
                <span className="font-semibold">{user?.aura || 0}</span>
              </div>
              <Link to="/dashboard" className="hover:text-constitution-orange transition-colors">
                Dashboard
              </Link>
              <Link to="/articles" className="hover:text-constitution-orange transition-colors">
                Constitutional Articles
              </Link>
              
              {/* User Profile Display */}
              <div className="flex items-center ml-2 mr-2">
                <Avatar className="h-8 w-8 bg-constitution-orange text-white mr-2">
                  <AvatarFallback>{user ? getInitials(user.username) : "U"}</AvatarFallback>
                </Avatar>
                <span className="hidden md:inline-block">{user?.username}</span>
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => logout()}
                className="text-white border-white hover:bg-white hover:text-constitution-blue"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/articles" className="hover:text-constitution-orange transition-colors">
                Constitutional Articles
              </Link>
              <Button 
                variant="outline" 
                onClick={() => navigate("/login")}
                className="text-white border-white hover:bg-white hover:text-constitution-blue"
              >
                Login
              </Button>
              <Button 
                onClick={() => navigate("/signup")}
                className="bg-constitution-orange hover:bg-orange-600 text-white"
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
