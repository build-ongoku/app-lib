'use client'

import { useForm } from '@mantine/form'
import { ITypeMinimal, TypeInfo } from '../../common/app_v3'
import { AppContext } from '../../common/AppContextV3'
import { MetaFieldKeys } from '../../common/types'
import { Form } from './Form'
import { TypeAddForm } from './FormAdd'
import { useRouter } from 'next/navigation'
import React, { useContext } from 'react'

interface TypeAddFormProps<T extends ITypeMinimal = any> {
    typeInfo: TypeInfo<T>
    postEndpoint: string
    key?: string // parent key, e.g. 'name', 'address' etc. Set this if this is a nested form, so the child inputs have the correct full key e.g. 'address.street', 'address.city' etc.
    initialData?: Omit<T, MetaFieldKeys>
    submitText?: string
    redirectPath?: string
}

export const TypeAddFormWrapper = <T extends ITypeMinimal = any, RespT = any>(props: TypeAddFormProps<T>) => {
    type FormT = Omit<T, MetaFieldKeys>

    const { typeInfo } = props

    const { appInfo } = useContext(AppContext)
    if (!appInfo) {
        throw new Error('AppInfo not loaded')
    }

    const [response, setResponse] = React.useState<RespT | null>(null)

    const initialData = props.initialData || typeInfo.getEmptyObject(appInfo) || ({} as FormT)

    // Todo: remove dependency on next/navigation
    const router = useRouter()
    const form = useForm<FormT>({
        mode: 'uncontrolled',
        initialValues: initialData,
    })

    console.log('[TypeAddFormWrapper] Rendering...', 'typeInfo', typeInfo)

    return (
        <Form<FormT, T, RespT>
            form={form}
            submitButtonText={props.submitText}
            postEndpoint={props.postEndpoint}
            redirectPath={props.redirectPath}
            onSuccess={(data: RespT) => {
                console.log('[TypeAddFormWrapper] [onSuccess]', 'data', data)
                setResponse(data)
            }}
        >
            <TypeAddForm typeInfo={typeInfo} form={form} />
            {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
        </Form>
    )
}
