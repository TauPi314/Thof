
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);
  
  if (pathnames.length === 0) return null;
  
  return (
    <div className="container mx-auto px-4 py-2 text-sm text-muted-foreground">
      <NavLink to="/" className="hover:text-primary">Home</NavLink>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        
        return (
          <span key={name}>
            <span className="mx-2">/</span>
            {isLast ? (
              <span className="font-medium text-primary capitalize">{name}</span>
            ) : (
              <NavLink 
                to={routeTo} 
                className="hover:text-primary capitalize"
              >
                {name}
              </NavLink>
            )}
          </span>
        );
      })}
    </div>
  );
};

export default Breadcrumb;
