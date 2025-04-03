'use client'

import { Alert } from '@mantine/core'
import { WithRouter, WithSearchParamsProvider } from '../../../common/types'
import React from 'react'
import { FormPasswordReset } from './FormPasswordReset'
import { useMakeRequest } from '../../../providers/httpV2'
import { ScreenLoader } from '../../../components/admin/mantine/Loader'

export interface Props {}

export const PagePasswordReset = (props: Props & WithRouter & WithSearchParamsProvider) => {
    const { router, searchParams } = props

    const token = searchParams.get('token')
    const email = searchParams.get('email')

    const reqResp = useMakeRequest<{ message: string }>({
        method: 'GET',
        relativePath: '/v1/auth/validate_password_reset_token',
        data: { email, token },
        skipFetchAtInit: !token || !email,
    })

    if (!token || !email) {
        return <Alert variant="error">The link is either invalid or has expired.</Alert>
    }

    if (reqResp.loading || !reqResp.fetchDone) {
        return <ScreenLoader />
    }

    if (reqResp.error) {
        return <Alert variant="error">The link is either invalid or has expired.</Alert>
    }

    if (reqResp.resp?.error) {
        return <Alert variant="error">The link is either invalid or has expired.</Alert>
    }

    return (
        <div>
            <FormPasswordReset email={email} token={token} router={router} />
        </div>
    )
}
