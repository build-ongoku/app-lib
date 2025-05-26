import React from 'react';
import { AuthState } from '../../providers/AuthProvider';

/**
 * Props for NavLink component
 */
export interface NavLinkProps {
  href: string;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

/**
 * Generic NavLink component to be styled by implementation
 */
export const NavLink: React.FC<NavLinkProps> = ({
  href,
  label,
  isActive,
  onClick,
}) => (
  <a 
    href={href} 
    onClick={onClick}
    style={{ 
      fontWeight: isActive ? 'bold' : 'normal',
      borderBottom: isActive ? '2px solid currentColor' : 'none',
      textDecoration: 'none',
      cursor: 'pointer'
    }}
  >
    {label}
  </a>
);

/**
 * Props for Navbar component
 */
export interface NavbarAuthenticatedPropsV0 {
  authState: AuthState;
  currentPath: string;
  navLinks: Array<{ href: string; label: string }>;
  LoginButton: React.ReactNode;
  LogoutButton: React.ReactNode;
}

/**
 * Framework-agnostic navbar component
 */
export const NavbarAuthenticatedV0 = (props: NavbarAuthenticatedPropsV0) => {
  const { authState, currentPath, navLinks, LoginButton, LogoutButton } = props;
  const { isAuthenticated, user } = authState;

  return (
    <div style={{ 
      padding: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid #eaeaea',
      backgroundColor: 'white',
      position: 'sticky',
      top: 0,
      zIndex: 10,
    }}>
      {/* Navigation Links */}
      <div style={{ display: 'flex', gap: '2rem' }}>
        {navLinks.map(link => (
          <NavLink
            key={link.href}
            href={link.href}
            label={link.label}
            isActive={currentPath === link.href}
          />
        ))}
      </div>

      {/* Authentication */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {isAuthenticated ? (
          <>
            <span style={{ fontSize: '0.875rem' }}>
              Hello, {user?.given_name || user?.email}
            </span>
            {LogoutButton}
          </>
        ) : (
          LoginButton
        )}
      </div>
    </div>
  );
};
