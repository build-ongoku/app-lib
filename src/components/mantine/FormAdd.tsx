'use client'

import { EntityNamespaceReq, EnumNamespaceReq, IEnumNamespace, ITypeNamespace, TypeNamespaceReq } from '../../common/namespacev2'
import { Operator } from '../../common/Filter'

import {
    ComboboxData,
    ComboboxItem,
    Fieldset,
    JsonInput,
    JsonInputProps,
    FileInput as MantineFileInput,
    NumberInput as MantineNumberInput,
    MultiSelect,
    NumberInputProps,
    Select,
    SelectProps,
    Switch,
    SwitchProps,
    TextInput,
    TextInputProps,
} from '@mantine/core'
import { DateInputProps, DateTimePicker, DateTimePickerProps, DateInput as MantineDateInput } from '@mantine/dates'
import '@mantine/dates/styles.css'
import { UseFormReturnType } from '@mantine/form'
import { Field, ITypeMinimal, TypeInfo, Dtype } from '../../common/app_v3'
import { AppContext } from '../../common/AppContextV3'
import * as fieldkind from '../../common/fieldkind'
import { queryByTextV2, uploadFile } from '../../providers/provider'
import React, { useContext, useEffect, useState } from 'react'

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

        return <GenericFieldInput key={identifier} identifier={identifier} label={label} field={f} form={form} initialData={value} />
    })

    return <>{inputElements}</>
}

const GenericFieldInput = <T extends ITypeMinimal = any>(props: {
    identifier: string // formIdentifier for the input, e.g. 'email', 'name.firstName' etc.
    label: string
    field: Field
    form: UseFormReturnType<T>
    initialData?: T
}) => {
    const { field } = props

    return <GenericDtypeInput dtype={field.dtype} isRepeated={field.isRepeated} {...props} />
}

export const GenericDtypeInput = <T extends ITypeMinimal = any>(props: {
    dtype: Dtype
    identifier: string // formIdentifier for the input, e.g. 'email', 'name.firstName' etc.
    label: string
    form: UseFormReturnType<T>
    initialData?: T
    isRepeated?: boolean
}) => {
    const { dtype, label, identifier, isRepeated } = props

    const { appInfo } = useContext(AppContext)
    if (!appInfo) {
        throw new Error('AppInfo not available')
    }

    const defaultPlaceholder = ''

    // We can't process repeated fields yet, except for "select" where we can simply allow multiple selections.
    if (isRepeated && dtype.kind !== fieldkind.ForeignEntityKind && dtype.kind !== fieldkind.EnumKind) {
        return <DefaultInput label={label} placeholder="[]" identifier={identifier} form={props.form} />
    }

    switch (dtype.kind) {
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
        case fieldkind.IDKind:
            return <StringInput label={label} placeholder={defaultPlaceholder} identifier={identifier} form={props.form} />
        case fieldkind.ForeignEntityKind:
            const ns = dtype.namespace
            if (!ns) {
                console.error('Foreign Entity dtype does not have a reference namespace', dtype)
                throw new Error(`Foreign Entity dtype [${dtype.name}] does not have a reference namespace`)
            }
            return (
                <ForeignEntityInput
                    foreignEntityNs={ns.toRaw() as EntityNamespaceReq}
                    label={label}
                    placeholder={`Select ${ns.entity ? ns.entity.toCapital() : ''}`}
                    identifier={identifier}
                    form={props.form}
                    multiple={isRepeated}
                />
            )
        case fieldkind.EmailKind:
            return <EmailInput label={label} placeholder={defaultPlaceholder} identifier={identifier} form={props.form} />
        case fieldkind.MoneyKind:
            return <MoneyInput label={label} placeholder={defaultPlaceholder} identifier={identifier} form={props.form} />
        case fieldkind.EnumKind: {
            // Get enum values for the field
            const ns = dtype.namespace as IEnumNamespace
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
            const ns = dtype.namespace as ITypeNamespace
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

        case fieldkind.ConditionKind:
            return <DefaultConditionInput identifier={identifier} form={props.form} label={label} placeholder={defaultPlaceholder} />
        default:
            console.warn('Field type not found. Using default input', dtype.kind)
            return <DefaultInput label={label} placeholder="{}" identifier={identifier} form={props.form} />
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
    return <TextInput label={props.label} description={props.description} placeholder={props.placeholder} key={props.identifier} {...form.getInputProps(props.identifier)} data-1p-ignore />
}

export const NumberInput = (props: InputProps<NumberInputProps>) => {
    const { form } = props
    return (
        <MantineNumberInput
            label={props.label}
            description={props.description}
            placeholder={props.placeholder}
            key={props.identifier}
            {...form.getInputProps(props.identifier)}
            {...props.internalProps}
            data-1p-ignore
        />
    )
}

export const BooleanInput = (props: InputProps<SwitchProps>) => {
    const { form } = props
    return (
        <Switch
            label={props.label}
            description={props.description}
            placeholder={props.placeholder}
            key={props.identifier}
            {...form.getInputProps(props.identifier)}
            data-onepassword-title="disabled"
        />
    )
}

export const DateInput = (props: InputProps<DateInputProps>) => {
    const { form } = props
    return (
        <MantineDateInput
            valueFormat="DD/MM/YYYY"
            label={props.label}
            description={props.description}
            key={props.identifier}
            placeholder={props.placeholder}
            clearable
            {...form.getInputProps(props.identifier)}
        />
    )
}

export const TimestampInput = (props: InputProps<DateTimePickerProps>) => {
    const { form } = props
    return <DateTimePicker label={props.label} description={props.description} placeholder={props.placeholder} key={props.identifier} {...form.getInputProps(props.identifier)} data-1p-ignore />
}

export const EmailInput = (props: InputProps<TextInputProps>) => {
    const { form } = props
    return (
        <TextInput
            label={props.label}
            description={props.description}
            placeholder={props.placeholder}
            key={props.identifier}
            {...form.getInputProps(props.identifier)}
            leftSection="@"
            data-1p-ignore
        />
    )
}

export const MoneyInput = (props: InputProps<never>) => {
    return <NumberInput internalProps={{ prefix: '$', allowNegative: false, decimalScale: 2, fixedDecimalScale: true, thousandSeparator: ',' }} {...props} />
}

export const SelectInput = (props: InputProps<SelectProps>) => {
    const { form } = props
    const Component = props.internalProps?.multiple ? MultiSelect : Select
    return (
        <Component
            label={props.label}
            description={props.description}
            placeholder={props.placeholder}
            key={props.identifier}
            data={props.internalProps!.data}
            searchable
            clearable
            {...form.getInputProps(props.identifier)}
            data-1p-ignore
        />
    )
}

export const JSONInput = (props: InputProps<JsonInputProps>) => {
    const { form } = props
    return (
        <JsonInput
            label={props.label}
            placeholder={props.placeholder}
            validationError="The JSON you have provided looks invalid. Try using an online JSON validator?"
            formatOnBlur
            autosize
            key={props.identifier}
            {...form.getInputProps(props.identifier)}
            data-1p-ignore
        />
    )
}

interface ForeignEntityInputProps extends InputProps<never> {
    foreignEntityNs: EntityNamespaceReq
    // Allow multiple selections?
    multiple?: boolean
}

const ForeignEntityInput = (props: ForeignEntityInputProps) => {
    const [data, setData] = useState<ComboboxData | undefined>(undefined)
    const [searchTerm, setSearchTerm] = useState<string>('')

    // Get the entity info
    const { appInfo } = useContext(AppContext)
    if (!appInfo) {
        throw new Error('AppInfo not available')
    }

    const entityInfo = appInfo.getEntityInfo(props.foreignEntityNs)
    if (!entityInfo) {
        throw new Error(`Entity Info not found for ${props.foreignEntityNs}`)
    }

    useEffect(() => {
        queryByTextV2({
            entityInfo: entityInfo,
            data: { queryText: searchTerm },
        }).then((response) => {
            if (response.error) {
                console.error('Error fetching data', response.error)
                return
            }
            if (!response.data) {
                console.error('No data returned')
                return
            }
            if (!response.data.items || response.data.items.length === 0) {
                console.error('No items returned')
                return
            }
            const options: ComboboxData = response.data.items.map((e): ComboboxItem => {
                return { value: e.id, label: entityInfo.getEntityNameFriendly(e) }
            })
            setData(options)
        })
    }, [searchTerm])

    const internalProps: SelectProps = {
        onSearchChange: setSearchTerm,
        multiple: props.multiple,
        data: data,
    }

    return <SelectInput {...props} internalProps={internalProps} />
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

// Todo: Consider implementing conditions as Goku types, which would allow us to use the TypeAddForm for conditions as well.
const DefaultConditionInput = (props: InputProps<never>) => {
    const { form } = props

    // Loop over the operators and create a ComboboxData object
    const operators: ComboboxData = Object.keys(Operator).map((op) => {
        return { value: op, label: op }
    })
    return (
        <Fieldset legend={props.label}>
            <SelectInput label={'Operator'} placeholder={'Operator'} identifier={props.identifier + '.' + 'operator'} form={props.form} internalProps={{ data: operators }} />
            <JSONInput label={'Values'} placeholder={'{}'} identifier={props.identifier + '.' + 'values'} form={props.form} />
        </Fieldset>
    )
}
