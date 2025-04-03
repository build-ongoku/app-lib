'use client'

import { Alert, Title } from '@mantine/core'
import { WithRouter, WithSearchParamsProvider } from '../../../common/types'
import React, { useEffect } from 'react'
import { FormPasswordReset } from './FormPasswordReset'
import { makeRequest } from '../../../providers/httpV2'

export interface Props {}

export const PagePasswordReset = (props: Props & WithRouter & WithSearchParamsProvider) => {
    const { router, searchParams } = props

    const token = searchParams.get('token')
    const email = searchParams.get('email')

    const [tokenValid, setTokenValid] = React.useState<boolean | undefined>(undefined)

    useEffect(() => {
        if (!token || !email) {
            setTokenValid(false)
            return
        }
        // TODO: Make an API call to validate the token (and email)
        makeRequest({
            method: 'GET',
            relativePath: '/api/v1/auth/validate_password_reset_token',
            data: {email, token}
        }).then(() => {
            setTokenValid(true)
        }).catch(() => {
            setTokenValid(false)
        })
    }, [token, email])

    if (!email || !token || !tokenValid) {
        return <Alert variant="error">The link is either invalid or has expired.</Alert>
    }

    return (
        <div>
            <Title order={1}>Reset Password</Title>
            <FormPasswordReset email={email} token={token} router={router} />
        </div>
    )
}
