'use client'

import { useForm } from '@mantine/form'
import { EntityInfo, IEntityMinimal } from '../../common/app_v3'
import { AppContext } from '../../common/AppContextV3'
import { MetaFieldKeys } from '../../common/types'
import { Form } from './Form'
import { TypeAddForm } from './FormAdd'
import { joinURL } from '../../providers/provider'
import React, { useContext } from 'react'
import { AddEntityRequestData, getAddEntityMethodAndPath } from '../../providers/httpV2'
import { Router } from '../../common/types'

interface EntityAddFormProps<E extends IEntityMinimal = any> {
    entityInfo: EntityInfo<E>
    key?: string // parent key, e.g. 'name', 'address' etc. Set this if this is a nested form, so the child inputs have the correct full key e.g. 'address.street', 'address.city' etc.
    initialData?: Omit<E, MetaFieldKeys>
    router: Router
}

export const EntityAddForm = <E extends IEntityMinimal = any>(props: EntityAddFormProps<E>) => {
    type FormT = Omit<E, MetaFieldKeys>

    const { entityInfo, router } = props

    const initialData = props.initialData || ({} as FormT)

    const form = useForm<FormT>({
        mode: 'uncontrolled',
        validate: {},
        initialValues: initialData,
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

    const { relPath } = getAddEntityMethodAndPath(entityInfo.namespace.toRaw())

    return (
        <Form<FormT, E, AddEntityRequestData<E>>
            form={form}
            submitButtonText={`Add ${entityInfo.getNameFriendly()}`}
            onSubmitTransformValues={(values: FormT): AddEntityRequestData<E> => {
                return {
                    object: values,
                }
            }}
            postEndpoint={relPath}
            onSuccess={(data: E) => {
                console.log('[EntityAddForm] [onSuccess]', 'data', data)
                if (data.id) {
                    const redirectURL = joinURL(entityInfo.namespace.toURLPath(), data.id)
                    console.log('[EntityAddForm] [onSuccess] Redirecting to', redirectURL)
                    const dataParam = encodeURIComponent(JSON.stringify(data))
                    router.push(`${redirectURL}?entityData=${dataParam}`)
                    return
                }
            }}
            router={router}
        >
            <TypeAddForm typeInfo={typeInfo} form={form} />
        </Form>
    )
}
