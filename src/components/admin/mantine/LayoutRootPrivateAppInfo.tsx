'use client'

import { Anchor, AppShell, Burger, Group, Image, Title, Alert } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { AppContext, AppProvider } from '../../../common/AppContextV3'
import { App, AppReq } from '../../../common/app_v3'
import { LogoutButton } from '../../mantine/module_user/LogoutButton'
import React, { Suspense, useContext, useEffect, useState } from 'react'
import { Router } from '../../../common/types'
import { AppNavBar } from '../../mantine/AppNavBar'
import { IconInfoCircle, IconAlertCircle, IconExclamationCircle } from '@tabler/icons-react'

export const LayoutRootPrivateAppInfo = (props: { appReq: AppReq; applyOverrides?: (appInfo: App) => Promise<App>; children: React.ReactNode; router: Router }) => {
    return (
        <AppProvider appReq={props.appReq} applyOverrides={props.applyOverrides}>
            <AppLayout router={props.router}>{props.children}</AppLayout>
        </AppProvider>
    )
}

const AppLayout = (props: { children: React.ReactNode; router: Router }) => {
    const { router } = props

    const [opened, { toggle }] = useDisclosure()

    const { appInfo } = useContext(AppContext)
    if (!appInfo) {
        throw new Error('Unexpected: AppInfo not found')
    }

    console.log('[AppLayout] AppInfo fetched', 'appInfo', appInfo)

    return (
        <AppShell
            header={{ height: { base: 60, md: 70, lg: 80 } }}
            navbar={{
                width: { base: 200, md: 200, lg: 250 },
                breakpoint: 'sm',
                collapsed: { mobile: !opened },
            }}
            padding="md"
        >
            <AppShell.Header>
                {/* Group is a flex container by default */}
                <Group h="100%" px="md">
                    <Burger className="" opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                    <div className="">
                        <Anchor href="/home" underline="never" className="">
                            <Image className="" src="/logo_1.png" alt="OnGoku Logo" w="auto" fit="contain" height={50} />
                        </Anchor>
                    </div>
                    <div className="">
                        <Anchor href="/home" underline="never" className="">
                            <Title className="" order={2}>
                                {' '}
                                <span className="font-normal">on</span>
                                goku{' '}
                            </Title>
                        </Anchor>
                    </div>

                    <div className="flex-grow" />
                    <LogoutButton router={router} />
                </Group>
            </AppShell.Header>
            <AppShell.Navbar>
                <AppNavBar />
            </AppShell.Navbar>
            <AppShell.Main>
                <div className="p-10">
                    {/* Alert section that reads URL parameters */}
                    <AlertSection router={router} />
                    <Suspense>{props.children}</Suspense>
                </div>
            </AppShell.Main>
        </AppShell>
    )
}

// Alert component that reads URL parameters and displays alert messages
const AlertSection = ({ router }: { router: Router }) => {
    const [alerts, setAlerts] = useState<Array<{ type: 'info' | 'warning' | 'error'; message: string }>>([])

    useEffect(() => {
        try {
            // Parse URL parameters to get alerts information
            const urlParams = new URLSearchParams(window.location.search)
            const alertsParam = urlParams.get('alerts')

            // Clear any existing alerts
            setAlerts([])

            // If alerts parameter exists, parse it and set the alerts
            if (alertsParam) {
                // Parse the JSON array from the URL parameter
                let parsedAlerts: Array<{ type: string; message: string }> = []
                try {
                    parsedAlerts = JSON.parse(decodeURIComponent(alertsParam))

                    // Validate the structure of the parsed alerts
                    if (!Array.isArray(parsedAlerts)) {
                        console.error('Invalid alerts format: not an array')
                        return
                    }
                } catch (e) {
                    console.error('Failed to parse alerts JSON', e)
                    return
                }

                // Process each alert in the array
                const validAlerts = parsedAlerts
                    .filter((alert) => alert && typeof alert === 'object' && 'type' in alert && 'message' in alert && typeof alert.message === 'string')
                    .map((alert) => {
                        // Validate alert type
                        const validType = ['info', 'warning', 'error'].includes(alert.type) ? (alert.type as 'info' | 'warning' | 'error') : 'info'

                        return {
                            type: validType,
                            message: alert.message,
                        }
                    })

                setAlerts(validAlerts)

                // Clear the URL parameter after reading it
                if (router.push) {
                    const url = new URL(window.location.href)
                    url.searchParams.delete('alerts')
                    router.push(url.pathname + url.search)
                }
            }
        } catch (error) {
            console.error('Error processing alerts from URL', error)
        }
    }, [router])

    // If no alerts, return null
    if (alerts.length === 0) {
        return null
    }

    // Select icon based on alert type
    const iconMap = {
        info: <IconInfoCircle size="1.1rem" />,
        warning: <IconExclamationCircle size="1.1rem" />,
        error: <IconAlertCircle size="1.1rem" />,
    }

    // Select color based on alert type
    const colorMap = {
        info: 'blue',
        warning: 'yellow',
        error: 'red',
    }

    // Function to remove a specific alert by index
    const removeAlert = (index: number) => {
        setAlerts((currentAlerts) => currentAlerts.filter((_, i) => i !== index))
    }

    return (
        <div className="space-y-2 mb-4">
            {alerts.map((alert, index) => (
                <Alert
                    key={index}
                    icon={iconMap[alert.type]}
                    title={alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                    color={colorMap[alert.type]}
                    withCloseButton
                    onClose={() => removeAlert(index)}
                >
                    {alert.message}
                </Alert>
            ))}
        </div>
    )
}
