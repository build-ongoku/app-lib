"use client";

import React, { createContext, useContext } from "react";
import { Router } from "../utils";

/**
 * Context for framework-specific components and utilities
 * This allows app-lib components to use host framework components (Next.js, React Router, etc.)
 * without direct prop passing
 */
interface UIFrameworkContextType {
  // Link component (Next.js Link, React Router Link, etc)
  LinkComponent: any;
  
  // Router object or functions (can be expanded)
  router: Router;

  // Current pathname for active link detection
  pathname?: string;
  
  // Can add more framework utilities here
  notifications?: any;
  modals?: any;
}

// Default value when context is not provided
const defaultContext: UIFrameworkContextType = {
  // Default to plain anchor tags when no context is provided
  LinkComponent: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: any }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
  router: {
    push: (url: string) => {
      console.log('Pushing to:', url);
    },
    replace: (url: string) => {
      console.log('Replasing to:', url);
    },
    back: () => {
      console.log('Going back');
    },
  },
};

export const UIFrameworkContext = createContext<UIFrameworkContextType>(defaultContext);

/**
 * Hook to access framework components and utilities
 */
export const useUIFramework = () => useContext(UIFrameworkContext);

// Convenience hook that only returns the LinkComponent (for backward compatibility)
export const useLink = () => {
  const { LinkComponent } = useContext(UIFrameworkContext);
  return { LinkComponent };
};

// No longer providing auth-related hooks since we have a dedicated AuthProvider

/**
 * Provider component to wrap application with framework context
 * Similar to the SafeMantineProvider pattern used elsewhere in the app
 */
export interface UIFrameworkProviderProps {
  children: React.ReactNode;
  linkComponent: any;
  router: Router;
  pathname?: string;
  notifications?: any;
  modals?: any;
}

export const UIFrameworkProvider: React.FC<UIFrameworkProviderProps> = ({ 
  children, 
  linkComponent,
  router,
  pathname,
  notifications,
  modals
}) => {
  return (
    <UIFrameworkContext.Provider value={{ 
      LinkComponent: linkComponent,
      router,
      pathname,
      notifications,
      modals
    }}>
      {children}
    </UIFrameworkContext.Provider>
  );
};

// Export the original LinkProvider for backward compatibility
export const LinkProvider = UIFrameworkProvider;
