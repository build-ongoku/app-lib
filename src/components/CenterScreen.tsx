'use client'

import { Container } from '@mantine/core'

export const CenterScreen = (props: { children: React.ReactNode }) => {
    return (
        <Container className="flex flex-col items-center justify-center h-screen">
            <div className="m-auto text-center">
                <center>{props.children}</center>
            </div>
        </Container>
    )
}
