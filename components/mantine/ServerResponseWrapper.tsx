import React, { Suspense } from 'react'
import { Alert, Loader } from '@mantine/core'

export const ServerResponseWrapper = (props: { error?: string; loading?: boolean; children: React.ReactNode }) => {
    if (props.loading) {
        return <Loader type="bars" size="lg" />
    }
    if (props.error) {
        return <Alert variant="error">{props.error}</Alert>
    }
    return <Suspense fallback={<Loader type="bars" size="lg" />}>{props.children}</Suspense>
}
