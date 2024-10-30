import { Alert } from '@mantine/core'
import React from 'react'
import { ScreenLoader } from '@ongoku/app-lib/src/components/admin/mantine/Loader'

export const ServerResponseWrapper = (props: { error?: string; loading?: boolean; children: React.ReactNode }) => {
    if (props.loading) {
        return <ScreenLoader />
    }
    if (props.error) {
        return <Alert variant="error">{props.error}</Alert>
    }
    return <>{props.children}</>
}
