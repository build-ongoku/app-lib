import React from "react";
/**
 * Next.js specific Home page implementation
 */
export interface PageIndexProps {
    appName?: string;
    /** Auth-related props (optional - will use context if not provided) */
    isAuthenticated?: boolean;
    isAuthLoading?: boolean;
    /** Auth UI components */
    LoginLink: React.FC<{
        children: React.ReactNode;
    }>;
    RegisterLink: React.FC<{
        children: React.ReactNode;
    }>;
    LogoutLink: React.FC<{
        children: React.ReactNode;
    }>;
}
export declare const PageIndex: (props: PageIndexProps) => React.JSX.Element;
