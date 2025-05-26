import React, { useContext } from "react";
import { MantineProvider, MantineThemeContext, createTheme } from "@mantine/core";
// SafeMantineProvider - simplified to just render with fallback
export var SafeMantineProvider = function (_a) {
    var children = _a.children;
    return useContext(MantineThemeContext) ?
        React.createElement(React.Fragment, null, children) :
        React.createElement(MantineProvider, { theme: createTheme({ primaryColor: 'blue' }) }, children);
};
