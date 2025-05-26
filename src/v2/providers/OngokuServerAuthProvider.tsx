"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useOngokuServer } from './OngokuServerProvider';
import { useAuth } from './AuthProvider';

// Storage key for the Ongoku server token
const ONGOKU_TOKEN_STORAGE_KEY = 'ongoku_auth_token';

/**
 * Ongoku Server Auth context interface
 * Provides authentication state with the Ongoku server
 */
export interface OngokuServerAuthState {
  // The authentication token for the Ongoku server
  token: string | null;
  // Whether the authentication is in progress
  isLoading: boolean;
  // Error if authentication failed
  error: Error | null;
  // Whether the authentication was successful
  isAuthenticated: boolean;
  // Method to manually authenticate with a token
  authenticate: (kindeToken: string) => Promise<void>;
}

/**
 * Default Ongoku server auth state
 */
const defaultOngokuServerAuthState: OngokuServerAuthState = {
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  authenticate: async () => {
    throw new Error('OngokuServerAuth not initialized');
  }
};

/**
 * Create a context for the Ongoku server authentication
 */
export const OngokuServerAuthContext = createContext<OngokuServerAuthState>(defaultOngokuServerAuthState);

/**
 * Ongoku server auth provider props
 */
export interface OngokuServerAuthProviderProps {
  children?: React.ReactNode;
}

/**
 * Provider component for Ongoku server authentication
 * Handles authentication with the Ongoku server using a Kinde token
 */
export const OngokuServerAuthProvider: React.FC<OngokuServerAuthProviderProps> = ({
  children,
}) => {
  // Get server information
  const { apiEndpoint, isValid: isServerValid } = useOngokuServer();
  
  // Get authentication state from AuthProvider
  const { authToken: kindeToken, isAuthenticated: isAuthProviderAuthenticated, authSource } = useAuth();
  
  // State for token management
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Initialize token from localStorage on mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem(ONGOKU_TOKEN_STORAGE_KEY);
        if (token) {
          setTokenState(token);
          console.log('[OngokuServerAuth] Initialized token from localStorage');
        }
      }
    } catch (e) {
      console.error('[OngokuServerAuth] Failed to read token from localStorage', e);
    }
  }, []);
  


  // Wrapper for setToken that also updates localStorage
  const setToken = useCallback((newToken: string | null) => {
    setTokenState(newToken);
    
    try {
      if (typeof window !== 'undefined') {
        if (newToken) {
          // Store the token in localStorage
          localStorage.setItem(ONGOKU_TOKEN_STORAGE_KEY, newToken);
          console.log('[OngokuServerAuth] Token stored in localStorage');
        } else {
          // Remove the token from localStorage
          localStorage.removeItem(ONGOKU_TOKEN_STORAGE_KEY);
          console.log('[OngokuServerAuth] Token removed from localStorage');
        }
      }
    } catch (e) {
      console.error('[OngokuServerAuth] Failed to update token in localStorage', e);
    }
  }, []);

  // Authentication function
  const authenticate = useCallback(async (tokenToUse: string) => {
    if (!isServerValid) {
      throw new Error('OngokuServerAuthProvider: Server configuration is not valid');
    }

    if (!tokenToUse) {
      throw new Error('OngokuServerAuthProvider: Kinde token is required');
    }

    try {
      setIsLoading(true);
      setError(null);

      // Build the authentication URL
      const authUrl = `${apiEndpoint}/v1/auth/authenticate_token_kinde`;
      
      // Make the authentication request
      const response = await fetch(authUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: tokenToUse
        })
      });

      // Handle response errors
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Authentication failed: ${response.status} ${errorText}`);
      }

      // Parse the response
      const responseData = await response.json();
      
      // Check for API error
      if (responseData.error) {
        throw new Error(`API Error: ${responseData.error}`);
      }
      
      // Extract the token from the response
      const { token: ongokuToken } = responseData.data || {};
      
      if (!ongokuToken) {
        throw new Error('Authentication response did not include a token');
      }
      
      // Store the token in state and cookie
      setToken(ongokuToken);
      
      // Log success message
      console.log('[OngokuServerAuthProvider] Successfully authenticated with Ongoku server');
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error('[OngokuServerAuthProvider] Authentication error:', error);
      setError(error);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, [apiEndpoint, isServerValid]);

  // Track whether we've attempted authentication with the current token
  const [hasAttemptedAuth, setHasAttemptedAuth] = useState<boolean>(false);

  // Reset auth state when auth provider state changes
  useEffect(() => {
    // Reset our token if AuthProvider becomes unauthenticated
    if (!isAuthProviderAuthenticated) {
      setToken(null);
      setError(null);
      setHasAttemptedAuth(false); // Reset attempt tracking
      return;
    }

    // Validate auth source
    if (authSource !== 'kinde') {
      setError(new Error('OngokuServerAuthProvider requires authentication source to be kinde'));
      setToken(null);
      setHasAttemptedAuth(false); // Reset attempt tracking
      return;
    }

    // Reset attempt flag when token changes
    if (kindeToken) {
      setHasAttemptedAuth(false);
    }
  }, [isAuthProviderAuthenticated, authSource, kindeToken]);

  // Handle authentication attempts
  useEffect(() => {
    // Only proceed if conditions are right for authentication
    const shouldAuthenticate = 
      isAuthProviderAuthenticated && // AuthProvider is authenticated
      authSource === 'kinde' &&     // Auth source is kinde
      kindeToken &&                  // We have a token
      isServerValid &&             // Server config is valid
      !token &&                    // We're not already authenticated
      !hasAttemptedAuth &&         // Haven't tried with this token yet
      !isLoading;                  // Not currently loading

    if (shouldAuthenticate) {
      setHasAttemptedAuth(true); // Mark that we've attempted with this token
      
      authenticate(kindeToken).catch(err => {
        console.error('[OngokuServerAuthProvider] Authentication failed:', err);
        // Error is already set in the authenticate function
      });
    }
  }, [kindeToken, authSource, isServerValid, token, isLoading, authenticate, 
      isAuthProviderAuthenticated, hasAttemptedAuth]);

  // Create the context value
  const contextValue: OngokuServerAuthState = {
    token,
    isLoading,
    error,
    isAuthenticated: Boolean(token),
    authenticate
  };

  // Provide context values to children
  return (
    <OngokuServerAuthContext.Provider value={contextValue}>
      {children}
    </OngokuServerAuthContext.Provider>
  );
};

/**
 * Custom hook to use the Ongoku server auth context
 * Use this to access authentication state and methods throughout the application
 */
export const useOngokuServerAuth = (): OngokuServerAuthState => useContext(OngokuServerAuthContext);

/**
 * Higher-order component that requires Ongoku server authentication
 * Wraps components that need access to authentication state
 */
export function withOngokuServerAuth<P extends object>(
  Component: React.ComponentType<P & { auth: OngokuServerAuthState }>
): React.FC<P> {
  return (props: P) => {
    const auth = useOngokuServerAuth();
    
    if (auth.isLoading) {
      return <div>Authenticating with Ongoku server...</div>;
    }
    
    if (auth.error) {
      return <div>Authentication error: {auth.error.message}</div>;
    }
    
    if (!auth.isAuthenticated) {
      return <div>Not authenticated with Ongoku server</div>;
    }
    
    return <Component {...props} auth={auth} />;
  };
}
