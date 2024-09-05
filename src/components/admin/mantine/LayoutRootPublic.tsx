'use client'

import { Container, Image, Title } from '@mantine/core'
import { useAuth } from '@ongoku/app-lib/src/common/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export const LayoutRootPublic = ({ children }: { children: React.ReactNode }) => {
    const { session, loading: loadingSession } = useAuth()
    const router = useRouter()

    // Do not allow authenticated users to access this part of the app.
    useEffect(() => {
        if (!loadingSession && session) {
            console.log('User is authenticated. Redirecting to dashboard...')
            router.push('/home')
        }
    }, [session])

    return (
        <Container className="flex h-screen justify-center">
            <div className="m-auto">
                <Image src="/logo_1.png" alt="OnGoku Logo" className="m-auto" w="auto" fit="contain" height={100} />
                <Title order={1}>
                    <span className="font-normal">On</span>Goku
                </Title>
            </div>
            <div className="m-auto">{children}</div>
        </Container>
    )
}
