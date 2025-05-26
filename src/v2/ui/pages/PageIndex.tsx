"use client";

import React from "react";
import { Button, Container, Image, Stack, Title, Center } from "@mantine/core";
import { SafeMantineProvider, useUIFramework, useAuth,  } from "../../providers/index-client";

/**
 * Next.js specific Home page implementation
 */
export interface PageIndexProps {
  appName?: string;
  /** Auth-related props (optional - will use context if not provided) */
  isAuthenticated?: boolean;
  isAuthLoading?: boolean;
  /** Auth UI components */
  LoginLink: React.FC<{ children: React.ReactNode }>;
  RegisterLink: React.FC<{ children: React.ReactNode }>;
  LogoutLink: React.FC<{ children: React.ReactNode }>;
  // Link component is now provided via context
}

export const PageIndex = (props: PageIndexProps) => {
  // Destructure all props at once
  const {
    appName = "Ongoku Admin Tool",
    // Auth props are optional as we can get them from context
    isAuthenticated: propIsAuthenticated,
    isAuthLoading: propIsAuthLoading,
    LoginLink,
    RegisterLink,
    LogoutLink
  } = props;

  // Get UI framework components
  const { LinkComponent } = useUIFramework();
  
  // Get auth from dedicated AuthProvider
  const authContext = useAuth();
  
  // Use props if provided, otherwise fall back to context
  // Priority: 1. Props, 2. AuthProvider
  // This allows the component to work with or without explicit auth props
  const isAuthenticated = propIsAuthenticated !== undefined 
    ? propIsAuthenticated 
    : authContext.isAuthenticated;
      
  const isAuthLoading = propIsAuthLoading !== undefined 
    ? propIsAuthLoading 
    : authContext.isLoading;
  
  // Common button styles
  const btnStyle = { minWidth: "200px" };

  // Mantine-styled version of Home with inline components
  return (
    <SafeMantineProvider>
      <Center style={{ minHeight: "100vh" }}>
        <Container size="sm">
          <Stack align="center" gap="xl">
            {/* Logo */}
            <Image
              src="/logo/logo-spike-blk-lg.png"
              alt="Ongoku Logo"
              w="auto"
              fit="contain"
              h={120}
            />

            <Title order={1} ta="center">{appName}</Title>

            <Stack align="center" gap="md" style={{ minWidth: "200px" }}>
              {isAuthLoading ? (
                <Button disabled>Loading...</Button>
              ) : isAuthenticated ? (
                <>
                  {/* Dashboard button */}
                  <Button
                    component={LinkComponent}
                    href="/dashboard"
                    color="blue"
                    size="md"
                    fullWidth
                    style={btnStyle}
                  >
                    Dashboard
                  </Button>
                  
                  {/* Logout button */}
                  <LogoutLink>
                    <Button variant="outline" color="red" size="md" fullWidth style={btnStyle}>
                      Log out
                    </Button>
                  </LogoutLink>
                </>
              ) : (
                <>
                  {/* Login button */}
                  <LoginLink>
                    <Button color="blue" size="md" fullWidth style={btnStyle}>
                      Log in
                    </Button>
                  </LoginLink>
                  
                  {/* Register button */}
                  <RegisterLink>
                    <Button variant="outline" color="blue" size="md" fullWidth style={btnStyle}>
                      Register
                    </Button>
                  </RegisterLink>
                </>
              )}
            </Stack>
          </Stack>
        </Container>
      </Center>
    </SafeMantineProvider>
  );
};
