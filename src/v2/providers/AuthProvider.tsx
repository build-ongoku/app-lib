"use client";

import React, { createContext, useContext } from "react";

/**
 * Auth context interface - generic enough to work with any auth provider
 */
export interface AuthState {
  // Common auth properties regardless of provider
  isAuthenticated: boolean;
  isLoading: boolean;
  user?: AuthUser & {[key: string]: any};
  authToken?: string;
  authSource: 'kinde' | 'other'
  // Common auth methods
  login?: () => void;
  logout?: () => void;
  register?: () => void;
  // Method to get raw auth state from provider (for advanced cases)
  getRawAuthState?: () => any;
}

export interface AuthUser {
    id: string;
    email?: string;
    given_name?: string;
}

// Default auth state when not authenticated
const defaultAuthContext: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  authSource: 'other'
};

// Create the context
export const AuthContext = createContext<AuthState>(defaultAuthContext);

/**
 * Hook to access authentication state
 */
export const useAuth = (): AuthState => {
  return useContext(AuthContext);
};

export interface AuthProviderProps {
  children: React.ReactNode;
  authState: AuthState;
}

/**
 * Provider component for auth context
 * Wraps the application to provide authentication state
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ 
  children, 
  authState 
}) => {
  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
};