'use client'

import { useForm } from '@mantine/form'
import { Dtype, ITypeMinimal, TypeInfo } from '../../common/app_v3'
import { AppContext } from '../../common/AppContextV3'
import { MetaFieldKeys } from '../../common/types'
import { discardableInputKey, Form } from './Form'
import { GenericDtypeInput, TypeAddForm } from './FormAdd'
import { Router } from '../../common/types'
import React, { useContext } from 'react'

export const DtypeFormWrapper = <T = any, RespT = any>(props: {
    dtype: Dtype<T>
    postEndpoint: string
    method: 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE'
    key?: string // parent key, e.g. 'name', 'address' etc. Set this if this is a nested form, so the child inputs have the correct full key e.g. 'address.street', 'address.city' etc.
    initialData?: Omit<T, MetaFieldKeys>
    submitText?: string
    redirectPath?: string
    label?: string
    router: Router
}) => {
    const { router } = props

    type FormT = { [discardableInputKey]: Omit<T, MetaFieldKeys> }

    const { dtype } = props

    const { appInfo } = useContext(AppContext)
    if (!appInfo) {
        throw new Error('AppInfo not loaded')
    }

    const [response, setResponse] = React.useState<RespT | null>(null)

    const form = useForm<FormT>({
        mode: 'uncontrolled',
        initialValues: {
            [discardableInputKey]: props.initialData || (dtype.getEmptyValue(appInfo) as Omit<T, MetaFieldKeys>) || undefined,
        },
    })

    console.log('[DtypeFormWrapper] Rendering...', 'dtype', dtype)

    return (
        <Form<FormT, RespT, T>
            form={form}
            postEndpoint={props.postEndpoint}
            method={props.method}
            submitButtonText={props.submitText}
            redirectPath={props.redirectPath}
            onSuccess={(data: RespT) => {
                console.log('[TypeAddFormWrapper] [onSuccess]', 'data', data)
                setResponse(data)
            }}
            router={router}
        >
            <GenericDtypeInput dtype={dtype} label={props.label ?? 'Request'} form={form} identifier={discardableInputKey} />
            {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
        </Form>
    )
}

interface TypeAddFormProps<T extends ITypeMinimal = any> {
    typeInfo: TypeInfo<T>
    postEndpoint: string
    key?: string // parent key, e.g. 'name', 'address' etc. Set this if this is a nested form, so the child inputs have the correct full key e.g. 'address.street', 'address.city' etc.
    initialData?: Omit<T, MetaFieldKeys>
    submitText?: string
    redirectPath?: string
    router: Router
}

export const TypeAddFormWrapper = <T extends ITypeMinimal = any, RespT = any>(props: TypeAddFormProps<T>) => {
    type FormT = Omit<T, MetaFieldKeys>

    const { typeInfo, router } = props

    const { appInfo } = useContext(AppContext)
    if (!appInfo) {
        throw new Error('AppInfo not loaded')
    }

    const [response, setResponse] = React.useState<RespT | null>(null)

    const initialData = props.initialData || typeInfo.getEmptyObject(appInfo) || ({} as FormT)

    const form = useForm<FormT>({
        mode: 'uncontrolled',
        initialValues: initialData,
    })

    console.log('[TypeAddFormWrapper] Rendering...', 'typeInfo', typeInfo)

    return (
        <Form<FormT, RespT, T>
            form={form}
            submitButtonText={props.submitText}
            postEndpoint={props.postEndpoint}
            redirectPath={props.redirectPath}
            onSuccess={(data: RespT) => {
                console.log('[TypeAddFormWrapper] [onSuccess]', 'data', data)
                setResponse(data)
            }}
            router={router}
        >
            <TypeAddForm typeInfo={typeInfo} form={form} />
            {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
        </Form>
    )
}
