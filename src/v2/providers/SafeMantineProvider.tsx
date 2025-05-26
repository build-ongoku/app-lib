
import React, { useContext } from "react";
import { MantineProvider, MantineThemeContext, createTheme } from "@mantine/core";


// SafeMantineProvider - simplified to just render with fallback
export const SafeMantineProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return useContext(MantineThemeContext) ? 
    <>{children}</> : 
    <MantineProvider theme={createTheme({ primaryColor: 'blue' })}>{children}</MantineProvider>;
};