import React from "react";
import { Router } from "../utils";
/**
 * Context for framework-specific components and utilities
 * This allows app-lib components to use host framework components (Next.js, React Router, etc.)
 * without direct prop passing
 */
interface UIFrameworkContextType {
    LinkComponent: any;
    router: Router;
    pathname?: string;
    notifications?: any;
    modals?: any;
}
export declare const UIFrameworkContext: React.Context<UIFrameworkContextType>;
/**
 * Hook to access framework components and utilities
 */
export declare const useUIFramework: () => UIFrameworkContextType;
export declare const useLink: () => {
    LinkComponent: any;
};
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
export declare const UIFrameworkProvider: React.FC<UIFrameworkProviderProps>;
export declare const LinkProvider: React.FC<UIFrameworkProviderProps>;
export {};
