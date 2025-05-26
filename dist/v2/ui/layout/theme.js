import { createTheme } from "@mantine/core";
export var mantineTheme = createTheme({
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
                root: 'text-lg font-light',
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
        NavLink: {
            classNames: {
                root: 'text-xl font-light',
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
