import { AppInfoContext } from '@ongoku/app-lib/src/common/AppContext'
import * as field from '@ongoku/app-lib/src/common/Field'
import { FieldInfo, getValueForField } from '@ongoku/app-lib/src/common/Field'
import { TypeInfo, TypeMinimal } from '@ongoku/app-lib/src/common/Type'
import {
    Fieldset,
    JsonInput,
    JsonInputProps,
    Loader,
    NumberInput as MantineNumberInput,
    NumberInputProps,
    Select,
    SelectProps,
    Switch,
    SwitchProps,
    TextInput,
    TextInputProps,
    ComboboxData,
    ComboboxItem,
    FileInput as MantineFileInput,
} from '@mantine/core'
import { DateInputProps, DateTimePicker, DateTimePickerProps, DateInput as MantineDateInput } from '@mantine/dates'
import { UseFormReturnType } from '@mantine/form'
import { capitalCase } from 'change-case'
import React, { useContext, useState } from 'react'
import { uploadFile } from '@ongoku/app-lib/src/providers/provider'

export const TypeAddForm = <T extends TypeMinimal = any>(props: {
    typeInfo: TypeInfo<T>
    form: UseFormReturnType<T>
    identifier?: string // parent key, e.g. 'name', 'address' etc. Set this if this is a nested form, so the child inputs have the correct full key e.g. 'address.street', 'address.city' etc.
    initialData?: T
}) => {
    const { form, typeInfo } = props

    console.log('TypeAddForm', typeInfo)

    const inputElements = typeInfo.fieldInfos.map((fieldInfo) => {
        if (fieldInfo.isMetaField) {
            return
        }
        const label = capitalCase(fieldInfo.name)
        // if we're dealing with a nested form, the keys should be prefixed with the parent key
        const identifier = props.identifier ? props.identifier + '.' + fieldInfo.name : fieldInfo.name
        let value: any
        if (props.initialData) {
            value = getValueForField({ obj: props.initialData, fieldInfo: fieldInfo })
        }
        return <GenericInput key={identifier} identifier={identifier} label={label} fieldInfo={fieldInfo} form={form} initialData={value} />
    })

    return <>{inputElements}</>
}

const GenericInput = <T extends TypeMinimal = any>(props: {
    identifier: string // formIdentifier for the input, e.g. 'email', 'name.firstName' etc.
    label: string
    fieldInfo: FieldInfo

    form: UseFormReturnType<T>
    initialData?: T
}) => {
    const { fieldInfo, identifier, label } = props
    const { appInfo, loading } = useContext(AppInfoContext)
    if (loading) {
        return <Loader type="bars" size="sm" />
    }
    if (!appInfo) {
        throw new Error('AppInfo not available')
    }

    const defaultPlaceholder = ''
    console.log('GenericInput: identifier', identifier)

    console.log('GenericInput', fieldInfo)

    switch (fieldInfo.kind) {
        case field.StringKind:
            return <StringInput label={label} placeholder={defaultPlaceholder} identifier={identifier} form={props.form} />
        case field.NumberKind:
            return <NumberInput label={label} placeholder={defaultPlaceholder} identifier={identifier} form={props.form} />
        case field.BooleanKind:
            return <BooleanInput label={label} placeholder={defaultPlaceholder} identifier={identifier} form={props.form} />
        case field.DateKind:
            return <DateInput label={label} placeholder={defaultPlaceholder} identifier={identifier} form={props.form} />
        case field.TimestampKind:
            return <TimestampInput label={label} placeholder={defaultPlaceholder} identifier={identifier} form={props.form} />

        case field.EnumKind:
            // Get enum values from fieldInfo
            if (!fieldInfo.referenceNamespace) {
                throw new Error('Enum field does not have a reference namespace')
            }
            const enumInfo = appInfo.getEnumInfoByNamespace(fieldInfo?.referenceNamespace!)
            const options: ComboboxData | undefined = enumInfo?.valuesInfo.map((enumValueInfo): ComboboxItem => {
                return { value: enumValueInfo.value as string, label: enumValueInfo.getDisplayValue() }
            })
            return <SelectInput label={label} placeholder={defaultPlaceholder} identifier={identifier} form={props.form} internalProps={{ data: options }} />

        case field.NestedKind:
            if (!fieldInfo.referenceNamespace) {
                throw new Error('Nested field does not have a reference namespace')
            }
            const fieldTypeInfo = appInfo.getTypeInfoByNamespace<T>(fieldInfo.referenceNamespace)
            if (!fieldTypeInfo) {
                throw new Error('Type Info not found for field')
            }

            return (
                <Fieldset legend={label}>
                    <TypeAddForm identifier={identifier} typeInfo={fieldTypeInfo} form={props.form} />
                </Fieldset>
            )
        case field.FileKind:
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
    console.log('StringInput', props)
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

export const SelectInput = (props: InputProps<SelectProps>) => {
    const { form } = props
    return (
        <Select label={props.label} description={props.description} placeholder={props.placeholder} key={props.identifier} data={props.internalProps!.data} {...form.getInputProps(props.identifier)} />
    )
}

export const JSONInput = (props: InputProps<JsonInputProps>) => {
    const { form } = props
    return (
        <JsonInput
            label={props.label}
            placeholder={props.placeholder}
            validationError="Invalid JSON"
            formatOnBlur
            autosize
            minRows={4}
            key={props.identifier}
            {...form.getInputProps(props.identifier)}
        />
    )
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
