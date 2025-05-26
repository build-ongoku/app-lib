import React, { createContext, useEffect, useContext, useState, useCallback } from 'react';
import { OngokuApp, createDefaultAppReq, OngokuConfig } from '../core/app';
import { AppReq } from '../core/app';
import { useAuth } from './AuthProvider';

/**
 * App context state interface
 */
export interface AppContextState {
  ongokuApp: OngokuApp | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Default app context state
 */
const defaultAppContextState: AppContextState = {
  ongokuApp: null,
  loading: false,
  error: null
};

/**
 * Create a context for the app
 */
export const AppContext = createContext<AppContextState>(defaultAppContextState);

/**
 * App provider props
 */
export interface AppProviderProps {
  appReq: AppReq;
  apiEndpoint?: string;
  authToken?: string;
  children?: React.ReactNode;
  applyOverrides?: (app: OngokuApp) => Promise<OngokuApp>;
}

/**
 * Framework-agnostic app provider component
 */
export const AppProvider: React.FC<AppProviderProps> = ({
  appReq,
  apiEndpoint = "https://api.ongoku.com",
  authToken,
  children,
  applyOverrides
}) => {
  // State for the app
  const [app, setApp] = useState<OngokuApp | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Memoize the initialization function to maintain stable reference
  const initializeApp = useCallback(async () => {
    // If already initializing, don't start again
    if (loading) return;
    
    try {
      // Mark as loading
      setLoading(true);
      
      // Create the config
      const config: OngokuConfig = {
        apiEndpoint,
        authToken
      };
      
      // Create a fresh app instance
      let currentApp = new OngokuApp(appReq, config);
      
      // Apply any overrides if provided
      if (applyOverrides) {
        try {
          currentApp = await applyOverrides(currentApp);
        } catch (e) {
          const errMsg = '[AppProvider] Failed to apply overrides';
          console.error(errMsg, e);
          throw e;
        }
      }

      // Set app as initialized
      currentApp.setInitialized(true);
      
      // Update state
      setApp(currentApp);
      setError(null);
    } catch (e) {
      console.error('[AppProvider] Initialization error:', e);
      setApp(null);
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setLoading(false);
    }
  }, [appReq, apiEndpoint, authToken, applyOverrides, loading]);

  // Initialize app on mount
  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  // Create the context value
  const contextValue: AppContextState = {
    ongokuApp: app,
    loading,
    error
  };

  // Provide context values to children
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};


/**
 * Custom hook to use the app context
 */
export const useApp = (): AppContextState => useContext(AppContext);


/**
 * Higher-order component that requires Ongoku app access
 */
export function withApp<P extends object>(
    Component: React.ComponentType<P & { ongokuApp: OngokuApp }>
  ): React.FC<P> {
    return (props: P) => {
      const { ongokuApp, loading, error } = useApp();
      const { isAuthenticated } = useAuth();
      
      if (!isAuthenticated) {
        return <div>Please log in to access this content</div>;
      }
      
      if (loading) {
        return <div>Loading app...</div>;
      }
      
      if (error) {
        return <div>Error loading app: {error.message}</div>;
      }
      
      if (!ongokuApp) {
        return <div>App not initialized</div>;
      }
      
      return <Component {...props} ongokuApp={ongokuApp} />;
    };
  }


