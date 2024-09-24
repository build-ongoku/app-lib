import { Form } from '@ongoku/app-lib/src/components/mantine/Form'
import { TypeAddForm } from '@ongoku/app-lib/src/components/mantine/FormAdd'
import { AddEntityRequest, joinURL } from '@ongoku/app-lib/src/providers/provider'
import { useForm } from '@mantine/form'
import { useRouter } from 'next/navigation'
import React, { useContext } from 'react'
import { EntityInfo, IEntityMinimal } from '@ongoku/app-lib/src/common/app_v3'
import { AppContext } from '@ongoku/app-lib/src/common/AppContextV3'
import { MetaFieldKeys } from '@/common/types'

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
    const typeInfo = appInfo.getTypeInfo<E>(typeNs)
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
                    router.push(joinURL(entityInfo.namespace.toURLPath(), data.id))
                    return
                }
            }}
        >
            <TypeAddForm typeInfo={typeInfo} form={form} />
        </Form>
    )
}
