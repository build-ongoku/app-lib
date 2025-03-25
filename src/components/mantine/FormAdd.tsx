'use client'

import { EntityNamespaceReq, EnumNamespaceReq, IEnumNamespace, ITypeNamespace, TypeNamespaceReq } from '../../common/namespacev2'
import { Operator } from '../../common/Filter'

import {
    ComboboxData,
    ComboboxItem,
    Fieldset,
    JsonInput as MantineJSONInput,
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
    MultiSelectProps,
    Group,
    ActionIcon,
    Button,
    Box,
    Anchor,
} from '@mantine/core'
import { DateInputProps, DateTimePicker, DateTimePickerProps, DateInput as MantineDateInput } from '@mantine/dates'
import '@mantine/dates/styles.css'
import { UseFormReturnType } from '@mantine/form'
import { Field, ITypeMinimal, TypeInfo, Dtype } from '../../common/app_v3'
import { AppContext } from '../../common/AppContextV3'
import * as fieldkind from '../../common/fieldkind'
import { listEntity, queryByTextEntity, uploadFile } from '../../providers/httpV2'
import React, { useContext, useEffect, useState } from 'react'
import { Email, ID, Money } from '../../common/scalars'
import { IconTrash } from '@tabler/icons-react'
import { randomId } from '@mantine/hooks'
import { MetaFieldKeys } from '../../common/types'

export const TypeAddForm = <T extends ITypeMinimal = any>(props: {
    typeInfo: TypeInfo<T>
    form: UseFormReturnType<T>
    parentIdentifier?: string // parent key, e.g. 'name', 'address' etc. Set this if this is a nested form, so the child inputs have the correct full key e.g. 'address.street', 'address.city' etc.
    initialData?: T | Omit<T, MetaFieldKeys>
}) => {
    const { form, typeInfo } = props
    let { initialData } = props

    console.log('TypeAddForm', typeInfo)

    const { appInfo } = useContext(AppContext)
    if (!appInfo) {
        throw new Error('AppInfo not available')
    }

    // if initial data is not set, use typeInfo to get empty initial data
    if (!initialData) {
        initialData = typeInfo.getEmptyObject(appInfo)
    }

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
        const value = initialData ? f.getFieldValue(initialData) : undefined

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

const GenericDtypeInputRepeated = <T extends any>(props: {
    dtype: Dtype
    identifier: string // formIdentifier for the input, e.g. 'email', 'name.firstName' etc.
    label: string
    form: UseFormReturnType<any>
    initialData?: T
}) => {
    const { dtype, label, identifier, initialData, form } = props

    // Initial data is an array. Enforce that.

    if (dtype.kind == fieldkind.NestedKind) {
        const value = form.getInputProps(props.identifier).defaultValue ?? initialData ?? []

        const items = Object.entries(value).map(([key, value]) => ({
            key,
            value,
        }))

        // Loop over the items and create a form for each one
        const itemsForm = items.map(({ key, value }, index) => {
            // identifier for individual item looks like: `parentfield.${index}.subfield`
            const subIdentifier = `${identifier}.${key}`
            console.log('key', key, 'value', value, 'index', index, 'sub-identifier', subIdentifier)

            return (
                <Group key={key} mt="xs">
                    <GenericDtypeInput dtype={dtype} identifier={subIdentifier} label={label} form={form} initialData={value} isRepeated={false} />
                    <ActionIcon
                        color="red"
                        onClick={() => {
                            console.log('Removing item', identifier, index, key)
                            form.removeListItem(identifier, index)
                        }}
                    >
                        <IconTrash size={16} />
                    </ActionIcon>
                </Group>
            )
        })

        return (
            <Box maw={500} mx="auto">
                {itemsForm}
                <Group mt="xs">
                    <Button
                        onClick={() => {
                            form.insertListItem(identifier, {key: randomId()})
                            console.log('Inserting item', identifier)
                        }}
                    >
                        Add {label}
                    </Button>
                </Group>
            </Box>
        )
    }

    return <JSONInput label={label} description="JSON" initialValue={initialData} identifier={identifier} form={form} placeholder="[]" />
}

export const GenericDtypeInput = <T extends any>(props: {
    dtype: Dtype
    identifier: string // formIdentifier for the input, e.g. 'email', 'name.firstName' etc.
    label: string
    form: UseFormReturnType<any>
    initialData?: T
    isRepeated?: boolean
}) => {
    const { dtype, label, identifier, isRepeated, initialData, form } = props

    console.log('GenericDtypeInput', props)

    const { appInfo } = useContext(AppContext)
    if (!appInfo) {
        throw new Error('AppInfo not available')
    }

    const defaultPlaceholder = ''

    // We can't process repeated fields yet, except for "select" where we can simply allow multiple selections.
    if (isRepeated && dtype.kind !== fieldkind.ForeignEntityKind && dtype.kind !== fieldkind.EnumKind) {
        return <GenericDtypeInputRepeated {...props} />
    }

    switch (dtype.kind) {
        case fieldkind.StringKind:
            return <StringInput label={label} placeholder={defaultPlaceholder} identifier={identifier} initialValue={initialData as string | undefined} form={props.form} />
        case fieldkind.NumberKind:
            return <NumberInput label={label} placeholder={defaultPlaceholder} identifier={identifier} initialValue={initialData as number | undefined} form={props.form} />
        case fieldkind.BoolKind:
            return <BooleanInput label={label} placeholder={defaultPlaceholder} identifier={identifier} initialValue={initialData as boolean | undefined} form={props.form} />
        case fieldkind.DateKind:
            return <DateInput label={label} placeholder={defaultPlaceholder} identifier={identifier} initialValue={initialData as Date | undefined} form={props.form} />
        case fieldkind.TimestampKind:
            return <TimestampInput label={label} placeholder={defaultPlaceholder} identifier={identifier} initialValue={initialData as Date | undefined} form={props.form} />
        case fieldkind.IDKind:
            return <StringInput label={label} placeholder={defaultPlaceholder} identifier={identifier} initialValue={initialData as ID | undefined} form={props.form} />
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
                    initialValue={initialData as ID | ID[] | undefined}
                    form={props.form}
                    multiple={isRepeated}
                />
            )
        case fieldkind.EmailKind:
            return <EmailInput label={label} placeholder={defaultPlaceholder} identifier={identifier} initialValue={initialData as Email | undefined} form={props.form} />
        case fieldkind.MoneyKind:
            return <MoneyInput label={label} placeholder={defaultPlaceholder} identifier={identifier} initialValue={initialData as Money | undefined} form={props.form} />
        case fieldkind.GenericDataKind:
            return <GenericDataInput label={label} placeholder={defaultPlaceholder} identifier={identifier} initialValue={initialData} form={props.form} />
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
            return (
                <SelectOrMultiSelectInput
                    label={label}
                    placeholder={defaultPlaceholder}
                    identifier={identifier}
                    initialValue={initialData as string | string[]}
                    form={props.form}
                    internalProps={{ data: options }}
                />
            )
        }

        case fieldkind.NestedKind: {
            // Get the type info for the nested field
            const ns = dtype.namespace as ITypeNamespace
            if (!ns) {
                throw new Error('Nested field does not have a reference namespace')
            }
            const fieldTypeInfo = appInfo.getTypeInfo<T extends ITypeMinimal ? T : never>(ns.toRaw() as TypeNamespaceReq)
            if (!fieldTypeInfo) {
                throw new Error('Type Info not found for field')
            }

            return (
                <Fieldset legend={label}>
                    <TypeAddForm parentIdentifier={identifier} typeInfo={fieldTypeInfo} initialData={initialData} form={props.form} />
                </Fieldset>
            )
        }
        case fieldkind.FileKind:
            return <FileInput identifier={identifier} form={props.form} label={label} placeholder={defaultPlaceholder} />

        case fieldkind.ConditionKind:
            return <DefaultConditionInput identifier={identifier} form={props.form} label={label} placeholder={defaultPlaceholder} />
        default:
            console.warn('Field type not found. Using default input', dtype.kind)
            return <JSONInput label={label} placeholder={defaultPlaceholder} identifier={identifier} initialValue={initialData} form={props.form} />
    }
}

interface InputProps<InternalPropsT = any, T = any> {
    internalProps?: Omit<InternalPropsT, 'label' | 'placeholder' | 'description' | 'key'> // Internal props for the input component, specific to the library that the input component is from
    form: UseFormReturnType<any>

    identifier: string // formIdentifier for the input, e.g. 'email', 'name.firstName' etc.
    label: string
    placeholder: string
    description?: string
    initialValue?: T // Any initial value?
}

export const DefaultInput = <T extends any = any>(props: InputProps<never, T>) => {
    return <JSONInput<T> {...props} />
}

export const StringInput = (props: InputProps<TextInputProps, string>) => {
    const { form } = props

    // Get the form input props so we can change the "null" default value to "undefined"
    const formInputProps = form.getInputProps(props.identifier)
    formInputProps.defaultValue = formInputProps.defaultValue ?? undefined

    return <TextInput key={props.identifier} label={props.label} description={props.description} placeholder={props.placeholder} {...formInputProps} {...props.internalProps} data-1p-ignore />
}

export const NumberInput = (props: InputProps<NumberInputProps, number>) => {
    const { form } = props

    // Get the form input props so we can change the "null" default value to "undefined"
    const formInputProps = form.getInputProps(props.identifier)
    formInputProps.defaultValue = formInputProps.defaultValue ?? undefined

    return <MantineNumberInput key={props.identifier} label={props.label} description={props.description} placeholder={props.placeholder} {...formInputProps} {...props.internalProps} data-1p-ignore />
}

export const BooleanInput = (props: InputProps<SwitchProps, boolean>) => {
    const { form } = props

    // Get the form input props so we can change the "null" default value to "undefined"
    const formInputProps = form.getInputProps(props.identifier)
    formInputProps.defaultValue = formInputProps.defaultValue ?? undefined

    return (
        <Switch
            key={props.identifier}
            label={props.label}
            description={props.description}
            placeholder={props.placeholder}
            {...formInputProps}
            {...props.internalProps}
            defaultChecked={props.initialValue}
            data-onepassword-title="disabled"
        />
    )
}

export const DateInput = (props: InputProps<DateInputProps, Date>) => {
    const { form } = props

    // Get the form input props so we can change the "null" default value to "undefined"
    const formInputProps = form.getInputProps(props.identifier)
    formInputProps.defaultValue = formInputProps.defaultValue ?? undefined

    return (
        <MantineDateInput
            key={props.identifier}
            valueFormat="DD/MM/YYYY"
            label={props.label}
            description={props.description}
            placeholder={props.placeholder}
            clearable
            {...formInputProps}
            {...props.internalProps}
        />
    )
}

export const TimestampInput = (props: InputProps<DateTimePickerProps, Date>) => {
    const { form } = props

    // Get the form input props so we can change the "null" default value to "undefined"
    const formInputProps = form.getInputProps(props.identifier)
    formInputProps.defaultValue = formInputProps.defaultValue ?? undefined

    return <DateTimePicker key={props.identifier} label={props.label} description={props.description} placeholder={props.placeholder} {...formInputProps} {...props.internalProps} data-1p-ignore />
}

export const EmailInput = (props: InputProps<TextInputProps, Email>) => {
    const { form } = props

    // Get the form input props so we can change the "null" default value to "undefined"
    const formInputProps = form.getInputProps(props.identifier)
    formInputProps.defaultValue = formInputProps.defaultValue ?? undefined

    return (
        <TextInput
            key={props.identifier}
            label={props.label}
            description={props.description}
            placeholder={props.placeholder}
            {...formInputProps}
            {...props.internalProps}
            leftSection="@"
            data-1p-ignore
        />
    )
}

export const SelectOrMultiSelectInput = <T extends string>(props: InputProps<SelectProps | MultiSelectProps, T | T[]>) => {
    const { form } = props
    console.log('SelectOrMultiSelectInput', props)

    // Make common props from the props.internalProps.
    const commonPropValues = {
        label: props.label,
        description: props.description,
        placeholder: props.placeholder,
        searchable: true,
        clearable: true,
        'data-1p-ignore': true,
    }

    if (props.initialValue) {
        commonPropValues.placeholder = 'Selected: ' + props.initialValue
    }

    // Get the form input props so we can change the "null" default value to "undefined"
    const formInputProps = form.getInputProps(props.identifier)
    formInputProps.defaultValue = formInputProps.defaultValue ?? undefined

    if (props.internalProps?.multiple) {
        return <MultiSelect key={props.identifier} {...formInputProps} {...commonPropValues} {...(props.internalProps as MultiSelectProps)} />
    }

    return <Select key={props.identifier} {...form.getInputProps(props.identifier)} {...commonPropValues} {...(props.internalProps as SelectProps)} />
}

export const MoneyInput = (props: InputProps<never, Money>) => {
    return <NumberInput internalProps={{ prefix: '$', allowNegative: false, decimalScale: 2, fixedDecimalScale: true, thousandSeparator: ',' }} {...props} />
}

export const GenericDataInput = <T extends any>(props: InputProps<never, T>) => {
    const { form } = props
    const formProps = form.getInputProps(props.identifier)
    const newOnChange = (e: any) => {
        console.log('Generic Data Change', e)
        // deserialize the JSON string
        try {
            e = JSON.parse(e)
            console.log('Deserialized', e)
        } catch (error) {}

        formProps.onChange(e)
    }
    return (
        <MantineJSONInput
            key={props.identifier}
            label={props.label}
            placeholder={props.placeholder}
            validationError="The JSON you have provided looks invalid. Try using an online JSON validator?"
            formatOnBlur
            autosize
            {...formProps}
            onChange={newOnChange}
            data-1p-ignore
        />
    )
}

export const JSONInput = <T extends any = any>(props: InputProps<JsonInputProps, T>) => {
    console.log('JSONInput', props)

    const { form } = props

    // Get the form input props so we can change the "null" default value to "undefined"
    const formInputProps = form.getInputProps(props.identifier)
    formInputProps.defaultValue = formInputProps.defaultValue ?? undefined
    // if the initial value is an empty array, set the default value to undefined
    if (Array.isArray(props.initialValue) && props.initialValue.length === 0) {
        formInputProps.defaultValue = undefined
    }
    // if the initial value is an empty object, set the default value to undefined
    if (typeof props.initialValue === 'object' && Object.keys(props.initialValue ?? {}).length === 0) {
        formInputProps.defaultValue = undefined
    }

    console.log('JSONInput formInputProps', formInputProps)
    return (
        <MantineJSONInput
            key={props.identifier}
            label={props.label}
            description={props.description}
            placeholder={props.placeholder}
            validationError={
                <>
                    {'The JSON you have provided looks invalid. Try using an '}
                    <a href="https://jsonlint.com" target="_blank" rel="noopener noreferrer">online JSON validator.</a>
                </>
            }
            formatOnBlur
            autosize
            {...formInputProps}
            {...props.internalProps}
            data-1p-ignore
        />
    )
}

interface ForeignEntityInputProps extends InputProps<never, ID | ID[]> {
    foreignEntityNs: EntityNamespaceReq
    // Allow multiple selections?
    multiple?: boolean
}

const ForeignEntityInput = (props: ForeignEntityInputProps) => {
    const [options, setOptions] = useState<ComboboxData | undefined>(undefined)
    const [searchTerm, setSearchTerm] = useState<string>('')

    // Get the entity info
    const { appInfo } = useContext(AppContext)
    if (!appInfo) {
        throw new Error('AppInfo not available')
    }

    const entityInfo = appInfo.getEntityInfo(props.foreignEntityNs)
    if (!entityInfo) {
        throw new Error(`Entity Info not found for request ${JSON.stringify(props.foreignEntityNs)}`)
    }

    useEffect(() => {
        // Only search if there is a search term
        if (!searchTerm) {
            return
        }
        // Search for options
        queryByTextEntity({
            entityNamespace: props.foreignEntityNs,
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
            setOptions(options)
        })
    }, [searchTerm])

    // If there is initial data, we need to fetch the entity and set the initial values
    useEffect(() => {
        // No initial data
        if (!props.initialValue || props.initialValue.length === 0) {
            return
        }
        // List by the ids
        listEntity({
            entityNamespace: props.foreignEntityNs,
            data: {
                filter: {
                    id: {
                        op: Operator.IN,
                        // if initial values is array, use as is, other wise make it into an array
                        values: typeof props.initialValue === 'string' ? [props.initialValue] : props.initialValue,
                    },
                },
            },
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
            // Set the initially selected values
            const options: ComboboxData = response.data.items.map((e): ComboboxItem => {
                return { value: e.id, label: entityInfo.getEntityNameFriendly(e) }
            })
            if (options.length > 0) {
                setOptions(options)
                console.log('[ForeignEntityInput] Setting initial values', props.initialValue)
            }
            // const ids = response.data.items.map((e) => e.id)
            // if (props.multiple) {
            //     props.form.setFieldValue(props.identifier, ids)
            //     return
            // }
            // props.form.setFieldValue(props.identifier, ids[0])
        })
    }, [props.initialValue])

    // Overwrite the label to remove the ID or IDs suffix
    const label = props.label.replace(/(ids?)$/i, '')

    const internalProps: SelectProps | MultiSelectProps = {
        onSearchChange: setSearchTerm,
        multiple: props.multiple,
        data: options,
    }
    return <SelectOrMultiSelectInput {...props} label={label} internalProps={internalProps} />
}

export const FileInput = (props: InputProps<never, ID>) => {
    const { form } = props
    const [file, setFile] = useState<File | null>(null)

    // Todo: If initial value is set, fetch the file and set the file state

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
    return <MantineFileInput {...form.getInputProps(props.identifier)} onChange={onChange} label={label} placeholder={props.placeholder} description={props.description} key={props.identifier} />
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
            <SelectOrMultiSelectInput label={'Operator'} placeholder={'Operator'} identifier={props.identifier + '.' + 'operator'} form={props.form} internalProps={{ data: operators }} />
            <JSONInput label={'Values'} placeholder={'{}'} identifier={props.identifier + '.' + 'values'} form={props.form} />
        </Fieldset>
    )
}
