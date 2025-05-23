import { AppInfoContext } from '@ongoku/app-lib/src/archive/common/AppContext'
import { EntityMinimal } from '@ongoku/app-lib/src/archive/common/Entity'
import { TypeInfo, TypeMinimal } from '@ongoku/app-lib/src/archive/common/Type'

import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Card, DatePicker, Form, FormItemProps, Input, InputNumber, InputNumberProps, InputProps, Select, Spin, Switch, SwitchProps } from 'antd'
import { PickerDateProps, PickerTimeProps } from 'antd/lib/date-picker/generatePicker'
import React, { useContext, useState } from 'react'

import { SizeType } from 'antd/lib/config-provider/SizeContext'
import { capitalCase } from 'change-case'
import { getFieldForFieldKind } from '@ongoku/app-lib/src/components/antd/FieldAntd'
import { FieldFormProps } from '@ongoku/app-lib/src/archive/components/Field'
import { useListEntityByTextQuery } from '@ongoku/app-lib/src/providers/provider'

export const combineFormItemName = (parentName: NamePath | undefined, currentName: string | number): NamePath => {
    if (parentName !== undefined) {
        if (Array.isArray(parentName)) {
            return [...parentName, currentName]
        }
        return [parentName, currentName]
    }
    return currentName
}

type NamePath = string | number | (string | number)[]

interface TypeFormItemsProps<T extends TypeMinimal> {
    typeInfo: TypeInfo<T>
    parentItemName?: NamePath
    formItemProps?: Partial<FormItemProps<T>> // antd's props
    noLabels?: boolean
    usePlaceholders?: boolean
}

// TypeFormItems renders a form given a TypeInfo
export const TypeFormItems = <T extends TypeMinimal>(props: TypeFormItemsProps<T>) => {
    const { typeInfo, parentItemName, formItemProps } = props

    const initialValue = formItemProps?.initialValue
    const initialValueFields = Object.keys(initialValue ?? {})
    const initialValueValues = Object.values(initialValue ?? {})
    console.log('Type Form Items: ', typeInfo.name, initialValue, initialValueFields, initialValueValues)

    // Filter to remove the fields that we don't want to show in an Add form
    // Do not create form input for meta fields like ID, created_at etc.
    const filteredFieldInfos = typeInfo.fieldInfos.filter((fieldInfo) => {
        return !fieldInfo.isMetaField
    })

    // Create a list of all the form items by looping over all applicable fieldInfo
    const formItems: JSX.Element[] = filteredFieldInfos.map((fieldInfo) => {
        const name = combineFormItemName(parentItemName, fieldInfo.name)

        const fieldKind = fieldInfo.kind
        const fieldComponent = getFieldForFieldKind(fieldKind)
        const label = fieldComponent.getLabel(fieldInfo)
        const labelString = fieldComponent.getLabelString(fieldInfo)
        const initialValue = initialValueValues[initialValueFields.indexOf(fieldInfo.name)]
        console.log('Rendering input form for', name, 'field index', initialValueFields.indexOf(fieldInfo.name))

        const finalFormItemProps: Partial<FormItemProps> = {
            ...formItemProps,
            ...{
                label: props.noLabels ? undefined : label,
                name: name,
                initialValue: initialValue,
            },
        }
        const sharedInputProps: LocalSharedInputProps = {
            placeholder: props.usePlaceholders ? labelString : undefined,
            size: 'small',
        }

        console.log('TypeFormItems: getting InputComponent for', fieldInfo.name, 'kind', fieldKind.name)
        let InputComponent: React.ComponentType<FieldFormProps<FormInputProps>> = fieldComponent.getInputComponent()

        // If a field is an array, use the isRepeated InputItem for that Field's Kind
        if (fieldInfo.isRepeated) {
            console.log('TypeFormItems: getting Repeated InputComponent for', fieldInfo.name, 'kind', fieldKind.name)
            InputComponent = fieldComponent.getInputRepeatedComponent()
        }

        return <InputComponent key={fieldInfo.name} fieldInfo={fieldInfo} formItemProps={finalFormItemProps} sharedInputProps={sharedInputProps} />
    })

    return <>{formItems}</>
}

export interface FormInputProps {
    formItemProps?: Partial<FormItemProps>
    sharedInputProps?: LocalSharedInputProps
    stringInputProps?: Partial<InputProps>
    numberInputProps?: Partial<InputNumberProps>
    switchProps?: Partial<SwitchProps>
    datePickerProps?: PickerDateProps<any>
    timePickerProps?: Omit<PickerTimeProps<any>, 'picker'> & React.RefAttributes<any>
}

export interface LocalSharedInputProps {
    placeholder?: string
    size?: SizeType // antd's SizeType
}

export const DefaultInput = (props: FormInputProps) => {
    return (
        <Form.Item {...props.formItemProps}>
            <Input {...props.sharedInputProps} {...props.stringInputProps} />
        </Form.Item>
    )
}

export const StringInput = (props: FormInputProps) => {
    return (
        <Form.Item {...props.formItemProps}>
            <Input {...props.sharedInputProps} {...props.stringInputProps} />
        </Form.Item>
    )
}

export const NumberInput = (props: FormInputProps) => {
    return (
        <Form.Item {...props.formItemProps}>
            <InputNumber {...props.sharedInputProps} {...props.numberInputProps} />
        </Form.Item>
    )
}

export const BooleanInput = (props: FormInputProps) => {
    return (
        <Form.Item {...props.formItemProps} label={props.sharedInputProps?.placeholder} colon={false}>
            <Switch {...props.switchProps} />
        </Form.Item>
    )
}

export const DateInput = (props: FormInputProps) => {
    return (
        <Form.Item {...props.formItemProps}>
            <DatePicker {...props.datePickerProps} />
        </Form.Item>
    )
}

export const TimestampInput = (props: FormInputProps) => {
    return (
        <Form.Item {...props.formItemProps}>
            <DatePicker showTime={true} {...props.sharedInputProps} {...props.datePickerProps} {...props.timePickerProps} />
        </Form.Item>
    )
}

export const SelectInput = (props: React.PropsWithChildren<FormInputProps>) => {
    return (
        <Form.Item {...props.formItemProps}>
            <Select>{props.children}</Select>
        </Form.Item>
    )
}

export const ForeignEntitySelectInput = <FET extends EntityMinimal = any>(props: FieldFormProps & { mode?: 'multiple' | 'tags' }) => {
    const { fieldInfo } = props

    const [options, setOptions] = useState<{}[]>([])
    const [isFetching, setIsFetching] = useState<boolean>(false)

    // Get ServiceInfo from context
    const { appInfo } = useContext(AppInfoContext)

    if (!appInfo) {
        return <Spin />
    }

    if (!fieldInfo.foreignEntityInfo) {
        throw new Error('ForeignEntitySelectInput for field with no foreignEntityInfo')
    }
    if (!fieldInfo.foreignEntityInfo.serviceName) {
        throw new Error('ForeignObjectField with no foreignEntityInfo.serviceName')
    }

    if (!fieldInfo.foreignEntityInfo.entityName) {
        throw new Error('ForeignObjectField with no foreignEntityName')
    }
    const foreignEntityInfo = appInfo.getEntityInfo<FET>(fieldInfo.foreignEntityInfo.serviceName, fieldInfo.foreignEntityInfo.entityName)
    if (!foreignEntityInfo) {
        throw new Error('ForeignObjectField with no foreignEntityInfo')
    }

    const handleSearch = (value: string) => {
        if (!value) {
            return
        }
        console.log('Searching for Foreign Entity with value:', value)
        setIsFetching(true)

        const [{ loading, error, data }] = useListEntityByTextQuery<FET>({
            entityInfo: foreignEntityInfo,
            params: {
                query_text: value,
            },
        })

        if (loading && !isFetching) {
            setIsFetching(true)
            return
        }

        if (error) {
            console.error('Could not ListEntityByTextQuery:', error)
            return
        }

        if (data) {
            setOptions(
                data.items.map((e: FET) => ({
                    value: e.id,
                    label: foreignEntityInfo.getHumanName(e),
                }))
            )
            setIsFetching(false)
        }
    }
    const handleChange = (value: string) => {
        console.log('Foreign Entity - Change detected:', value)
    }

    const placeholder = props.sharedInputProps?.placeholder ?? 'Please type to search'

    console.log('Foreign Entity Select, options:', options)

    return (
        <Form.Item {...props.formItemProps}>
            <Select
                {...props.sharedInputProps}
                placeholder={placeholder}
                // mode="multiple"
                // style={style}
                // defaultActiveFirstOption={false}
                // showArrow={false}
                showSearch
                onSearch={handleSearch}
                filterOption={true}
                optionFilterProp="label"
                optionLabelProp="label"
                onChange={handleChange}
                allowClear={true}
                loading={isFetching}
                options={options}
            />
        </Form.Item>
    )
}

export const getInputComponentWithRepetition = (InputComponent: React.ComponentType<FieldFormProps>): React.ComponentType<FieldFormProps> => {
    return (props: FieldFormProps) => {
        const { fieldInfo, formItemProps } = props

        console.log('Repeated component for fieldInfo', fieldInfo, 'with InputComponent', InputComponent)

        // Show label for the list, but not for individual items
        const label = formItemProps?.label
        if (formItemProps?.label) {
            delete formItemProps.label
        }

        const name = formItemProps?.name ?? fieldInfo.name
        if (formItemProps?.name) {
            delete formItemProps.name
        }

        return (
            <Form.Item {...formItemProps} label={label}>
                <Form.List name={name}>
                    {(fields, { add, remove }) => {
                        console.log('FormList: outer function. fields=', fields)
                        return (
                            <>
                                {fields.map((field, index) => {
                                    console.log('FormList: inner map. field', field, 'index', index)
                                    const DeleteItem = (
                                        <MinusCircleOutlined
                                            className="dynamic-delete-button"
                                            style={{ margin: '0 8px' }}
                                            onClick={() => {
                                                remove(field.name)
                                            }}
                                        />
                                    )
                                    return (
                                        <Card key={field.key} size="small" type="inner" title={`#${index + 1}`} extra={DeleteItem} style={{ padding: 0 }}>
                                            <InputComponent {...props} formItemProps={{ ...formItemProps, ...{ wrapperCol: { span: 24 } }, ...field }} />
                                        </Card>
                                    )
                                })}

                                <Form.Item>
                                    <Button
                                        type="dashed"
                                        onClick={() => {
                                            add()
                                        }}
                                    >
                                        <PlusOutlined /> Add {capitalCase(fieldInfo.referenceNamespace?.type!)}
                                    </Button>
                                </Form.Item>
                            </>
                        )
                    }}
                </Form.List>
            </Form.Item>
        )
    }
}
