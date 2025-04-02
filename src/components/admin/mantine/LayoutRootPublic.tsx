'use client'

import { Container, Image, Title } from '@mantine/core'
import { useAuth } from '../../../common/AuthContext'
import React, { useEffect } from 'react'
import { Router } from '../../../common/types'

export const LayoutRootPublic = (props: { router: Router; children: React.ReactNode }) => {
    const { router, children } = props

    const { session, loading: loadingSession } = useAuth()

    // Do not allow authenticated users to access this part of the app.
    useEffect(() => {
        if (!loadingSession && session) {
            console.log('[LayoutRootPublic] [useEffect] User is authenticated. Redirecting to dashboard...', 'session', session)
            router.push('/home')
        }
    }, [session])

    return (
        <Container className="flex h-screen justify-center">
            <div className="m-auto">
                <Image src="/logo_1.png" alt="onhoku Logo" className="m-auto" w="auto" fit="contain" height={100} />
                <Title order={1}>
                    <span className="font-normal">on</span>goku
                </Title>
            </div>
            <div className="m-auto">{children}</div>
        </Container>
    )
}
