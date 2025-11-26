import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl medical-gradient flex items-center justify-center">
              <Activity className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground">HealthLog</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    isActive('/dashboard') ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  Dashboard
                </Link>
                <Link
                  to="/records"
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    isActive('/records') ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  Records
                </Link>
                <Link
                  to="/timeline"
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    isActive('/timeline') ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  Timeline
                </Link>
                <div className="flex items-center gap-3 ml-4 pl-4 border-l">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{user?.name}</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="medical">Register</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t animate-fade-in">
            {isAuthenticated ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 px-2 py-3 bg-muted rounded-lg mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{user?.name}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <Link
                  to="/dashboard"
                  className={cn(
                    "px-3 py-2 rounded-lg transition-colors",
                    isActive('/dashboard') ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/records"
                  className={cn(
                    "px-3 py-2 rounded-lg transition-colors",
                    isActive('/records') ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  Records
                </Link>
                <Link
                  to="/timeline"
                  className={cn(
                    "px-3 py-2 rounded-lg transition-colors",
                    isActive('/timeline') ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  Timeline
                </Link>
                <Button
                  variant="ghost"
                  className="justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    Login
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)}>
                  <Button variant="medical" className="w-full">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
