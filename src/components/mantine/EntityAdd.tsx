'use client'

import { useForm } from '@mantine/form'
import { EntityInfo, EntityMinimal } from '@/common/Entity'
import { Form } from '@/components/mantine/Form'
import { TypeAddForm } from '@/components/mantine/FormAdd'
import { getEntityPath } from '@/providers/provider'
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

    const router = useRouter()
    const form = useForm<E>({
        mode: 'uncontrolled',
        validate: {},
        initialValues: initialData,
    })

    console.log('EntityAddForm', entityInfo)

    return (
        <Form<E, E>
            form={form}
            submitButtonText={`Add ${entityInfo.getEntityNameFormatted()}`}
            postEndpoint={getEntityPath({ entityInfo: entityInfo })}
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
