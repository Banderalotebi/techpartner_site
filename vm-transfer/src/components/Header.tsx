import { useState } from "react";
import { Search, Mail, User, ChevronDown, Menu, X, Phone, Heart, Star, LogOut } from "lucide-react";
import { AuthModal } from "./AuthModal";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import techPartnerLogo from "@assets/tech partner logo_1751927733407.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Header() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  const getUserInitials = (firstName?: string, lastName?: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || "U";
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      {/* Top Bar with Contact Info */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-screen-xl mx-auto px-6 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6 text-gray-600">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+966 56 176 1867</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>hello@techpartner.studio</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-gray-600">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="w-4 h-4 text-red-500" />
                <span>1000+ Happy Clients</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Section */}
      <div className="flex items-center justify-between px-6 py-4 max-w-screen-xl mx-auto" style={{ height: '80px' }}>
        {/* Logo Section with enhanced design */}
        <Link to="/">
          <div className="flex items-center cursor-pointer group">
            <img 
              src={techPartnerLogo} 
              alt="TechPartner Logo" 
              className="h-12 w-auto group-hover:scale-105 transition-transform"
            />
          </div>
        </Link>

        {/* Enhanced Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          <Link to="/categories">
            <div className="text-gray-700 font-medium hover:text-[#01A1C1] cursor-pointer transition-colors relative group">
              Services
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#01A1C1] group-hover:w-full transition-all duration-300"></div>
            </div>
          </Link>
          <Link to="/portfolio">
            <div className="text-gray-700 font-medium hover:text-[#01A1C1] cursor-pointer transition-colors relative group">
              Portfolio
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#01A1C1] group-hover:w-full transition-all duration-300"></div>
            </div>
          </Link>
          <Link to="/about">
            <div className="text-gray-700 font-medium hover:text-[#01A1C1] cursor-pointer transition-colors relative group">
              About
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#01A1C1] group-hover:w-full transition-all duration-300"></div>
            </div>
          </Link>
          <Link to="/blog">
            <div className="text-gray-700 font-medium hover:text-[#01A1C1] cursor-pointer transition-colors relative group">
              Blog
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#01A1C1] group-hover:w-full transition-all duration-300"></div>
            </div>
          </Link>
          <Link to="/contact">
            <div className="text-gray-700 font-medium hover:text-[#01A1C1] cursor-pointer transition-colors relative group">
              Contact
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#01A1C1] group-hover:w-full transition-all duration-300"></div>
            </div>
          </Link>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-[#01A1C1] text-white">
                        {getUserInitials(user.firstName, user.lastName)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">
                      <Mail className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-gray-700 font-medium hover:text-[#01A1C1] transition-colors"
                >
                  Log in
                </button>
                <Link to="/categories">
                  <Button className="bg-[#01A1C1] hover:bg-[#0891B2] text-white px-6 py-2 rounded-full">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Enhanced Mobile menu button */}
        <div className="lg:hidden">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-black p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-6 py-4 space-y-4">
            <Link to="/categories">
              <div className="text-gray-700 font-medium py-2 hover:text-[#01A1C1] cursor-pointer">
                Services
              </div>
            </Link>
            <div className="text-gray-700 font-medium py-2 hover:text-[#01A1C1] cursor-pointer">
              Portfolio
            </div>
            <div className="text-gray-700 font-medium py-2 hover:text-[#01A1C1] cursor-pointer">
              About
            </div>
            <div className="text-gray-700 font-medium py-2 hover:text-[#01A1C1] cursor-pointer">
              Contact
            </div>
            <div className="pt-4 border-t border-gray-200 space-y-3">
              {isAuthenticated && user ? (
                <>
                  <div className="py-2">
                    <p className="text-sm font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <button 
                    onClick={() => logout()}
                    className="block w-full text-left text-gray-700 font-medium py-2 hover:text-[#01A1C1]"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => setIsAuthModalOpen(true)}
                    className="block w-full text-left text-gray-700 font-medium py-2 hover:text-[#01A1C1]"
                  >
                    Log in
                  </button>
                  <Link to="/categories">
                    <Button className="w-full bg-[#01A1C1] hover:bg-[#0891B2] text-white">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
}
