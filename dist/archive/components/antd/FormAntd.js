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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { AppInfoContext } from '@ongoku/app-lib/src/archive/common/AppContext';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, DatePicker, Form, Input, InputNumber, Select, Spin, Switch } from 'antd';
import React, { useContext, useState } from 'react';
import { capitalCase } from 'change-case';
import { getFieldForFieldKind } from '@ongoku/app-lib/src/components/antd/FieldAntd';
import { useListEntityByTextQuery } from '@ongoku/app-lib/src/providers/provider';
export var combineFormItemName = function (parentName, currentName) {
    if (parentName !== undefined) {
        if (Array.isArray(parentName)) {
            return __spreadArray(__spreadArray([], parentName, true), [currentName], false);
        }
        return [parentName, currentName];
    }
    return currentName;
};
// TypeFormItems renders a form given a TypeInfo
export var TypeFormItems = function (props) {
    var typeInfo = props.typeInfo, parentItemName = props.parentItemName, formItemProps = props.formItemProps;
    var initialValue = formItemProps === null || formItemProps === void 0 ? void 0 : formItemProps.initialValue;
    var initialValueFields = Object.keys(initialValue !== null && initialValue !== void 0 ? initialValue : {});
    var initialValueValues = Object.values(initialValue !== null && initialValue !== void 0 ? initialValue : {});
    console.log('Type Form Items: ', typeInfo.name, initialValue, initialValueFields, initialValueValues);
    // Filter to remove the fields that we don't want to show in an Add form
    // Do not create form input for meta fields like ID, created_at etc.
    var filteredFieldInfos = typeInfo.fieldInfos.filter(function (fieldInfo) {
        return !fieldInfo.isMetaField;
    });
    // Create a list of all the form items by looping over all applicable fieldInfo
    var formItems = filteredFieldInfos.map(function (fieldInfo) {
        var name = combineFormItemName(parentItemName, fieldInfo.name);
        var fieldKind = fieldInfo.kind;
        var fieldComponent = getFieldForFieldKind(fieldKind);
        var label = fieldComponent.getLabel(fieldInfo);
        var labelString = fieldComponent.getLabelString(fieldInfo);
        var initialValue = initialValueValues[initialValueFields.indexOf(fieldInfo.name)];
        console.log('Rendering input form for', name, 'field index', initialValueFields.indexOf(fieldInfo.name));
        var finalFormItemProps = __assign(__assign({}, formItemProps), {
            label: props.noLabels ? undefined : label,
            name: name,
            initialValue: initialValue,
        });
        var sharedInputProps = {
            placeholder: props.usePlaceholders ? labelString : undefined,
            size: 'small',
        };
        console.log('TypeFormItems: getting InputComponent for', fieldInfo.name, 'kind', fieldKind.name);
        var InputComponent = fieldComponent.getInputComponent();
        // If a field is an array, use the isRepeated InputItem for that Field's Kind
        if (fieldInfo.isRepeated) {
            console.log('TypeFormItems: getting Repeated InputComponent for', fieldInfo.name, 'kind', fieldKind.name);
            InputComponent = fieldComponent.getInputRepeatedComponent();
        }
        return React.createElement(InputComponent, { key: fieldInfo.name, fieldInfo: fieldInfo, formItemProps: finalFormItemProps, sharedInputProps: sharedInputProps });
    });
    return React.createElement(React.Fragment, null, formItems);
};
export var DefaultInput = function (props) {
    return (React.createElement(Form.Item, __assign({}, props.formItemProps),
        React.createElement(Input, __assign({}, props.sharedInputProps, props.stringInputProps))));
};
export var StringInput = function (props) {
    return (React.createElement(Form.Item, __assign({}, props.formItemProps),
        React.createElement(Input, __assign({}, props.sharedInputProps, props.stringInputProps))));
};
export var NumberInput = function (props) {
    return (React.createElement(Form.Item, __assign({}, props.formItemProps),
        React.createElement(InputNumber, __assign({}, props.sharedInputProps, props.numberInputProps))));
};
export var BooleanInput = function (props) {
    var _a;
    return (React.createElement(Form.Item, __assign({}, props.formItemProps, { label: (_a = props.sharedInputProps) === null || _a === void 0 ? void 0 : _a.placeholder, colon: false }),
        React.createElement(Switch, __assign({}, props.switchProps))));
};
export var DateInput = function (props) {
    return (React.createElement(Form.Item, __assign({}, props.formItemProps),
        React.createElement(DatePicker, __assign({}, props.datePickerProps))));
};
export var TimestampInput = function (props) {
    return (React.createElement(Form.Item, __assign({}, props.formItemProps),
        React.createElement(DatePicker, __assign({ showTime: true }, props.sharedInputProps, props.datePickerProps, props.timePickerProps))));
};
export var SelectInput = function (props) {
    return (React.createElement(Form.Item, __assign({}, props.formItemProps),
        React.createElement(Select, null, props.children)));
};
export var ForeignEntitySelectInput = function (props) {
    var _a, _b;
    var fieldInfo = props.fieldInfo;
    var _c = useState([]), options = _c[0], setOptions = _c[1];
    var _d = useState(false), isFetching = _d[0], setIsFetching = _d[1];
    // Get ServiceInfo from context
    var appInfo = useContext(AppInfoContext).appInfo;
    if (!appInfo) {
        return React.createElement(Spin, null);
    }
    if (!fieldInfo.foreignEntityInfo) {
        throw new Error('ForeignEntitySelectInput for field with no foreignEntityInfo');
    }
    if (!fieldInfo.foreignEntityInfo.serviceName) {
        throw new Error('ForeignObjectField with no foreignEntityInfo.serviceName');
    }
    if (!fieldInfo.foreignEntityInfo.entityName) {
        throw new Error('ForeignObjectField with no foreignEntityName');
    }
    var foreignEntityInfo = appInfo.getEntityInfo(fieldInfo.foreignEntityInfo.serviceName, fieldInfo.foreignEntityInfo.entityName);
    if (!foreignEntityInfo) {
        throw new Error('ForeignObjectField with no foreignEntityInfo');
    }
    var handleSearch = function (value) {
        if (!value) {
            return;
        }
        console.log('Searching for Foreign Entity with value:', value);
        setIsFetching(true);
        var _a = useListEntityByTextQuery({
            entityInfo: foreignEntityInfo,
            params: {
                query_text: value,
            },
        })[0], loading = _a.loading, error = _a.error, data = _a.data;
        if (loading && !isFetching) {
            setIsFetching(true);
            return;
        }
        if (error) {
            console.error('Could not ListEntityByTextQuery:', error);
            return;
        }
        if (data) {
            setOptions(data.items.map(function (e) { return ({
                value: e.id,
                label: foreignEntityInfo.getHumanName(e),
            }); }));
            setIsFetching(false);
        }
    };
    var handleChange = function (value) {
        console.log('Foreign Entity - Change detected:', value);
    };
    var placeholder = (_b = (_a = props.sharedInputProps) === null || _a === void 0 ? void 0 : _a.placeholder) !== null && _b !== void 0 ? _b : 'Please type to search';
    console.log('Foreign Entity Select, options:', options);
    return (React.createElement(Form.Item, __assign({}, props.formItemProps),
        React.createElement(Select, __assign({}, props.sharedInputProps, { placeholder: placeholder, 
            // mode="multiple"
            // style={style}
            // defaultActiveFirstOption={false}
            // showArrow={false}
            showSearch: true, onSearch: handleSearch, filterOption: true, optionFilterProp: "label", optionLabelProp: "label", onChange: handleChange, allowClear: true, loading: isFetching, options: options }))));
};
export var getInputComponentWithRepetition = function (InputComponent) {
    return function (props) {
        var _a;
        var fieldInfo = props.fieldInfo, formItemProps = props.formItemProps;
        console.log('Repeated component for fieldInfo', fieldInfo, 'with InputComponent', InputComponent);
        // Show label for the list, but not for individual items
        var label = formItemProps === null || formItemProps === void 0 ? void 0 : formItemProps.label;
        if (formItemProps === null || formItemProps === void 0 ? void 0 : formItemProps.label) {
            delete formItemProps.label;
        }
        var name = (_a = formItemProps === null || formItemProps === void 0 ? void 0 : formItemProps.name) !== null && _a !== void 0 ? _a : fieldInfo.name;
        if (formItemProps === null || formItemProps === void 0 ? void 0 : formItemProps.name) {
            delete formItemProps.name;
        }
        return (React.createElement(Form.Item, __assign({}, formItemProps, { label: label }),
            React.createElement(Form.List, { name: name }, function (fields, _a) {
                var _b;
                var add = _a.add, remove = _a.remove;
                console.log('FormList: outer function. fields=', fields);
                return (React.createElement(React.Fragment, null,
                    fields.map(function (field, index) {
                        console.log('FormList: inner map. field', field, 'index', index);
                        var DeleteItem = (React.createElement(MinusCircleOutlined, { className: "dynamic-delete-button", style: { margin: '0 8px' }, onClick: function () {
                                remove(field.name);
                            } }));
                        return (React.createElement(Card, { key: field.key, size: "small", type: "inner", title: "#".concat(index + 1), extra: DeleteItem, style: { padding: 0 } },
                            React.createElement(InputComponent, __assign({}, props, { formItemProps: __assign(__assign(__assign({}, formItemProps), { wrapperCol: { span: 24 } }), field) }))));
                    }),
                    React.createElement(Form.Item, null,
                        React.createElement(Button, { type: "dashed", onClick: function () {
                                add();
                            } },
                            React.createElement(PlusOutlined, null),
                            " Add ",
                            capitalCase((_b = fieldInfo.referenceNamespace) === null || _b === void 0 ? void 0 : _b.type)))));
            })));
    };
};
