'use client'

import { useContext } from 'react'
import { Loader, NavLink } from '@mantine/core'
import { Anchor, AppShell, Burger, Group, Stack, Image, Title, Button } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useAuth } from '@ongoku/app-lib/src/common/AuthContext'
import { useRouter } from 'next/navigation'
import { Suspense } from 'react'
import { LogoutButton } from '@ongoku/app-lib/src/components/mantine/module_user/LogoutButton'
import { AppContext, AppProvider } from '@ongoku/app-lib/src/common/AppContextV3'
import { App, AppReq } from '@ongoku/app-lib/src/common/app_v3'

export const LayoutRootPrivateAppInfo = (props: { appReq: AppReq; applyOverrides?: (appInfo: App) => Promise<App>; children: React.ReactNode }) => {
    return (
        <AppProvider appReq={props.appReq} applyOverrides={props.applyOverrides}>
            <AppLayout>{props.children}</AppLayout>
        </AppProvider>
    )
}

// // LoadingAppContext allows to show a loader while appInfo context is being setup
// const LoadingAppContext = (props: { children: React.ReactNode }) => {
//     const { appInfo } = useContext(AppContext)

//     if (!appInfo) {
//         return <Loader size="xl" type="bars" />
//     }

//     console.log('[LoadingAppContext] AppInfo loaded', appInfo)

//     return <AppLayout>{props.children}</AppLayout>
// }

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
            </AppShell.Navbar>
            <AppShell.Main>
                <div className="p-10">
                    <Suspense>{props.children}</Suspense>
                </div>
            </AppShell.Main>
        </AppShell>
    )
}
