import React from "react";
/**
 * Ongoku Server context interface
 * Provides information about the Ongoku server configuration
 */
export interface OngokuServerState {
    apiEndpoint: string;
    appName: string;
    isValid: boolean;
}
/**
 * Create a context for the Ongoku server
 */
export declare const OngokuServerContext: React.Context<OngokuServerState>;
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
export declare const OngokuServerProvider: React.FC<OngokuServerProviderProps>;
/**
 * Custom hook to use the Ongoku server context
 * Use this to access server information throughout the application
 */
export declare const useOngokuServer: () => OngokuServerState;
/**
 * Higher-order component that requires Ongoku server information
 * Wraps components that need access to server configuration
 */
export declare function withOngokuServer<P extends object>(Component: React.ComponentType<P & {
    serverInfo: OngokuServerState;
}>): React.FC<P>;
export declare const getAppNameHelper: () => string;
export declare const constructAPIBaseURLHelper: (params?: {
    protocol?: string;
    host?: string;
    port?: string;
}) => string;
