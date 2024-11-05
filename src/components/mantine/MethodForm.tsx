'use client'

import { Title, Text } from '@mantine/core'
import { ITypeMinimal } from '../../common/app_v3'
import { AppContext } from '../../common/AppContextV3'
import { DtypeFormWrapper } from './FormAddTypeWrapper'
import React, { useContext } from 'react'

export const MethodForm = <ReqT extends ITypeMinimal = any, RespT extends ITypeMinimal = any>(props: { service: string; entity?: string; method: string }) => {
    const { service, entity, method } = props

    const { appInfo } = useContext(AppContext)
    if (!appInfo) {
        throw new Error('AppInfo not loaded')
    }

    const mthd = appInfo.getMethod({ service: service, entity: entity, method: method })
    if (!mthd.namespace.method) {
        throw new Error('Method namespace does not have method')
    }
    if (!mthd.requestDtype) {
        throw new Error('Method does not have request type')
    }

    const api = mthd.getAPI()
    if (!api) {
        return <Text> Method {mthd.namespace.method.toCapital()} does not have an API defined. Hence, it cannot be called from a client app.</Text>
    }

    const endpoint = api.getEndpoint()

    return (
        <div>
            <Title order={1}>Method: {mthd.namespace.method.toCapital()}</Title>
            <DtypeFormWrapper<ReqT, RespT> dtype={mthd.requestDtype} postEndpoint={endpoint} method={api.method} />
        </div>
    )
}
