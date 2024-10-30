'use client'

import { Anchor, AppShell, Burger, Group, Image, NavLink, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { AppContext, AppProvider } from '@ongoku/app-lib/src/common/AppContextV3'
import { App, AppReq } from '@ongoku/app-lib/src/common/app_v3'
import { LogoutButton } from '@ongoku/app-lib/src/components/mantine/module_user/LogoutButton'
import { joinURL } from '@ongoku/app-lib/src/providers/provider'
import { useRouter } from 'next/navigation'
import React, { Suspense, useContext } from 'react'

export const LayoutRootPrivateAppInfo = (props: { appReq: AppReq; applyOverrides?: (appInfo: App) => Promise<App>; children: React.ReactNode }) => {
    return (
        <AppProvider appReq={props.appReq} applyOverrides={props.applyOverrides}>
            <AppLayout>{props.children}</AppLayout>
        </AppProvider>
    )
}

const AppLayout = (props: { children: React.ReactNode }) => {
    const router = useRouter()
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
                    <LogoutButton />
                </Group>
            </AppShell.Header>
            <AppShell.Navbar>
                <>
                    {appInfo.services.map((svc) => {
                        const entities = appInfo.getServiceEntities(svc.namespace.toRaw())
                        // If service has no entities, don't show it in the navbar
                        if (!entities || entities.length === 0) {
                            return null
                        }
                        return (
                            <NavLink key={svc.getName().toRaw()} href={`svc-${svc.getName().toRaw()}`} label={svc.getNameFriendly()}>
                                {entities.map((ent) => {
                                    return <NavLink key={ent.namespace.toString()} href={`${ent.namespace.toURLPath()}/list`} label={ent.getNameFriendly()} />
                                })}
                            </NavLink>
                        )
                    })}
                </>
                <NavLink key={'methods'} href={`methods`} label={'Methods'}>
                    {appInfo.methods.map((mth) => {
                        if (!mth.namespace.entity) {
                            // Do not show entity methods for now
                            return (
                                <NavLink key={mth.namespace.toString()} href={joinURL(mth.namespace.service!.toSnake(), 'method', mth.namespace.method!.toSnake())} label={mth.namespace.toLabel()} />
                            )
                        }
                    })}
                </NavLink>
            </AppShell.Navbar>
            <AppShell.Main>
                <div className="p-10">
                    <Suspense>{props.children}</Suspense>
                </div>
            </AppShell.Main>
        </AppShell>
    )
}
