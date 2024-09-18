import { EntityInfo, EntityMinimal } from '@ongoku/app-lib/src/common/Entity'
import { Form } from '@ongoku/app-lib/src/components/mantine/Form'
import { TypeAddForm } from '@ongoku/app-lib/src/components/mantine/FormAdd'
import { AddEntityRequest, getEntityPath } from '@ongoku/app-lib/src/providers/provider'
import { useForm } from '@mantine/form'
import { useRouter } from 'next/navigation'
import React from 'react'

interface EntityAddFormProps<E extends EntityMinimal = any> {
    entityInfo: EntityInfo<E>
    key?: string // parent key, e.g. 'name', 'address' etc. Set this if this is a nested form, so the child inputs have the correct full key e.g. 'address.street', 'address.city' etc.
    initialData?: E
}

export const EntityAddForm = <E extends EntityMinimal = any>(props: EntityAddFormProps<E>) => {
    const { entityInfo } = props

    const initialData = props.initialData || ({} as E)

    // Todo: remove dependency on next/navigation
    const router = useRouter()
    const form = useForm<E>({
        mode: 'uncontrolled',
        validate: {},
        initialValues: initialData,
    })

    console.log('EntityAddForm', entityInfo)

    return (
        <Form<E, AddEntityRequest<E>, E>
            form={form}
            submitButtonText={`Add ${entityInfo.getNameFormatted()}`}
            onSubmitTransformValues={(values: E): AddEntityRequest<E> => {
                return {
                    object: values,
                }
            }}
            postEndpoint={getEntityPath({ serviceName: entityInfo.serviceName, entityName: entityInfo.name })}
            onSuccess={(data: E) => {
                console.log('EntityAddForm: onSuccess', data)
                if (data.id) {
                    router.push(`/${entityInfo.serviceName}/${entityInfo.name}/${data.id}`)
                    return
                }
            }}
        >
            <TypeAddForm typeInfo={entityInfo.typeInfo} form={form} />
        </Form>
    )
}
