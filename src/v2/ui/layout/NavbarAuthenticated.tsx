"use client";

import React, { useEffect, useState } from 'react';
import { 
  NavLink, 
  ScrollArea, 
  Text, 
  Box, 
  Stack, 
  Collapse,
  rem
} from '@mantine/core';
import { 
  MdDashboard, 
  MdExpandMore, 
  MdExpandLess, 
  MdHome, 
  MdApps, 
  MdFolder, 
  MdSettings 
} from 'react-icons/md';
import { SafeMantineProvider, useApp, useUIFramework } from '../../index-client';

interface NavbarAuthenticatedProps {
  onLinkClick?: () => void;
}

export function NavbarAuthenticated({ onLinkClick }: NavbarAuthenticatedProps) {
  const { LinkComponent, pathname = '' } = useUIFramework();
  const { ongokuApp } = useApp();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [serviceLinks, setServiceLinks] = useState<Array<{ slug: string; name: string }>>([]);
  
  useEffect(() => {
    // Extract a section from pathname if it's part of a section
    if (pathname && pathname.startsWith('/svc/')) {
      const parts = pathname.split('/');
      if (parts.length >= 3) {
        setActiveSection('services');
      }
    }
    
    // Load services if ongokuApp is available
    if (ongokuApp) {
      // In a real app, you'd get a list of services from the app
      // For now we'll just hardcode some examples
      setServiceLinks([
        { slug: 'cms', name: 'Content Management' },
        { slug: 'auth', name: 'Authentication' },
        { slug: 'analytics', name: 'Analytics' }
      ]);
    }
  }, [pathname, ongokuApp]);

  const toggleSection = (section: string) => {
    setActiveSection(prev => prev === section ? null : section);
  };

  const iconProps = { style: { width: rem(20), height: rem(20) } };

  return (
    <SafeMantineProvider>
    <Box>
      <Text size="sm" fw={500} mb="md">Main Navigation</Text>
      
      <ScrollArea scrollbarSize={6} h="calc(100vh - 140px)">
        <Stack gap="xs">
          {/* Dashboard Link */}
          <NavLink
            label="Dashboard"
            leftSection={<MdDashboard {...iconProps} />}
            active={pathname === '/dashboard'}
            component={LinkComponent}
            href="/dashboard"
            onClick={onLinkClick}
          />
          
          {/* Home Link */}
          <NavLink
            label="Home"
            leftSection={<MdHome {...iconProps} />}
            active={pathname === '/'}
            component={LinkComponent}
            href="/"
            onClick={onLinkClick}
          />
          
          {/* Services Section */}
          <NavLink
            label="Services"
            leftSection={<MdApps {...iconProps} />}
            rightSection={
              activeSection === 'services' 
                ? <MdExpandLess {...iconProps} /> 
                : <MdExpandMore {...iconProps} />
            }
            onClick={() => toggleSection('services')}
            active={pathname.includes('/svc/')}
          />
          
          <Collapse in={activeSection === 'services'}>
            <Stack gap={0} ml="md" pl="xs">
              {serviceLinks.map((service) => (
                <NavLink
                  key={service.slug}
                  label={service.name}
                  leftSection={<MdFolder {...iconProps} />}
                  active={pathname.includes(`/svc/${service.slug}/`)}
                  component={LinkComponent}
                  href={`/svc/${service.slug}`}
                  onClick={onLinkClick}
                />
              ))}
            </Stack>
          </Collapse>
          
          {/* Settings Link */}
          <NavLink
            label="Settings"
            leftSection={<MdSettings {...iconProps} />}
            active={pathname === '/settings'}
            component={LinkComponent}
            href="/settings"
            onClick={onLinkClick}
          />
        </Stack>
      </ScrollArea>
    </Box>
    </SafeMantineProvider>
  );
}
