
import React from 'react';
import { Menu, X, Upload, ThumbsUp, Eye, User, Shield } from 'lucide-react';
import NavItem from './NavItem';
import PiLoginButton from '@/components/PiLoginButton';

interface MobileNavProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

const MobileNav = ({ isMenuOpen, setIsMenuOpen }: MobileNavProps) => {
  const closeMenu = () => setIsMenuOpen(false);
  
  const navItems = [
    { to: "/", label: "Home", icon: <></> },
    { to: "/upload", label: "Upload", icon: <Upload size={18} /> },
    { to: "/vote", label: "Vote", icon: <ThumbsUp size={18} /> },
    { to: "/projects", label: "Projects", icon: <Eye size={18} /> },
    { to: "/profile", label: "Profile", icon: <User size={18} /> },
  ];

  return (
    <>
      <div className="flex items-center gap-2">
        <PiLoginButton variant="outline" size="sm" />
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-full hover:bg-secondary transition-colors duration-250"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {isMenuOpen && (
        <div className="fixed inset-0 top-[60px] bg-background/95 backdrop-blur-sm z-40 animate-fade-in">
          <nav className="flex flex-col items-center justify-center gap-8 py-10">
            {navItems.map((item) => (
              <NavItem 
                key={item.label} 
                to={item.to} 
                icon={item.icon} 
                onClick={closeMenu}
              >
                {item.label}
              </NavItem>
            ))}
            <NavItem 
              to="/legal?tab=privacy" 
              icon={<Shield size={18} />}
              onClick={closeMenu}
            >
              Legal
            </NavItem>
          </nav>
        </div>
      )}
    </>
  );
};

export default MobileNav;
