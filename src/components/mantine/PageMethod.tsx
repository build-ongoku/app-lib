'use client'

import { MethodForm } from './MethodForm'
import { WithRouter } from '../../common/types'
import React from 'react'

export interface PropsService {
    params: {
        service: string
        method: string
    }
}

export interface PropsEntity {
    params: {
        service: string
        entity: string
        method: string
    }
}

export const PageMethod = <P extends (PropsService | PropsEntity) & WithRouter>(props: P) => {
    const { router } = props
    return <MethodForm {...props.params} router={router} />
}
