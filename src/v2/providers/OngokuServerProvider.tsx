"use client";

import React, { createContext, useContext } from "react";

/**
 * Ongoku Server context interface
 * Provides information about the Ongoku server configuration
 */
export interface OngokuServerState {
  // The API endpoint URL for the Ongoku server
  apiEndpoint: string;
  // The name of the Ongoku application
  appName: string;
  // Whether the server information is considered valid
  isValid: boolean;
}

/**
 * Default Ongoku server state
 */
const defaultOngokuServerState: OngokuServerState = {
  apiEndpoint: "",
  appName: "",
  isValid: false
};

/**
 * Create a context for the Ongoku server
 */
export const OngokuServerContext = createContext<OngokuServerState>(defaultOngokuServerState);

/**
 * Ongoku server provider props
 */
export interface OngokuServerProviderProps {
  apiEndpoint: string;
  appName: string;
  children?: React.ReactNode;
}

/**
 * Provider component for Ongoku server context
 * Provides server configuration information to the application
 */
export const OngokuServerProvider: React.FC<OngokuServerProviderProps> = ({
  apiEndpoint,
  appName,
  children
}) => {
  // Validate API endpoint
  if (!apiEndpoint || apiEndpoint.trim() === '') {
    throw new Error('OngokuServerProvider: apiEndpoint is required and cannot be empty');
  }
  
  // Validate app name
  if (!appName || appName.trim() === '') {
    throw new Error('OngokuServerProvider: appName is required and cannot be empty');
  }
  
  // At this point, all validation has passed
  const isValid = true;
  
  // Create the context value
  const contextValue: OngokuServerState = {
    apiEndpoint,
    appName,
    isValid
  };

  // Provide context values to children
  return (
    <OngokuServerContext.Provider value={contextValue}>
      {children}
    </OngokuServerContext.Provider>
  );
};

/**
 * Custom hook to use the Ongoku server context
 * Use this to access server information throughout the application
 */
export const useOngokuServer = (): OngokuServerState => useContext(OngokuServerContext);

/**
 * Higher-order component that requires Ongoku server information
 * Wraps components that need access to server configuration
 */
export function withOngokuServer<P extends object>(
  Component: React.ComponentType<P & { serverInfo: OngokuServerState }>
): React.FC<P> {
  return (props: P) => {
    const serverInfo = useOngokuServer();
    
    if (!serverInfo.isValid) {
      return <div>Ongoku server configuration is not valid</div>;
    }
    
    return <Component {...props} serverInfo={serverInfo} />;
  };
}

// Helper function to get the app name from env variables
export const getAppNameHelper = (): string => {
  // Default
  let appName = process.env.GOKU_APP_NAME
  if (!appName) { // Next.js
    appName = process.env.NEXT_PUBLIC_GOKU_APP_NAME
  }
  if (!appName) { // Expo
    appName = process.env.EXPO_PUBLIC_GOKU_APP_NAME
  }
  if (!appName) { // Default
    // Throw error
    throw new Error('OngokuServerProvider: App name not set. Please set the GOKU_APP_NAME (or equivalent e.g. NEXT_PUBLIC_GOKU_APP_NAME or EXPO_PUBLIC_GOKU_APP_NAME) environment variable.')
  }
  return appName
}

// Helper function to construct the API base endpoint from env variables
export const constructAPIBaseURLHelper = (params?: { protocol?: string, host?: string, port?: string }): string => {
  let { protocol, host, port } = params || {}

  // Host
  if (!host) { // Default env variable
    host = process.env.GOKU_BACKEND_HOST
  }
  if (!host) { // Next.js
    host = process.env.NEXT_PUBLIC_GOKU_BACKEND_HOST
  }
  if (!host) { // Expo
    host = process.env.EXPO_PUBLIC_GOKU_BACKEND_HOST
  }
  // Note: add any other specific environment variables name for the host here
  // Default
  if (!host) {
    console.warn('[OngokuServerProvider] [constructAPIBaseURL] Host not set. Defaulting to localhost')
    host = 'localhost'
  }

  // Protocol
  if (!protocol) { // Default env variable
    protocol = process.env.GOKU_BACKEND_PROTOCOL
  }
  if (!protocol) { // Next.js
    protocol = process.env.NEXT_PUBLIC_GOKU_BACKEND_PROTOCOL
  }
  if (!protocol) { // Expo
    protocol = process.env.EXPO_PUBLIC_GOKU_BACKEND_PROTOCOL
  }
  if (!protocol) { // Use current window protocol
    protocol = window?.location?.protocol
    if (protocol) {
      console.log('[OngokuServerProvider] [constructAPIBaseURL] Setting protocol to window.location.protocol', protocol)
    }
  }
  if (!protocol) { // Default to https
    protocol = 'https:'
    console.warn('[OngokuServerProvider] [constructAPIBaseURL] Protocol not set. Defaulting to https.')
  }
  // Ensure protocol is valid
  if (protocol === 'http' || protocol === 'https') {
    protocol = protocol + ':'
  }

  // Port
  if (!port) { // Default env variable
    port = process.env.GOKU_BACKEND_PORT
  }
  if (!port) { // Next.js
    port = process.env.NEXT_PUBLIC_GOKU_BACKEND_PORT
  }
  if (!port) { // Expo
    port = process.env.EXPO_PUBLIC_GOKU_BACKEND_PORT
  }
  if (!port) {
    console.warn('[OngokuServerProvider] [constructAPIBaseURL] Port not set. Leaving empty.')
  }

  const url = `${protocol}//${host}` + (port ? `:${port}` : '') + '/api'
  console.log('[OngokuServerProvider] [constructAPIBaseURL]', 'url: ', url)

  return url
}
