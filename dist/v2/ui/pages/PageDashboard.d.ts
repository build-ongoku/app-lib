import React from "react";
/**
 * Next.js specific Dashboard implementation using Mantine UI
 */
export interface PageDashboardProps {
    LoginLink: React.FC<{
        children: React.ReactNode;
    }>;
    children?: React.ReactNode;
}
export declare const PageDashboard: (props: PageDashboardProps) => React.JSX.Element;
