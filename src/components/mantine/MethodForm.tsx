'use client'

import { Title } from '@mantine/core'
import { ITypeMinimal } from '@ongoku/app-lib/src/common/app_v3'
import { AppContext } from '@ongoku/app-lib/src/common/AppContextV3'
import { TypeAddFormWrapper } from '@ongoku/app-lib/src/components/mantine/FormAddTypeWrapper'
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
    if (!mthd.requestTypeNamespace) {
        throw new Error('Method does not have request type')
    }
    const reqTypeInfo = appInfo.getTypeInfo<ReqT>(mthd.requestTypeNamespace.toRaw())
    if (!reqTypeInfo) {
        throw new Error('Request type not found')
    }

    const postEndpoint = mthd.getAPIEndpoint()

    return (
        <div>
            <Title order={1}>Method: {mthd.namespace.method.toCapital()}</Title>
            <TypeAddFormWrapper<ReqT> typeInfo={reqTypeInfo} postEndpoint={postEndpoint} />
        </div>
    )
}
