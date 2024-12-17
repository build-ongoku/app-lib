'use client'

import { useForm } from '@mantine/form'
import { EntityInfo, IEntityMinimal } from '../../common/app_v3'
import { AppContext } from '../../common/AppContextV3'
import { MetaFieldKeys } from '../../common/types'
import { Form } from './Form'
import { TypeAddForm } from './FormAdd'
import { joinURL } from '../../providers/provider'
import { useRouter } from 'next/navigation'
import React, { useContext } from 'react'
import { AddEntityRequestData, getUpdateEntityMethodAndPath, UpdateEntityRequestData, UpdateEntityResponseData, useGetEntity } from '../../providers/httpV2'
import { ServerResponseWrapper } from './ServerResponseWrapper'
import { Title } from '@mantine/core'

interface EntityEditFormProps<E extends IEntityMinimal = any> {
    entityInfo: EntityInfo<E>
    objectId: string // ID of the entity to edit
    key?: string // parent key, e.g. 'name', 'address' etc. Set this if this is a nested form, so the child inputs have the correct full key e.g. 'address.street', 'address.city' etc.
}

export const EntityEditForm = <E extends IEntityMinimal = any>(props: EntityEditFormProps<E>) => {
    type FormT = Omit<E, MetaFieldKeys>

    const { entityInfo } = props

    // Get the entity data from the server
    const { resp, error, loading } = useGetEntity<E>({
        data: {
            id: props.objectId,
        },
        entityNamespace: entityInfo.namespace.toRaw(),
    })

    return (
        <ServerResponseWrapper loading={loading} error={error || resp?.error}>
            {resp?.data && <EntityEditFormInner key={props.key} entityInfo={entityInfo} object={resp?.data} />}
        </ServerResponseWrapper>
    )
}

const EntityEditFormInner = <E extends IEntityMinimal = any>(props: {
    entityInfo: EntityInfo<E>
    object: E
    key?: string // parent key, e.g. 'name', 'address' etc. Set this if this is a nested form, so the child inputs have the correct full key e.g. 'address.street', 'address.city' etc.
}) => {
    type FormT = E

    const { entityInfo, object } = props

    // Todo: remove dependency on next/navigation
    const router = useRouter()
    const form = useForm<FormT>({
        mode: 'uncontrolled',
        validate: {},
        initialValues: object,
    })

    const { appInfo } = useContext(AppContext)
    if (!appInfo) {
        throw new Error('AppInfo not loaded')
    }
    const typeNs = entityInfo.getTypeNamespace()

    const typeInfo = appInfo.getTypeInfo<E>(typeNs.toRaw())
    if (!typeInfo) {
        throw new Error('TypeInfo not found for ' + typeNs)
    }

    console.log('[EntityAddForm] Rendering...', 'entityInfo', entityInfo)

    const { relPath, method } = getUpdateEntityMethodAndPath(entityInfo.namespace.toRaw())

    return (
        <>
            <Title order={3}>
                {entityInfo.getEntityNameFriendly(object)} [{object.id}]
            </Title>
            <Form<FormT, UpdateEntityRequestData<E>, UpdateEntityResponseData<E>>
                form={form}
                submitButtonText={`Save`}
                onSubmitTransformValues={(values: FormT): UpdateEntityRequestData<E> => {
                    return {
                        object: values,
                    }
                }}
                postEndpoint={relPath}
                method={method}
                onSuccess={(data: UpdateEntityResponseData<E>) => {
                    console.log('[EntityAddForm] [onSuccess]', 'data', data)
                    if (data.object.id) {
                        const redirectURL = joinURL(entityInfo.namespace.toURLPath(), data.object.id)
                        console.log('[EntityEditForm] [onSuccess] Redirecting to', redirectURL)
                        router.push(redirectURL)
                        return
                    }
                }}
            >
                <TypeAddForm typeInfo={typeInfo} form={form} initialData={object} />
            </Form>
        </>
    )
}
