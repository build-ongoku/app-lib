'use client'

import { useForm } from '@mantine/form'
import { EntityInfo, IEntityMinimal } from '../../common/app_v3'
import { AppContext } from '../../common/AppContextV3'
import { MetaFieldKeys } from '../../common/types'
import { Form } from './Form'
import { TypeAddForm } from './FormAdd'
import { AddEntityRequest, joinURL } from '../../providers/provider'
import { useRouter } from 'next/navigation'
import React, { useContext } from 'react'

interface EntityAddFormProps<E extends IEntityMinimal = any> {
    entityInfo: EntityInfo<E>
    key?: string // parent key, e.g. 'name', 'address' etc. Set this if this is a nested form, so the child inputs have the correct full key e.g. 'address.street', 'address.city' etc.
    initialData?: Omit<E, MetaFieldKeys>
}

export const EntityAddForm = <E extends IEntityMinimal = any>(props: EntityAddFormProps<E>) => {
    type FormT = Omit<E, MetaFieldKeys>

    const { entityInfo } = props

    const initialData = props.initialData || ({} as FormT)

    // Todo: remove dependency on next/navigation
    const router = useRouter()
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

    return (
        <Form<FormT, AddEntityRequest<E>, E>
            form={form}
            submitButtonText={`Add ${entityInfo.getNameFriendly()}`}
            onSubmitTransformValues={(values: FormT): AddEntityRequest<E> => {
                return {
                    object: values,
                }
            }}
            postEndpoint={joinURL('v1', entityInfo.namespace.toURLPath())}
            onSuccess={(data: E) => {
                console.log('[EntityAddForm] [onSuccess]', 'data', data)
                if (data.id) {
                    const redirectURL = joinURL(entityInfo.namespace.toURLPath(), data.id)
                    console.log('[EntityAddForm] [onSuccess] Redirecting to', redirectURL)
                    router.push(redirectURL)
                    return
                }
            }}
        >
            <TypeAddForm typeInfo={typeInfo} form={form} />
        </Form>
    )
}
