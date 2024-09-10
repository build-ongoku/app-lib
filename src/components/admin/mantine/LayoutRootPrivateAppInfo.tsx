'use client'

import { AppInfoContext, AppInfoProvider } from '@ongoku/app-lib/src/common/AppContext'
import { NewAppInfoReq } from '@ongoku/app-lib/src/common/App'
import { useContext } from 'react'
import { Loader } from '@mantine/core'
import { Anchor, AppShell, Burger, Group, Stack, Image, Title, Button } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useAuth } from '@ongoku/app-lib/src/common/AuthContext'
import { useRouter } from 'next/navigation'
import { Suspense } from 'react'
import { LogoutButton } from '@ongoku/app-lib/src/components/mantine/module_user/LogoutButton'

export const LayoutRootPrivateAppInfo = (props: { appInfoReq: NewAppInfoReq; children: React.ReactNode }) => {
    return (
        <AppInfoProvider newAppInfoReq={props.appInfoReq}>
            <LoadingAppContext>{props.children}</LoadingAppContext>
        </AppInfoProvider>
    )
}

// LoadingAppContext allows to show a loader while appInfo context is being setup
const LoadingAppContext = (props: { children: React.ReactNode }) => {
    const { loading } = useContext(AppInfoContext)

    if (loading) {
        return <Loader size="xl" type="bars" />
    }

    return <AppLayout>{props.children}</AppLayout>
}

const AppLayout = (props: { children: React.ReactNode }) => {
    const router = useRouter()
    const [opened, { toggle }] = useDisclosure()
    const { endSession } = useAuth()

    const { appInfo } = useContext(AppInfoContext)
    if (!appInfo) {
        throw new Error('Unexpected: AppInfo not found')
    }

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
                <Stack className="pt-10" align="flex-start" justify="flex-start" gap="xl">
                    {appInfo.listEntityInfos().map((entityInfo) => {
                        return (
                            <Button
                                key={entityInfo.name}
                                className="mx-5 text-2xl"
                                variant="light"
                                onClick={() => {
                                    router.push(`/${entityInfo.serviceName}/${entityInfo.name}/list`)
                                }}
                            >
                                {entityInfo.getNameFormatted()}
                            </Button>
                        )
                    })}
                </Stack>
            </AppShell.Navbar>
            <AppShell.Main>
                <div className="p-10">
                    <Suspense>{props.children}</Suspense>
                </div>
            </AppShell.Main>
        </AppShell>
    )
}
