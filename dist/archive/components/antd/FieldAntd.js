var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { AppInfoContext } from '@ongoku/app-lib/src/archive/common/AppContext';
import { BooleanInput, DateInput, DefaultInput, ForeignEntitySelectInput, getInputComponentWithRepetition, NumberInput, SelectInput, StringInput, TimestampInput, TypeFormItems, } from '@ongoku/app-lib/src/components/antd/FormAntd';
import { BooleanDisplay, DateDisplay, DefaultDisplay, PersonNameDisplay, PhoneNumberDisplay, StringDisplay, TimestampDisplay, TypeDisplay, } from '@ongoku/app-lib/src/components/DisplayAttributes/DisplayAttributes';
import { EntityLinkFromID } from '@ongoku/app-lib/src/components/EntityLink';
import { Card, Form, Select, Spin } from 'antd';
import { capitalCase } from 'change-case';
import { useContext } from 'react';
export var getFieldForFieldKind = function (fieldKind) {
    switch (fieldKind.name) {
        case 'uuid':
            return UUIDField;
        case 'string':
            return StringField;
        case 'number':
            return NumberField;
        case 'boolean':
            return BooleanField;
        case 'date':
            return DateField;
        case 'datetime':
            return TimestampField;
        case 'enum':
            return EnumField;
        case 'nested':
            return NestedField;
        default:
            return DefaultField;
    }
};
export var DefaultField = {
    name: 'default',
    getLabel: function (fieldInfo) {
        // How to display list?
        return React.createElement(React.Fragment, null, capitalCase(fieldInfo.name));
    },
    getLabelString: function (fieldInfo) {
        // How to display list?
        return capitalCase(fieldInfo.name);
    },
    getDisplayComponent: function (fieldInfo) {
        return function (props) {
            return React.createElement(DefaultDisplay, { value: props.value });
        };
    },
    getDisplayRepeatedComponent: function (fieldInfo) {
        var DisplayComponent = this.getDisplayComponent(fieldInfo);
        return function (props) {
            var _a;
            return (React.createElement(React.Fragment, null, (_a = props.value) === null || _a === void 0 ? void 0 : _a.map(function (v, index) { return (React.createElement(Card, { key: index, title: '# ' + index, bordered: false },
                React.createElement(DisplayComponent, { value: v }))); })));
        };
    },
    getInputComponent: function () {
        console.log('default.getInputComponent(): getting single InputComponent for ', this.name);
        return function (props) {
            var fieldInfo = props.fieldInfo, forwardProps = __rest(props, ["fieldInfo"]);
            return React.createElement(DefaultInput, __assign({}, forwardProps));
        };
    },
    getInputRepeatedComponent: function () {
        var InputComponent = this.getInputComponent();
        return getInputComponentWithRepetition(InputComponent);
    },
};
export var UUIDField = __assign(__assign({}, DefaultField), { name: 'uuid', getLabel: function (fieldInfo) {
        // How to display list?
        return React.createElement(React.Fragment, null, capitalCase(fieldInfo.name.replace('_id', '')));
    }, getLabelString: function (fieldInfo) {
        // How to display list?
        return capitalCase(fieldInfo.name.replace('_id', ''));
    }, getDisplayComponent: function (fieldInfo, entityInfo) {
        return function (props) {
            var value = props.value;
            // Get ServiceInfo from context
            var _a = useContext(AppInfoContext), appInfo = _a.appInfo, loading = _a.loading;
            if (!appInfo) {
                return null;
            }
            if (!appInfo) {
                return React.createElement(Spin, null);
            }
            if (!value) {
                return React.createElement("p", null, 'NA');
            }
            // This is a foreign UUID
            if (fieldInfo.foreignEntityInfo) {
                var fieldEntityInfo = appInfo === null || appInfo === void 0 ? void 0 : appInfo.getEntityInfoByNamespace({ service: fieldInfo.foreignEntityInfo.serviceName, entity: fieldInfo.foreignEntityInfo.entityName });
                if (!fieldEntityInfo) {
                    throw new Error('External EntityInfo not found for field');
                }
                return React.createElement(EntityLinkFromID, { id: props.value, entityInfo: fieldEntityInfo });
            }
            // Maybe this is not a foreign UUID but the primary ID
            if (entityInfo) {
                return React.createElement(EntityLinkFromID, { id: value, entityInfo: entityInfo });
            }
            return React.createElement("p", null,
                " ",
                value,
                " ");
        };
    }, getInputComponent: function () {
        return function (props) {
            var fieldInfo = props.fieldInfo, forwardProps = __rest(props, ["fieldInfo"]);
            if (!fieldInfo.foreignEntityInfo) {
                return React.createElement(DefaultInput, __assign({}, forwardProps));
            }
            return React.createElement(ForeignEntitySelectInput, __assign({}, props));
        };
    } });
export var StringField = __assign(__assign({}, DefaultField), { name: 'string', getDisplayComponent: function (fieldInfo) {
        return StringDisplay;
    }, getInputComponent: function () {
        return function (props) {
            var _ = props.fieldInfo, forwardProps = __rest(props, ["fieldInfo"]);
            return React.createElement(StringInput, __assign({}, forwardProps));
        };
    } });
export var NumberField = __assign(__assign({}, DefaultField), { name: 'number', getInputComponent: function () {
        return function (props) {
            var _ = props.fieldInfo, forwardProps = __rest(props, ["fieldInfo"]);
            return React.createElement(NumberInput, __assign({}, forwardProps));
        };
    } });
export var BooleanField = __assign(__assign({}, DefaultField), { name: 'boolean', getDisplayComponent: function (fieldInfo) {
        return BooleanDisplay;
    }, getInputComponent: function () {
        return function (props) {
            var _ = props.fieldInfo, forwardProps = __rest(props, ["fieldInfo"]);
            return React.createElement(BooleanInput, __assign({}, forwardProps));
        };
    } });
export var DateField = __assign(__assign({}, DefaultField), { name: 'date', getDisplayComponent: function (fieldInfo) {
        return DateDisplay;
    }, getInputComponent: function () {
        return function (props) {
            var _ = props.fieldInfo, forwardProps = __rest(props, ["fieldInfo"]);
            return React.createElement(DateInput, __assign({}, forwardProps));
        };
    } });
export var TimestampField = __assign(__assign({}, DefaultField), { name: 'datetime', getDisplayComponent: function (fieldInfo) {
        return TimestampDisplay;
    }, getInputComponent: function () {
        return function (props) {
            var _ = props.fieldInfo, forwardProps = __rest(props, ["fieldInfo"]);
            return React.createElement(TimestampInput, __assign({}, forwardProps));
        };
    } });
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
export var EnumField = __assign(__assign({}, DefaultField), { name: 'enum', getDisplayComponent: function (fieldInfo) {
        return function (props) {
            var _a;
            var _b = useContext(AppInfoContext), appInfo = _b.appInfo, loading = _b.loading;
            var enumInfo = appInfo === null || appInfo === void 0 ? void 0 : appInfo.getEnumInfoByNamespace(fieldInfo === null || fieldInfo === void 0 ? void 0 : fieldInfo.referenceNamespace);
            return React.createElement(DefaultDisplay, { value: (_a = enumInfo === null || enumInfo === void 0 ? void 0 : enumInfo.getEnumValueInfo(props.value)) === null || _a === void 0 ? void 0 : _a.getDisplayValue() });
        };
    }, getInputComponent: function () {
        return function (props) {
            var fieldInfo = props.fieldInfo, formItemProps = __rest(props, ["fieldInfo"]);
            var appInfo = useContext(AppInfoContext).appInfo;
            var enumInfo = appInfo === null || appInfo === void 0 ? void 0 : appInfo.getEnumInfoByNamespace(fieldInfo === null || fieldInfo === void 0 ? void 0 : fieldInfo.referenceNamespace);
            var options = enumInfo === null || enumInfo === void 0 ? void 0 : enumInfo.valuesInfo.map(function (valueInfo) {
                return (React.createElement(Select.Option, { key: valueInfo.id, value: valueInfo.value }, valueInfo.getDisplayValue()));
            });
            return React.createElement(SelectInput, __assign({}, formItemProps), options);
        };
    } });
// NestedKind refers to fields that represent sub-types or sub-objects. Basically types that are made of other fields.
export var NestedField = __assign(__assign({}, DefaultField), { name: 'nested', getDisplayComponent: function (fieldInfo) {
        return function (props) {
            var value = props.value;
            var appInfo = useContext(AppInfoContext).appInfo;
            if (!appInfo) {
                return React.createElement(Spin, null);
            }
            if (!value) {
                return React.createElement("span", null, "No Data");
            }
            if (!fieldInfo.referenceNamespace) {
                throw new Error('Nested Type Display called with a non-nested Field');
            }
            var nestedTypeInfo = appInfo.getTypeInfoByNamespace(fieldInfo.referenceNamespace);
            if (nestedTypeInfo.name === 'person_name') {
                return React.createElement(PersonNameDisplay, { value: value });
            }
            if (nestedTypeInfo.name === 'phone_number') {
                return React.createElement(PhoneNumberDisplay, { value: value });
            }
            return React.createElement(TypeDisplay, { typeInfo: nestedTypeInfo, objectValue: value });
        };
    }, getInputComponent: function () {
        return NestedInput;
    } });
export var NestedInput = function (props) {
    console.log('NestedInput: called with props', props);
    var fieldInfo = props.fieldInfo, formItemProps = props.formItemProps;
    console.log('nested.getInputComponent(): getting single InputComponent for fieldInfo', fieldInfo.name);
    // Get ServiceInfo from context
    var appInfo = useContext(AppInfoContext).appInfo;
    if (!appInfo) {
        return React.createElement(Spin, null);
    }
    if (!fieldInfo.referenceNamespace) {
        throw new Error('Nested field does not have a reference');
    }
    console.log('nested.getInputComponent(): finding TypeInfo for referenceNamespace', fieldInfo.referenceNamespace);
    var fieldTypeInfo = appInfo === null || appInfo === void 0 ? void 0 : appInfo.getTypeInfoByNamespace(fieldInfo.referenceNamespace);
    if (!fieldTypeInfo) {
        throw new Error('Type Info not found for field');
    }
    console.log('nested.getInputComponent(): making a clone of:', formItemProps);
    var label = formItemProps === null || formItemProps === void 0 ? void 0 : formItemProps.label;
    formItemProps === null || formItemProps === void 0 ? true : delete formItemProps.label;
    var copyFormItemProps = structuredClone(formItemProps);
    console.log('nested.getInputComponent(): made a clone of the formItemProps');
    var name = (formItemProps === null || formItemProps === void 0 ? void 0 : formItemProps.name) == undefined ? fieldInfo.name : formItemProps === null || formItemProps === void 0 ? void 0 : formItemProps.name;
    // Delete name from formItem props since this Form.Item is just a wrapper around other Form.Items, and AntD doesn't like this
    copyFormItemProps === null || copyFormItemProps === void 0 ? true : delete copyFormItemProps.name;
    console.log('nested.getInputComponent(): calling TypeFormItems for typeInfo', fieldTypeInfo);
    return (React.createElement(Form.Item, __assign({ label: label }, copyFormItemProps),
        React.createElement(Card, { bordered: false },
            React.createElement(TypeFormItems, { typeInfo: fieldTypeInfo, parentItemName: name, formItemProps: __assign(__assign({}, copyFormItemProps), { wrapperCol: { span: 24 } }), noLabels: true, usePlaceholders: true }))));
};
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
