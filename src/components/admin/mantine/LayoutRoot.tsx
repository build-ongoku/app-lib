import { ColorSchemeScript, createTheme, MantineProvider } from '@mantine/core'
import { AuthProvider } from '@ongoku/app-lib/src/common/AuthContext'

const theme = createTheme({
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
        TextInput: {
            classNames: {
                label: 'text-md font-light',
            },
        },
        PasswordInput: {
            classNames: {
                label: 'text-md font-light',
            },
        },
        JsonInput: {
            classNames: {
                label: 'text-md font-light',
            },
        },
        Input: {
            classNames: {
                input: 'text-md font-light',
            },
        },
    },
})

export const LayoutRoot = (props: { children: React.ReactNode }) => {
    return (
        <html lang="en">
            <head>
                <ColorSchemeScript />
            </head>
            <body>
                <MantineProvider theme={theme}>
                    <AuthProvider>{props.children}</AuthProvider>
                </MantineProvider>
            </body>
        </html>
    )
}
