
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavItemProps {
  to: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
}

const NavItem = ({ to, children, icon, onClick }: NavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <NavLink 
      to={to} 
      onClick={onClick}
      className={({ isActive }) => cn(
        "relative px-3 py-2 transition-all duration-250 font-medium flex items-center gap-2",
        isActive 
          ? "text-primary" 
          : "text-muted-foreground hover:text-primary"
      )}
    >
      {icon}
      {children}
      <span className={cn(
        "absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 transition-transform duration-250",
        isActive && "scale-x-100"
      )} />
    </NavLink>
  );
};

export default NavItem;
