'use client'

import { Anchor, AppShell, Burger, Group, Image, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { AppContext, AppProvider } from '../../../common/AppContextV3'
import { App, AppReq } from '../../../common/app_v3'
import { LogoutButton } from '../../mantine/module_user/LogoutButton'
import React, { Suspense, useContext } from 'react'
import { Router } from '../../../common/types'
import { AppNavBar } from '../../mantine/AppNavBar'

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
                    <Suspense>{props.children}</Suspense>
                </div>
            </AppShell.Main>
        </AppShell>
    )
}
