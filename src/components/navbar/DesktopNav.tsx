
import React from 'react';
import NavItem from './NavItem';
import PiLoginButton from '@/components/PiLoginButton';
import { Upload, ThumbsUp, Eye, User } from 'lucide-react';

const DesktopNav = () => {
  const navItems = [
    { to: "/", label: "Home", icon: <></> },
    { to: "/upload", label: "Upload", icon: <Upload size={18} /> },
    { to: "/vote", label: "Vote", icon: <ThumbsUp size={18} /> },
    { to: "/projects", label: "Projects", icon: <Eye size={18} /> },
    { to: "/profile", label: "Profile", icon: <User size={18} /> },
  ];

  return (
    <div className="flex items-center gap-6">
      <nav className="flex gap-6">
        {navItems.map((item) => (
          <NavItem 
            key={item.label} 
            to={item.to} 
            icon={item.icon}
          >
            {item.label}
          </NavItem>
        ))}
      </nav>
      <PiLoginButton />
    </div>
  );
};

export default DesktopNav;
