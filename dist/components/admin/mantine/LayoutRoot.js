import { AuthProvider } from '../../../common/AuthContext.js';
import React__default from 'react';
import { ColorSchemeScript } from '../../../node_modules/@mantine/core/esm/core/MantineProvider/ColorSchemeScript/ColorSchemeScript.js';
import { MantineProvider } from '../../../node_modules/@mantine/core/esm/core/MantineProvider/MantineProvider.js';
import { Notifications } from '../../../node_modules/@mantine/notifications/esm/Notifications.js';
import { createTheme } from '../../../node_modules/@mantine/core/esm/core/MantineProvider/create-theme/create-theme.js';

var theme = createTheme({
    colors: {
        primary: [
            'rgb(248 250 252)',
            'rgb(241 245 249)',
            'rgb(226 232 240)',
            'rgb(203 213 225)',
            'rgb(148 163 184)',
            'rgb(100 116 139)',
            'rgb(71 85 105)',
            'rgb(51 65 85)',
            'rgb(30 41 59)',
            'rgb(15 23 42)',
            'rgb(2 6 23)',
        ],
    },
    // Fonts
    fontFamily: 'Greycliff CF, sans-serif',
    fontFamilyMonospace: 'Monaco, Courier, monospace',
    headings: {
        fontFamily: 'Greycliff CF, sans-serif',
        fontWeight: '300',
    },
    primaryColor: 'primary',
    // Components Styling
    defaultRadius: 'md',
    components: {
        Container: {
            classNames: {
                root: 'font-light',
            },
        },
        Text: {
            classNames: {
                root: 'text-lg',
            },
        },
        Alert: {
            defaultProps: {
                variant: 'outline',
            },
        },
        Button: {
            classNames: {
                root: 'text-lg font-light',
            },
        },
        Fieldset: {
            classNames: {
                legend: 'text-xl font-light',
            },
        },
        // Do it for all input components
        InputWrapper: {
            classNames: {
                label: 'text-md font-light',
            },
        },
    },
});
var LayoutRoot = function (props) {
    return (React__default.createElement("html", { lang: "en" },
        React__default.createElement("head", null,
            React__default.createElement(ColorSchemeScript, null)),
        React__default.createElement("body", null,
            React__default.createElement(MantineProvider, { theme: theme },
                React__default.createElement(Notifications, { position: "bottom-right", autoClose: false, notificationMaxHeight: 10000, containerWidth: 1000 }),
                React__default.createElement(AuthProvider, null, props.children)))));
};

export { LayoutRoot };
