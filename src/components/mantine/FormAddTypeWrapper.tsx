import { ITypeMinimal, TypeInfo } from '@ongoku/app-lib/src/common/app_v3'
import { AppContext } from '@ongoku/app-lib/src/common/AppContextV3'
import { MetaFieldKeys } from '@ongoku/app-lib/src/common/types'
import { useForm } from '@mantine/form'
import { useRouter } from 'next/navigation'
import React, { useContext } from 'react'
import { TypeAddForm } from '@ongoku/app-lib/src/components/mantine/FormAdd'
import { Form } from '@ongoku/app-lib/src/components/mantine/Form'

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

    const { typeInfo, redirectPath } = props

    const [response, setResponse] = React.useState<RespT | null>(null)

    const initialData = props.initialData || typeInfo.getEmptyObject() || ({} as FormT)

    // Todo: remove dependency on next/navigation
    const router = useRouter()
    const form = useForm<FormT>({
        mode: 'uncontrolled',
        initialValues: initialData,
    })

    const { appInfo } = useContext(AppContext)
    if (!appInfo) {
        throw new Error('AppInfo not loaded')
    }
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
