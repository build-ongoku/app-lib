'use client';

// Main entry point for the library
// WARNING: Importing from this file in a server component will cause errors
// due to client-side code being included

export * from './core';
export * from './providers';
export * from './ui';
export * from './utils';

// Basic types (these are safe in any context)
export interface AppConfig {
  name: string;
  version: string;
  description?: string;
}

// Constants
export const VERSION = '0.1.0';

// Utility functions (safe in any context)
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString();
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// App utility functions
export const getAppVersion = (config: AppConfig): string => {
  return `v${config.version}`;
};

export const getAppInfo = (config: AppConfig): string => {
  return `${config.name} ${getAppVersion(config)}${config.description ? `: ${config.description}` : ''}`;
};

// This is a dummy function to simulate what would be a React component
export const createAppProvider = (config: AppConfig): { appConfig: AppConfig } => {
  return { appConfig: config };
};

// This type definition is now exported from './providers/AppProvider'
// So we don't need to redefine it here

// This is a dummy function to simulate what would be a React hook
export const useApp = (provider: { appConfig: AppConfig }): AppConfig => {
  return provider.appConfig;
};