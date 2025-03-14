
import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

// Import the newly created components
import NavItem from './navbar/NavItem';
import Breadcrumb from './navbar/Breadcrumb';
import Footer from './navbar/Footer';
import MobileNav from './navbar/MobileNav';
import DesktopNav from './navbar/DesktopNav';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-350 ease-in-out px-4 md:px-6",
        isScrolled ? "py-3 glass-card" : "py-5 bg-transparent"
      )}>
        <div className="container mx-auto flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-white font-bold">TF</span>
            </span>
            <span className="font-display font-semibold text-xl">Thof</span>
          </NavLink>
          
          {isMobile ? (
            <MobileNav isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
          ) : (
            <DesktopNav />
          )}
        </div>
      </header>
      <div className="h-20"></div> {/* Spacer for fixed header */}
      <Breadcrumb />
      <Footer />
    </>
  );
};

export default Navbar;
