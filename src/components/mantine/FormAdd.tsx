import { EnumNamespaceReq, IEnumNamespace, ITypeNamespace, TypeNamespaceReq } from '@/common/namespacev2'
import { Email } from '@/common/scalars'
import {
    ComboboxData,
    ComboboxItem,
    Fieldset,
    JsonInput,
    JsonInputProps,
    FileInput as MantineFileInput,
    NumberInput as MantineNumberInput,
    NumberInputProps,
    Select,
    SelectProps,
    Switch,
    SwitchProps,
    TextInput,
    TextInputProps,
} from '@mantine/core'
import { DateInputProps, DateTimePicker, DateTimePickerProps, DateInput as MantineDateInput } from '@mantine/dates'
import { UseFormReturnType } from '@mantine/form'
import { Field, ITypeMinimal, TypeInfo } from '@ongoku/app-lib/src/common/app_v3'
import { AppContext } from '@ongoku/app-lib/src/common/AppContextV3'
import * as fieldkind from '@ongoku/app-lib/src/common/fieldkind'
import { uploadFile } from '@ongoku/app-lib/src/providers/provider'
import React, { useContext, useState } from 'react'

export const TypeAddForm = <T extends ITypeMinimal = any>(props: {
    typeInfo: TypeInfo<T>
    form: UseFormReturnType<T>
    parentIdentifier?: string // parent key, e.g. 'name', 'address' etc. Set this if this is a nested form, so the child inputs have the correct full key e.g. 'address.street', 'address.city' etc.
    initialData?: T
}) => {
    const { form, typeInfo } = props

    console.log('TypeAddForm', typeInfo)

    const inputElements = typeInfo.fields.map((f: Field) => {
        // Skip meta fields
        if (f.isMetaField) {
            return
        }
        if (f.excludeFromForm) {
            return
        }
        const label = f.getLabel()
        // if we're dealing with a nested form, the keys should be prefixed with the parent key
        const identifier = props.parentIdentifier ? props.parentIdentifier + '.' + f.name.toFieldName() : f.name.toFieldName()
        const value = props.initialData ? f.getFieldValue(props.initialData) : undefined

        return <GenericInput key={identifier} identifier={identifier} label={label} field={f} form={form} initialData={value} />
    })

    return <>{inputElements}</>
}

const GenericInput = <T extends ITypeMinimal = any>(props: {
    identifier: string // formIdentifier for the input, e.g. 'email', 'name.firstName' etc.
    label: string
    field: Field
    form: UseFormReturnType<T>
    initialData?: T
}) => {
    const { field, identifier, label } = props
    const { appInfo } = useContext(AppContext)
    if (!appInfo) {
        throw new Error('AppInfo not available')
    }

    const defaultPlaceholder = ''

    switch (field.dtype.kind) {
        case fieldkind.StringKind:
            return <StringInput label={label} placeholder={defaultPlaceholder} identifier={identifier} form={props.form} />
        case fieldkind.NumberKind:
            return <NumberInput label={label} placeholder={defaultPlaceholder} identifier={identifier} form={props.form} />
        case fieldkind.BoolKind:
            return <BooleanInput label={label} placeholder={defaultPlaceholder} identifier={identifier} form={props.form} />
        case fieldkind.DateKind:
            return <DateInput label={label} placeholder={defaultPlaceholder} identifier={identifier} form={props.form} />
        case fieldkind.TimestampKind:
            return <TimestampInput label={label} placeholder={defaultPlaceholder} identifier={identifier} form={props.form} />
        case fieldkind.EmailKind:
            return <EmailInput label={label} placeholder={defaultPlaceholder} identifier={identifier} form={props.form} />
        case fieldkind.EnumKind: {
            // Get enum values for the field
            const ns = field.dtype.namespace as IEnumNamespace
            if (!ns) {
                throw new Error('Enum field does not have a reference namespace')
            }
            const enumInfo = appInfo.getEnum(ns.raw as EnumNamespaceReq)
            const options: ComboboxData | undefined = enumInfo?.values.map((enumVal): ComboboxItem => {
                return { value: enumVal.value as string, label: enumVal.getDisplayValue() }
            })
            return <SelectInput label={label} placeholder={defaultPlaceholder} identifier={identifier} form={props.form} internalProps={{ data: options }} />
        }

        case fieldkind.NestedKind: {
            // Get the type info for the nested field
            const ns = field.dtype.namespace as ITypeNamespace
            if (!ns) {
                throw new Error('Nested field does not have a reference namespace')
            }
            const fieldTypeInfo = appInfo.getTypeInfo<T>(ns.toRaw() as TypeNamespaceReq)
            if (!fieldTypeInfo) {
                throw new Error('Type Info not found for field')
            }

            return (
                <Fieldset legend={label}>
                    <TypeAddForm parentIdentifier={identifier} typeInfo={fieldTypeInfo} form={props.form} />
                </Fieldset>
            )
        }
        case fieldkind.FileKind:
            return <FileInput identifier={identifier} form={props.form} label={label} placeholder={defaultPlaceholder} />

        default:
            return <DefaultInput label={label} placeholder="..." identifier={identifier} form={props.form} />
    }
}

interface InputProps<T = any> {
    internalProps?: Omit<T, 'label' | 'placeholder' | 'description' | 'key'> // Internal props for the input component, specific to the library that the input component is from
    form: UseFormReturnType<any>

    identifier: string // formIdentifier for the input, e.g. 'email', 'name.firstName' etc.
    label: string
    placeholder: string
    description?: string
    value?: string // Any initial value?
    // onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const DefaultInput = (props: InputProps<never>) => {
    return <JSONInput {...props} />
}

export const StringInput = (props: InputProps<TextInputProps>) => {
    const { form } = props
    return <TextInput label={props.label} description={props.description} placeholder={props.placeholder} key={props.identifier} {...form.getInputProps(props.identifier)} />
}

export const NumberInput = (props: InputProps<NumberInputProps>) => {
    const { form } = props
    return <MantineNumberInput label={props.label} description={props.description} placeholder={props.placeholder} key={props.identifier} {...form.getInputProps(props.identifier)} />
}

export const BooleanInput = (props: InputProps<SwitchProps>) => {
    const { form } = props
    return <Switch label={props.label} description={props.description} placeholder={props.placeholder} key={props.identifier} {...form.getInputProps(props.identifier)} />
}

export const DateInput = (props: InputProps<DateInputProps>) => {
    const { form } = props
    return (
        <MantineDateInput
            valueFormat="DD/MM/YYYY HH:mm:ss"
            label={props.label}
            description={props.description}
            key={props.identifier}
            placeholder={props.placeholder}
            {...form.getInputProps(props.identifier)}
        />
    )
}

export const TimestampInput = (props: InputProps<DateTimePickerProps>) => {
    const { form } = props
    return <DateTimePicker label={props.label} description={props.description} placeholder={props.placeholder} key={props.identifier} {...form.getInputProps(props.identifier)} />
}

export const EmailInput = (props: InputProps<TextInputProps>) => {
    const { form } = props
    // Update the validate function for a specific field

    // form.validate = (values: any) => {
    //     return {
    //         ...form.validate,
    //         [props.identifier]: /^\S+@\S+$/.test(values.email) ? null : 'Invalid email',
    //     }
    // }

    return <TextInput label={props.label} description={props.description} placeholder={props.placeholder} key={props.identifier} {...form.getInputProps(props.identifier)} leftSection="@" />
}

export const SelectInput = (props: InputProps<SelectProps>) => {
    const { form } = props
    return (
        <Select
            label={props.label}
            description={props.description}
            placeholder={props.placeholder}
            key={props.identifier}
            data={props.internalProps!.data}
            searchable
            {...form.getInputProps(props.identifier)}
        />
    )
}

export const JSONInput = (props: InputProps<JsonInputProps>) => {
    const { form } = props
    return <JsonInput label={props.label} placeholder={props.placeholder} validationError="Invalid JSON" formatOnBlur autosize key={props.identifier} {...form.getInputProps(props.identifier)} />
}

export const FileInput = (props: InputProps<never>) => {
    const { form } = props
    const [file, setFile] = useState<File | null>(null)

    // If the label has suffix ID, Id, id etc. then remove it
    const label = props.label.replace(/(id)$/i, '')

    const onChange = async (val: File | null) => {
        console.log('File Change', val)
        setFile(val)
        if (!val) {
            return
        }
        // Make the request to upload the file
        uploadFile(val, (progress) => {
            console.log('Progress', progress)
        })
            .then((response) => {
                console.log('File Uploaded', response)
                if (response.error) {
                    form.setFieldError(props.identifier, 'File upload failed: ' + response.error)
                } else if (!response.data?.id) {
                    console.log('File upload failed: No ID returned', response.data?.id)
                    form.setFieldError(props.identifier, 'File upload failed: No ID returned')
                } else {
                    console.log('File upload: Setting field value', response.data?.id)
                    form.setFieldValue(props.identifier, response.data?.id)
                }
            })
            .catch((error) => {
                console.error('File Upload Error', error)
            })
    }
    return (
        <MantineFileInput
            {...form.getInputProps(props.identifier)}
            value={file}
            onChange={onChange}
            label={label}
            placeholder={props.placeholder}
            description={props.description}
            key={props.identifier}
        />
    )
}
