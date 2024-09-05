'use client'

import { useAuth } from '@ongoku/app-lib/src/common/AuthContext'
import { Container, Image, Title, Button } from '@mantine/core'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export interface EnterScreenProps {
    appName: string
    authenticatedUserRedirectPath: string
    unauthenticatedUserRedirectPath: string
}

export const EnterScreen = (props: EnterScreenProps) => {
    return (
        <Container className="flex flex-col items-center justify-center h-screen">
            <div className="m-auto text-center">
                <center>
                    <Image src="/logo_1.png" alt="OnGoku Logo" className="m-auto" w="auto" fit="contain" height={100} />
                    <Title order={1} className="text-center">
                        Welcome to {props.appName} <span className="font-normal">on</span>goku
                    </Title>
                    <p className="text-center">
                        <EnterButton {...props} />
                    </p>
                </center>
            </div>
        </Container>
    )
}

const EnterButton = (props: EnterScreenProps) => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const { session } = useAuth()

    const redirectPath = !session ? props.authenticatedUserRedirectPath : props.unauthenticatedUserRedirectPath

    return (
        <>
            <Button
                loading={loading}
                onClick={() => {
                    setLoading(true)
                    router.push(redirectPath)
                }}
                className="m-auto"
            >
                Enter
            </Button>
        </>
    )
}
