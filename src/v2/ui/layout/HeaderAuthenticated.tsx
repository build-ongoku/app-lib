"use client";

import React from 'react';
import { Burger, Group, UnstyledButton, Avatar, Text, Menu, rem, Divider } from '@mantine/core';
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs';
import { MdLogout, MdSettings, MdPerson } from 'react-icons/md';
import { SafeMantineProvider, useUIFramework } from '../../index-client';

interface HeaderAuthenticatedProps {
  opened: boolean;
  toggle: () => void;
  user: any; // Using any for now, can be typed properly based on your auth structure
}

export function HeaderAuthenticated({ opened, toggle, user }: HeaderAuthenticatedProps) {
  const {LinkComponent} = useUIFramework();
  return (
    <SafeMantineProvider>
    <Group justify="space-between" h="100%" px="md">
      <Group>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <LinkComponent href="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Group>
            <Text fw={700} size="lg">Ongoku Admin</Text>
          </Group>
        </LinkComponent>
      </Group>

      {user && (
        <Menu 
          width={200} 
          position="bottom-end" 
          withArrow 
          arrowPosition="center"
        >
          <Menu.Target>
            <UnstyledButton>
              <Group gap="xs">
                <Avatar 
                  src={user.picture || null} 
                  alt={user.given_name || "User"} 
                  radius="xl" 
                  size="sm"
                >
                  {user.given_name ? user.given_name[0] : "U"}
                </Avatar>
                <div style={{ flex: 1 }}>
                  <Text size="sm" fw={500}>
                    {user.given_name} {user.family_name}
                  </Text>
                  <Text c="dimmed" size="xs">
                    {user.email}
                  </Text>
                </div>
              </Group>
            </UnstyledButton>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Account</Menu.Label>
            
            <Menu.Item
              leftSection={<MdPerson style={{ width: rem(14), height: rem(14) }} />}
              component={LinkComponent}
              href="/profile"
            >
              Profile
            </Menu.Item>
            
            <Menu.Item
              leftSection={<MdSettings style={{ width: rem(14), height: rem(14) }} />}
              component={LinkComponent}
              href="/settings"
            >
              Settings
            </Menu.Item>
            
            <Divider />
            
            <LogoutLink>
              <Menu.Item
                leftSection={<MdLogout style={{ width: rem(14), height: rem(14) }} />}
                color="red"
              >
                Log out
              </Menu.Item>
            </LogoutLink>
          </Menu.Dropdown>
        </Menu>
      )}
    </Group>
    </SafeMantineProvider>
  );
}
