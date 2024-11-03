'use client'

import { Alert } from '@mantine/core'
import React from 'react'
import { ScreenLoader } from '../../components/admin/mantine/Loader'

export const ServerResponseWrapper = (props: { error?: string; loading?: boolean; children: React.ReactNode }) => {
    if (props.loading) {
        return <ScreenLoader />
    }
    if (props.error) {
        return <Alert variant="error">{props.error}</Alert>
    }
    return <>{props.children}</>
}
