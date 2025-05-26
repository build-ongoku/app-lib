"use client";

import React from "react";
import { Card, Title, Text, Container, Button, Stack } from "@mantine/core";
import { useApp, useAuth } from "../../providers/index-client";
import { SafeMantineProvider } from "../../providers/SafeMantineProvider";

/**
 * Next.js specific Dashboard implementation using Mantine UI
 */
export interface PageDashboardProps {
  LoginLink: React.FC<{ children: React.ReactNode }>;
  children?: React.ReactNode;
}

export const PageDashboard = (props: PageDashboardProps) => {
  const { LoginLink } = props;
  // Get auth state from AuthProvider
  const { isAuthenticated } = useAuth();

  // Get app state from AppProvider
  const { ongokuApp, loading, error } = useApp();

  // Not authenticated state
  if (!isAuthenticated) {
    return (
      <SafeMantineProvider>
        <Container size="sm" className="py-20">
          <Card withBorder shadow="sm" p="xl">
            <Stack align="center" gap="md">
              <Title order={2} ta="center" mt="sm">
                Welcome to Ongoku
              </Title>
              <Text ta="center">Please log in to access the Ongoku App.</Text>
              <LoginLink>
                <Button>Log In</Button>
              </LoginLink>
            </Stack>
          </Card>
        </Container>
      </SafeMantineProvider>
    );
  }

  // Loading state
  if (loading) {
    return (
      <SafeMantineProvider>
        <Container size="sm" className="py-20">
          <Card withBorder shadow="sm" p="xl">
            <Stack align="center" gap="md">
              <Title order={2} ta="center" mt="sm">
                Loading...
              </Title>
              <Text c="dimmed" ta="center">
                Please wait while we initialize the application.
              </Text>
            </Stack>
          </Card>
        </Container>
      </SafeMantineProvider>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeMantineProvider>
        <Container size="sm" className="py-20">
          <Card withBorder shadow="sm" p="xl">
            <Stack align="center" gap="md">
              <Title order={2} ta="center" mt="sm" c="red">
                Error
              </Title>
              <Text c="red" ta="center">
                {error.message}
              </Text>
            </Stack>
          </Card>
        </Container>
      </SafeMantineProvider>
    );
  }

  // App not loaded state
  if (!ongokuApp) {
    return (
      <SafeMantineProvider>
        <Container size="sm" className="py-20">
          <Card withBorder shadow="sm" p="xl">
            <Stack align="center" gap="md">
              <Title order={2} ta="center" mt="sm">
                App Not Loaded
              </Title>
              <Text c="dimmed" ta="center">
                The Ongoku app could not be loaded.
              </Text>
            </Stack>
          </Card>
        </Container>
      </SafeMantineProvider>
    );
  }

  // Success state - Ongoku app is loaded
  return (
    <SafeMantineProvider>
      <Container size="sm" className="py-20">
        <Card withBorder shadow="sm" p="xl">
          <Stack align="center" gap="md">
            <Title order={2} ta="center" mt="sm">
              Welcome to the Dashboard!
            </Title>
            <Text ta="center">
              You have successfully accessed the Dashboard
            </Text>

            {/* App Information Section */}
            <Card withBorder w="100%" mt="md" p="xl" radius="md">
              <Stack gap="md">
                <Title order={3}>App Information</Title>
                <Text>App Name: {ongokuApp.getName().toCapital()}</Text>
                <Text>Friendly Name: {ongokuApp.getNameFriendly()}</Text>
                <Text>Services: {ongokuApp.services.length}</Text>
                <Text>Entities: {ongokuApp.entityInfos.length}</Text>
                <Text>Types: {ongokuApp.typeInfos.length}</Text>
                <Text>Methods: {ongokuApp.methods.length}</Text>
                <Text>
                  Initialized: {ongokuApp.isInitialized ? "Yes" : "No"}
                </Text>
              </Stack>
            </Card>

            {/* Display services if available */}
            {ongokuApp.services.length > 0 && (
              <Card withBorder w="100%" mt="md" p="xl" radius="md">
                <Stack gap="md">
                  <Title order={3}>
                    Services ({ongokuApp.services.length})
                  </Title>
                  {ongokuApp.services.slice(0, 5).map((service, index) => (
                    <Card key={index} withBorder p="md" radius="md">
                      <Text>{service.namespace.service?.toCapital()}</Text>
                    </Card>
                  ))}
                  {ongokuApp.services.length > 5 && (
                    <Text c="dimmed" ta="center">
                      And {ongokuApp.services.length - 5} more services...
                    </Text>
                  )}
                </Stack>
              </Card>
            )}

            {/* Display entities if available */}
            {ongokuApp.entityInfos.length > 0 && (
              <Card withBorder w="100%" mt="md" p="xl" radius="md">
                <Stack gap="md">
                  <Title order={3}>
                    Entities ({ongokuApp.entityInfos.length})
                  </Title>
                  {ongokuApp.entityInfos.slice(0, 5).map((entity, index) => (
                    <Card key={index} withBorder p="md" radius="md">
                      <Text>{entity.namespace.entity?.toCapital()}</Text>
                    </Card>
                  ))}
                  {ongokuApp.entityInfos.length > 5 && (
                    <Text c="dimmed" ta="center">
                      And {ongokuApp.entityInfos.length - 5} more entities...
                    </Text>
                  )}
                </Stack>
              </Card>
            )}

            {/* Render children if provided */}
            {props.children && (
              <Card withBorder w="100%" mt="md" p="md">
                {props.children}
              </Card>
            )}
          </Stack>
        </Card>
      </Container>
    </SafeMantineProvider>
  );
};
