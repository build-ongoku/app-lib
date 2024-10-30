import { MethodForm } from './MethodForm'
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

export const PageMethod = <P extends PropsService | PropsEntity>(props: P) => {
    return <MethodForm {...props.params} />
}
