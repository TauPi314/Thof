
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-auto py-4 text-sm text-muted-foreground border-t">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2">
        <div>
          © {new Date().getFullYear()} Thof. All rights reserved.
        </div>
        <div className="flex items-center gap-4">
          <Link to="/legal?tab=privacy" className="hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          <Link to="/legal?tab=terms" className="hover:text-primary transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
