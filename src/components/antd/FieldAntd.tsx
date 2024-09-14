import { AppInfoContext } from '@ongoku/app-lib/src/common/AppContext'
import { EntityInfo } from '@ongoku/app-lib/src/common/Entity'
import { FieldInfo, FieldKind } from '@ongoku/app-lib/src/common/Field'
import { TypeMinimal } from '@ongoku/app-lib/src/common/Type'
import {
    BooleanInput,
    DateInput,
    DefaultInput,
    ForeignEntitySelectInput,
    getInputComponentWithRepetition,
    NumberInput,
    SelectInput,
    StringInput,
    TimestampInput,
    TypeFormItems,
} from '@ongoku/app-lib/src/components/antd/FormAntd'
import {
    BooleanDisplay,
    DateDisplay,
    DefaultDisplay,
    DisplayProps,
    PersonNameDisplay,
    PhoneNumberDisplay,
    StringDisplay,
    TimestampDisplay,
    TypeDisplay,
} from '@ongoku/app-lib/src/components/DisplayAttributes/DisplayAttributes'
import { EntityLinkFromID } from '@ongoku/app-lib/src/components/EntityLink'
import { FieldKindUI, FieldFormProps } from '@ongoku/app-lib/src/components/Field'
import { Card, Form, Select, Spin } from 'antd'
import { capitalCase } from 'change-case'
import { UUID } from 'crypto'
import { PersonName, PhoneNumber } from 'goku.generated/types/types.generated'
import { useContext } from 'react'

export const getFieldForFieldKind = (fieldKind: FieldKind): FieldKindUI => {
    switch (fieldKind.name) {
        case 'uuid':
            return UUIDField
        case 'string':
            return StringField
        case 'number':
            return NumberField
        case 'boolean':
            return BooleanField
        case 'date':
            return DateField
        case 'datetime':
            return TimestampField
        case 'enum':
            return EnumField
        case 'nested':
            return NestedField
        default:
            return DefaultField
    }
}

export const DefaultField = {
    name: 'default',
    getLabel: (fieldInfo: FieldInfo): JSX.Element => {
        // How to display list?
        return <>{capitalCase(fieldInfo.name)}</>
    },
    getLabelString: (fieldInfo: FieldInfo): string => {
        // How to display list?
        return capitalCase(fieldInfo.name)
    },
    getDisplayComponent(fieldInfo: FieldInfo) {
        return (props: DisplayProps<any>) => {
            return <DefaultDisplay value={props.value} />
        }
    },
    getDisplayRepeatedComponent(fieldInfo: FieldInfo) {
        const DisplayComponent = this.getDisplayComponent(fieldInfo)
        return (props: DisplayProps) => {
            return (
                <>
                    {props.value?.map((v: any, index: number) => (
                        <Card key={index} title={'# ' + index} bordered={false}>
                            <DisplayComponent value={v} />
                        </Card>
                    ))}
                </>
            )
        }
    },
    getInputComponent() {
        console.log('default.getInputComponent(): getting single InputComponent for ', this.name)
        return (props: FieldFormProps) => {
            const { fieldInfo: fieldInfo, ...forwardProps } = props
            return <DefaultInput {...forwardProps} />
        }
    },
    getInputRepeatedComponent() {
        const InputComponent = this.getInputComponent()
        return getInputComponentWithRepetition(InputComponent)
    },
}

export const UUIDField: FieldKindUI = {
    ...DefaultField,
    name: 'uuid',
    getLabel: (fieldInfo: FieldInfo): JSX.Element => {
        // How to display list?
        return <>{capitalCase(fieldInfo.name.replace('_id', ''))}</>
    },
    getLabelString: (fieldInfo: FieldInfo): string => {
        // How to display list?
        return capitalCase(fieldInfo.name.replace('_id', ''))
    },
    getDisplayComponent(fieldInfo: FieldInfo, entityInfo?: EntityInfo) {
        return (props: DisplayProps<UUID>) => {
            const { value } = props
            // Get ServiceInfo from context
            const { appInfo, loading } = useContext(AppInfoContext)
            if (!appInfo) {
                return null
            }

            if (!appInfo) {
                return <Spin />
            }

            if (!value) {
                return <p>{'NA'}</p>
            }

            // This is a foreign UUID
            if (fieldInfo.foreignEntityInfo) {
                const fieldEntityInfo = appInfo?.getEntityInfoByNamespace({ service: fieldInfo.foreignEntityInfo.serviceName!, entity: fieldInfo.foreignEntityInfo.entityName! })
                if (!fieldEntityInfo) {
                    throw new Error('External EntityInfo not found for field')
                }

                return <EntityLinkFromID id={props.value!} entityInfo={fieldEntityInfo} />
            }

            // Maybe this is not a foreign UUID but the primary ID
            if (entityInfo) {
                return <EntityLinkFromID id={value} entityInfo={entityInfo} />
            }
            return <p> {value} </p>
        }
    },
    getInputComponent() {
        return (props: FieldFormProps) => {
            const { fieldInfo, ...forwardProps } = props
            if (!fieldInfo.foreignEntityInfo) {
                return <DefaultInput {...forwardProps} />
            }
            return <ForeignEntitySelectInput {...props} />
        }
    },
}

export const StringField: FieldKindUI = {
    ...DefaultField,
    name: 'string',
    getDisplayComponent(fieldInfo: FieldInfo) {
        return StringDisplay
    },
    getInputComponent() {
        return (props: FieldFormProps) => {
            const { fieldInfo: _, ...forwardProps } = props
            return <StringInput {...forwardProps} />
        }
    },
}

export const NumberField: FieldKindUI = {
    ...DefaultField,
    name: 'number',
    getInputComponent() {
        return (props: FieldFormProps) => {
            const { fieldInfo: _, ...forwardProps } = props
            return <NumberInput {...forwardProps} />
        }
    },
}

export const BooleanField: FieldKindUI = {
    ...DefaultField,
    name: 'boolean',
    getDisplayComponent(fieldInfo: FieldInfo) {
        return BooleanDisplay
    },
    getInputComponent() {
        return (props: FieldFormProps) => {
            const { fieldInfo: _, ...forwardProps } = props
            return <BooleanInput {...forwardProps} />
        }
    },
}

export const DateField: FieldKindUI = {
    ...DefaultField,
    name: 'date',
    getDisplayComponent(fieldInfo: FieldInfo) {
        return DateDisplay
    },
    getInputComponent() {
        return (props: FieldFormProps) => {
            const { fieldInfo: _, ...forwardProps } = props
            return <DateInput {...forwardProps} />
        }
    },
}

export const TimestampField: FieldKindUI = {
    ...DefaultField,
    name: 'datetime',
    getDisplayComponent(fieldInfo: FieldInfo) {
        return TimestampDisplay
    },
    getInputComponent() {
        return (props: FieldFormProps) => {
            const { fieldInfo: _, ...forwardProps } = props
            return <TimestampInput {...forwardProps} />
        }
    },
}

// // const AddressKindLocal = {
// //     name: 'address',
// // }
// // export const AddressField: FieldKindUI = {
// //     ...DefaultField,
// //     ...AddressKindLocal,
// // }

// // const PhoneNumberKindLocal = {
// //     name: 'phone_number',
// // }
// // export const PhoneNumberField: FieldKindUI = {
// //     ...DefaultField,
// //     ...PhoneNumberKindLocal,
// // }

// const EmailKindLocal = {
//     name: 'email',
// }
// export const EmailField: FieldKindUI = {
//     ...DefaultField,
//     ...EmailKindLocal,
// }

// const MoneyKindLocal = {
//     name: 'money',
// }
// export const MoneyField: FieldKindUI = {
//     ...DefaultField,
//     ...MoneyKindLocal,
// }

export const EnumField: FieldKindUI = {
    ...DefaultField,
    name: 'enum',
    getDisplayComponent(fieldInfo: FieldInfo) {
        return (props: DisplayProps<any>) => {
            const { appInfo, loading } = useContext(AppInfoContext)
            const enumInfo = appInfo?.getEnumInfoByNamespace(fieldInfo?.referenceNamespace!)

            return <DefaultDisplay value={enumInfo?.getEnumValueInfo(props.value)?.getDisplayValue()} />
        }
    },
    getInputComponent() {
        return (props: FieldFormProps) => {
            const { fieldInfo, ...formItemProps } = props

            const { appInfo } = useContext(AppInfoContext)
            const enumInfo = appInfo?.getEnumInfoByNamespace(fieldInfo?.referenceNamespace!)

            const options = enumInfo?.valuesInfo.map((valueInfo) => {
                return (
                    <Select.Option key={valueInfo.id} value={valueInfo.value}>
                        {valueInfo.getDisplayValue()}
                    </Select.Option>
                )
            })
            return <SelectInput {...formItemProps}>{options}</SelectInput>
        }
    },
}

// NestedKind refers to fields that represent sub-types or sub-objects. Basically types that are made of other fields.
export const NestedField: FieldKindUI = {
    ...DefaultField,
    name: 'nested',
    getDisplayComponent(fieldInfo: FieldInfo) {
        return (props: DisplayProps<TypeMinimal>) => {
            const { value } = props

            const { appInfo } = useContext(AppInfoContext)
            if (!appInfo) {
                return <Spin />
            }
            if (!value) {
                return <span>No Data</span>
            }
            if (!fieldInfo.referenceNamespace) {
                throw new Error('Nested Type Display called with a non-nested Field')
            }

            const nestedTypeInfo = appInfo.getTypeInfoByNamespace(fieldInfo.referenceNamespace)

            if (nestedTypeInfo.name === 'person_name') {
                return <PersonNameDisplay value={value as unknown as PersonName} />
            }
            if (nestedTypeInfo.name === 'phone_number') {
                return <PhoneNumberDisplay value={value as unknown as PhoneNumber} />
            }

            return <TypeDisplay typeInfo={nestedTypeInfo} objectValue={value} />
        }
    },
    getInputComponent() {
        return NestedInput
    },
}

export const NestedInput = (props: FieldFormProps) => {
    console.log('NestedInput: called with props', props)
    const { fieldInfo, formItemProps } = props
    console.log('nested.getInputComponent(): getting single InputComponent for fieldInfo', fieldInfo.name)

    // Get ServiceInfo from context
    const { appInfo } = useContext(AppInfoContext)

    if (!appInfo) {
        return <Spin />
    }

    if (!fieldInfo.referenceNamespace) {
        throw new Error('Nested field does not have a reference')
    }

    console.log('nested.getInputComponent(): finding TypeInfo for referenceNamespace', fieldInfo.referenceNamespace)

    const fieldTypeInfo = appInfo?.getTypeInfoByNamespace(fieldInfo.referenceNamespace)
    if (!fieldTypeInfo) {
        throw new Error('Type Info not found for field')
    }

    console.log('nested.getInputComponent(): making a clone of:', formItemProps)
    const label = formItemProps?.label
    delete formItemProps?.label
    const copyFormItemProps = structuredClone(formItemProps)

    console.log('nested.getInputComponent(): made a clone of the formItemProps')
    const name = formItemProps?.name == undefined ? fieldInfo.name : formItemProps?.name

    // Delete name from formItem props since this Form.Item is just a wrapper around other Form.Items, and AntD doesn't like this

    delete copyFormItemProps?.name

    console.log('nested.getInputComponent(): calling TypeFormItems for typeInfo', fieldTypeInfo)

    return (
        <Form.Item label={label} {...copyFormItemProps}>
            <Card bordered={false}>
                <TypeFormItems typeInfo={fieldTypeInfo} parentItemName={name} formItemProps={{ ...copyFormItemProps, ...{ wrapperCol: { span: 24 } } }} noLabels={true} usePlaceholders={true} />
            </Card>
        </Form.Item>
    )
}

// const ForeignObjectKindLocal = {
//     name: 'foreign_object',

//     getLabel: (fieldInfo: FieldInfo) => {
//         if (fieldInfo.isRepeated) {
//             return <>{capitalCase(fieldInfo.name.replace('_ids', ''))}</>
//         }
//         return <>{capitalCase(fieldInfo.name.replace('_id', ''))}</>
//     },

//     InputItem: <T extends TypeMinimal>(props: FieldFormProps<T>) => {
//         return <ForeignEntitySelector {...props} />
//     },

//     InputItemRepeated: <T extends TypeMinimal>(props: FieldFormProps<T>) => {
//         return <ForeignEntitySelector {...props} mode={'multiple'} />
//     },
// }

// export const ForeignObjectField: FieldKindUI = {
//     ...DefaultField,
//     ...ForeignObjectKindLocal,
// }
