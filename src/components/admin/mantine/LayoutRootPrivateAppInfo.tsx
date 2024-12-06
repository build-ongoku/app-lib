'use client'

import { Anchor, AppShell, Burger, Group, Image, NavLink, Title, Tooltip } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { AppContext, AppProvider } from '../../../common/AppContextV3'
import { App, AppReq, Service } from '../../../common/app_v3'
import { LogoutButton } from '../../mantine/module_user/LogoutButton'
import { addBaseURL } from '../../../providers/provider'
import React, { Suspense, useContext } from 'react'
import { FiExternalLink } from 'react-icons/fi'

export const LayoutRootPrivateAppInfo = (props: { appReq: AppReq; applyOverrides?: (appInfo: App) => Promise<App>; children: React.ReactNode }) => {
    return (
        <AppProvider appReq={props.appReq} applyOverrides={props.applyOverrides}>
            <AppLayout>{props.children}</AppLayout>
        </AppProvider>
    )
}

const AppLayout = (props: { children: React.ReactNode }) => {
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
                {/* Services (non-builtin) */}
                <NavLink key={'services'} label={'Application'}>
                    <NavLinksInnerForServices appInfo={appInfo} svcs={appInfo.services.filter((svc) => svc.source !== 'mod')} />
                </NavLink>

                {/* Services (built-in) */}
                <NavLink key={'services-builtin'} label={'Built In'}>
                    <NavLinksInnerForServices appInfo={appInfo} svcs={appInfo.services.filter((svc) => svc.source === 'mod')} />
                </NavLink>

                <NavLink
                    key={'api-docs'}
                    target="_blank"
                    href={addBaseURL('/v1/docs')}
                    label={
                        <>
                            {'API Documentation'} <FiExternalLink />
                        </>
                    }
                ></NavLink>
            </AppShell.Navbar>
            <AppShell.Main>
                <div className="p-10">
                    <Suspense>{props.children}</Suspense>
                </div>
            </AppShell.Main>
        </AppShell>
    )
}

const NavLinksInnerForServices = (props: { appInfo: App; svcs: Service[] }) => {
    const { appInfo, svcs } = props

    return (
        <>
            {svcs.map((svc) => {
                return <NavLinksForService key={svc.getName().toRaw()} appInfo={appInfo} svc={svc} />
            })}
        </>
    )
}
const NavLinksForService = (props: { appInfo: App; svc: Service }) => {
    const { appInfo, svc } = props

    const entities = appInfo.getServiceEntities(svc.namespace.toRaw())
    const methods = appInfo.getServiceMethods(svc.namespace.toRaw())
    // If service has no entities, don't show it in the navbar
    if (!entities || entities.length === 0) {
        return null
    }
    let svcLabel = svc.description ? (
        <Tooltip label={svc.description}>
            <span>{svc.getNameFriendly()}</span>
        </Tooltip>
    ) : (
        svc.getNameFriendly()
    )

    return (
        <NavLink key={svc.getName().toRaw()} href={`svc-${svc.getName().toRaw()}`} label={svcLabel}>
            {/* Service - Entities */}
            {(entities.length > 0 &&
                entities.map((ent) => {
                    return <NavLink key={ent.namespace.toString()} href={`${ent.namespace.toURLPath()}/list`} label={ent.getNameFriendly()} />
                })) || <NavLink key={svc.getName().toRaw() + '-entities-none'} label={'No entities'}></NavLink>}

            {/* Service - Methods */}
            <NavLink key={svc.getName().toRaw() + '-methods'} href={svc.getName().toRaw() + '-methods'} label={'Methods'}>
                {(methods.length > 0 &&
                    methods.map((mth) => {
                        return <NavLink key={mth.namespace.toString()} href={mth.namespace.toURLPath()} label={mth.namespace.toLabel()} />
                    })) || (
                    <NavLink key={svc.getName().toRaw() + '-methods-none'} label={'No methods'}>
                        {' '}
                    </NavLink>
                )}
            </NavLink>
        </NavLink>
    )
}
