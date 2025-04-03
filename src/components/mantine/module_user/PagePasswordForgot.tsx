'use client'

import { Title } from '@mantine/core'
import { WithRouter } from '../../../common/types'
import React from 'react'
import { FormPasswordForgot } from './FormPasswordForgot'

export interface Props {}

export const PagePasswordForgot = (props: Props & WithRouter) => {
    const { router } = props

    return (
        <div>
            <FormPasswordForgot router={router} />
        </div>
    )
}
