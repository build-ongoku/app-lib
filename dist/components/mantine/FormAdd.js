'use client';
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { Operator } from '../../common/Filter';
import { Fieldset, JsonInput as MantineJSONInput, FileInput as MantineFileInput, NumberInput as MantineNumberInput, MultiSelect, Select, Switch, TextInput, Group, ActionIcon, Button, Box, } from '@mantine/core';
import { DateTimePicker, DateInput as MantineDateInput } from '@mantine/dates';
import '@mantine/dates/styles.css';
import { AppContext } from '../../common/AppContextV3';
import * as fieldkind from '../../common/fieldkind';
import { listEntity, queryByTextEntity, uploadFile } from '../../providers/httpV2';
import React, { useContext, useEffect, useState } from 'react';
import { NewDateFromYYYYMMDD } from '../../common/scalars';
import { IconTrash } from '@tabler/icons-react';
import { randomId } from '@mantine/hooks';
export var TypeAddForm = function (props) {
    var form = props.form, typeInfo = props.typeInfo;
    var initialData = props.initialData;
    console.log('TypeAddForm', typeInfo);
    var appInfo = useContext(AppContext).appInfo;
    if (!appInfo) {
        throw new Error('AppInfo not available');
    }
    // if initial data is not set, use typeInfo to get empty initial data
    if (!initialData) {
        initialData = typeInfo.getEmptyObject(appInfo);
    }
    var inputElements = typeInfo.fields.map(function (f) {
        // Skip meta fields
        // but allow key field
        if (f.isMetaField && f.name.toRaw() !== 'key') {
            return;
        }
        if (f.excludeFromForm) {
            return;
        }
        var label = f.getLabel();
        // if we're dealing with a nested form, the keys should be prefixed with the parent key
        var identifier = props.parentIdentifier ? props.parentIdentifier + '.' + f.name.toFieldName() : f.name.toFieldName();
        var value = initialData ? f.getFieldValue(initialData) : undefined;
        return React.createElement(GenericFieldInput, { key: identifier, identifier: identifier, label: label, field: f, form: form, initialData: value });
    });
    return React.createElement(React.Fragment, null, inputElements);
};
var GenericFieldInput = function (props) {
    var field = props.field;
    return React.createElement(GenericDtypeInput, __assign({ dtype: field.dtype, isRepeated: field.isRepeated }, props));
};
var GenericDtypeInputRepeated = function (props) {
    var _a, _b;
    var dtype = props.dtype, label = props.label, identifier = props.identifier, initialData = props.initialData, form = props.form;
    // Initial data is an array. Enforce that.
    if (dtype.kind == fieldkind.NestedKind) {
        var value = (_b = (_a = form.getInputProps(props.identifier).defaultValue) !== null && _a !== void 0 ? _a : initialData) !== null && _b !== void 0 ? _b : [];
        var items = Object.entries(value).map(function (_a) {
            var key = _a[0], value = _a[1];
            return ({
                key: key,
                value: value,
            });
        });
        // Loop over the items and create a form for each one
        var itemsForm = items.map(function (_a, index) {
            var key = _a.key, value = _a.value;
            // identifier for individual item looks like: `parentfield.${index}.subfield`
            var subIdentifier = "".concat(identifier, ".").concat(key);
            console.log('key', key, 'value', value, 'index', index, 'sub-identifier', subIdentifier);
            return (React.createElement(Group, { key: key, mt: "xs" },
                React.createElement(GenericDtypeInput, { dtype: dtype, identifier: subIdentifier, label: label, form: form, initialData: value, isRepeated: false }),
                React.createElement(ActionIcon, { color: "red", onClick: function () {
                        console.log('Removing item', identifier, index, key);
                        form.removeListItem(identifier, index);
                    } },
                    React.createElement(IconTrash, { size: 16 }))));
        });
        return (React.createElement(Box, { maw: 500, mx: "auto" },
            itemsForm,
            React.createElement(Group, { mt: "xs" },
                React.createElement(Button, { onClick: function () {
                        form.insertListItem(identifier, { key: randomId() });
                        console.log('Inserting item', identifier);
                    } },
                    "Add ",
                    label))));
    }
    return React.createElement(JSONInput, { label: label, description: "JSON", initialValue: initialData, identifier: identifier, form: form, placeholder: "[]" });
};
export var GenericDtypeInput = function (props) {
    var dtype = props.dtype, label = props.label, identifier = props.identifier, isRepeated = props.isRepeated, initialData = props.initialData, form = props.form;
    console.log('GenericDtypeInput', props);
    var appInfo = useContext(AppContext).appInfo;
    if (!appInfo) {
        throw new Error('AppInfo not available');
    }
    var defaultPlaceholder = '';
    // We can't process repeated fields yet, except for "select" where we can simply allow multiple selections.
    if (isRepeated && dtype.kind !== fieldkind.ForeignEntityKind && dtype.kind !== fieldkind.EnumKind) {
        return React.createElement(GenericDtypeInputRepeated, __assign({}, props));
    }
    switch (dtype.kind) {
        case fieldkind.StringKind:
            return React.createElement(StringInput, { label: label, placeholder: defaultPlaceholder, identifier: identifier, initialValue: initialData, form: props.form });
        case fieldkind.NumberKind:
            return React.createElement(NumberInput, { label: label, placeholder: defaultPlaceholder, identifier: identifier, initialValue: initialData, form: props.form });
        case fieldkind.BoolKind:
            return React.createElement(BooleanInput, { label: label, placeholder: defaultPlaceholder, identifier: identifier, initialValue: initialData, form: props.form });
        case fieldkind.DateKind:
            return React.createElement(DateInput, { label: label, placeholder: defaultPlaceholder, identifier: identifier, initialValue: initialData, form: props.form });
        case fieldkind.TimestampKind:
            return React.createElement(TimestampInput, { label: label, placeholder: defaultPlaceholder, identifier: identifier, initialValue: initialData, form: props.form });
        case fieldkind.IDKind:
            return React.createElement(StringInput, { label: label, placeholder: defaultPlaceholder, identifier: identifier, initialValue: initialData, form: props.form });
        case fieldkind.ForeignEntityKind:
            var ns = dtype.namespace;
            if (!ns) {
                console.error('Foreign Entity dtype does not have a reference namespace', dtype);
                throw new Error("Foreign Entity dtype [".concat(dtype.name, "] does not have a reference namespace"));
            }
            return (React.createElement(ForeignEntityInput, { foreignEntityNs: ns.toRaw(), label: label, placeholder: "Select ".concat(ns.entity ? ns.entity.toCapital() : ''), identifier: identifier, initialValue: initialData, form: props.form, multiple: isRepeated }));
        case fieldkind.EmailKind:
            return React.createElement(EmailInput, { label: label, placeholder: defaultPlaceholder, identifier: identifier, initialValue: initialData, form: props.form });
        case fieldkind.MoneyKind:
            return React.createElement(MoneyInput, { label: label, placeholder: defaultPlaceholder, identifier: identifier, initialValue: initialData, form: props.form });
        case fieldkind.GenericDataKind:
            return React.createElement(GenericDataInput, { label: label, placeholder: defaultPlaceholder, identifier: identifier, initialValue: initialData, form: props.form });
        case fieldkind.EnumKind: {
            // Get enum values for the field
            var ns_1 = dtype.namespace;
            if (!ns_1) {
                throw new Error('Enum field does not have a reference namespace');
            }
            var enumInfo = appInfo.getEnum(ns_1.raw);
            var options = enumInfo === null || enumInfo === void 0 ? void 0 : enumInfo.values.map(function (enumVal) {
                return { value: enumVal.value, label: enumVal.getDisplayValue() };
            });
            return (React.createElement(SelectOrMultiSelectInput, { label: label, placeholder: defaultPlaceholder, identifier: identifier, initialValue: initialData, form: props.form, internalProps: { data: options } }));
        }
        case fieldkind.NestedKind: {
            // Get the type info for the nested field
            var ns_2 = dtype.namespace;
            if (!ns_2) {
                throw new Error('Nested field does not have a reference namespace');
            }
            var fieldTypeInfo = appInfo.getTypeInfo(ns_2.toRaw());
            if (!fieldTypeInfo) {
                throw new Error('Type Info not found for field');
            }
            return (React.createElement(Fieldset, { legend: label },
                React.createElement(TypeAddForm, { parentIdentifier: identifier, typeInfo: fieldTypeInfo, initialData: initialData, form: props.form })));
        }
        case fieldkind.FileKind:
            return React.createElement(FileInput, { identifier: identifier, form: props.form, label: label, placeholder: defaultPlaceholder });
        case fieldkind.ConditionKind:
            return React.createElement(DefaultConditionInput, { identifier: identifier, form: props.form, label: label, placeholder: defaultPlaceholder });
        default:
            console.warn('Field type not found. Using default input', dtype.kind);
            return React.createElement(JSONInput, { label: label, placeholder: defaultPlaceholder, identifier: identifier, initialValue: initialData, form: props.form });
    }
};
export var DefaultInput = function (props) {
    return React.createElement(JSONInput, __assign({}, props));
};
export var StringInput = function (props) {
    var _a;
    var form = props.form;
    // Get the form input props so we can change the "null" default value to "undefined"
    var formInputProps = form.getInputProps(props.identifier);
    formInputProps.defaultValue = (_a = formInputProps.defaultValue) !== null && _a !== void 0 ? _a : undefined;
    return React.createElement(TextInput, __assign({ key: props.identifier, label: props.label, description: props.description, placeholder: props.placeholder }, formInputProps, props.internalProps, { "data-1p-ignore": true }));
};
export var NumberInput = function (props) {
    var _a;
    var form = props.form;
    // Get the form input props so we can change the "null" default value to "undefined"
    var formInputProps = form.getInputProps(props.identifier);
    formInputProps.defaultValue = (_a = formInputProps.defaultValue) !== null && _a !== void 0 ? _a : undefined;
    return React.createElement(MantineNumberInput, __assign({ key: props.identifier, label: props.label, description: props.description, placeholder: props.placeholder }, formInputProps, props.internalProps, { "data-1p-ignore": true }));
};
export var BooleanInput = function (props) {
    var _a;
    var form = props.form;
    // Get the form input props so we can change the "null" default value to "undefined"
    var formInputProps = form.getInputProps(props.identifier);
    formInputProps.defaultValue = (_a = formInputProps.defaultValue) !== null && _a !== void 0 ? _a : undefined;
    return (React.createElement(Switch, __assign({ key: props.identifier, label: props.label, description: props.description, placeholder: props.placeholder }, formInputProps, props.internalProps, { defaultChecked: props.initialValue, "data-onepassword-title": "disabled" })));
};
export var DateInput = function (props) {
    var form = props.form;
    // Get the form input props so we can change the "null" default value to "undefined"
    var formInputProps = form.getInputProps(props.identifier);
    formInputProps.defaultValue = formInputProps.defaultValue ? NewDateFromYYYYMMDD(formInputProps.defaultValue) : undefined;
    console.log('DateInput', props);
    return (React.createElement(MantineDateInput, __assign({ key: props.identifier, valueFormat: "DD/MM/YYYY", label: props.label, description: props.description, placeholder: props.placeholder, clearable: true, defaultDate: props.initialValue ? NewDateFromYYYYMMDD(props.initialValue) : undefined }, formInputProps, props.internalProps)));
};
export var TimestampInput = function (props) {
    var _a;
    var form = props.form;
    // Get the form input props so we can change the "null" default value to "undefined"
    var formInputProps = form.getInputProps(props.identifier);
    formInputProps.defaultValue = (_a = formInputProps.defaultValue) !== null && _a !== void 0 ? _a : undefined;
    return React.createElement(DateTimePicker, __assign({ key: props.identifier, label: props.label, description: props.description, placeholder: props.placeholder }, formInputProps, props.internalProps, { "data-1p-ignore": true }));
};
export var EmailInput = function (props) {
    var _a;
    var form = props.form;
    // Get the form input props so we can change the "null" default value to "undefined"
    var formInputProps = form.getInputProps(props.identifier);
    formInputProps.defaultValue = (_a = formInputProps.defaultValue) !== null && _a !== void 0 ? _a : undefined;
    return (React.createElement(TextInput, __assign({ key: props.identifier, label: props.label, description: props.description, placeholder: props.placeholder }, formInputProps, props.internalProps, { leftSection: "@", "data-1p-ignore": true })));
};
export var SelectOrMultiSelectInput = function (props) {
    var _a, _b;
    var form = props.form;
    console.log('SelectOrMultiSelectInput', props);
    // Make common props from the props.internalProps.
    var commonPropValues = {
        label: props.label,
        description: props.description,
        placeholder: props.placeholder,
        searchable: true,
        clearable: true,
        'data-1p-ignore': true,
    };
    if (props.initialValue) {
        commonPropValues.placeholder = 'Selected: ' + props.initialValue;
    }
    // Get the form input props so we can change the "null" default value to "undefined"
    var formInputProps = form.getInputProps(props.identifier);
    formInputProps.defaultValue = (_a = formInputProps.defaultValue) !== null && _a !== void 0 ? _a : undefined;
    if ((_b = props.internalProps) === null || _b === void 0 ? void 0 : _b.multiple) {
        return React.createElement(MultiSelect, __assign({ key: props.identifier }, formInputProps, commonPropValues, props.internalProps));
    }
    return React.createElement(Select, __assign({ key: props.identifier }, form.getInputProps(props.identifier), commonPropValues, props.internalProps));
};
export var MoneyInput = function (props) {
    return React.createElement(NumberInput, __assign({ internalProps: { prefix: '$', allowNegative: false, decimalScale: 2, fixedDecimalScale: true, thousandSeparator: ',' } }, props));
};
export var GenericDataInput = function (props) {
    var form = props.form;
    var formProps = form.getInputProps(props.identifier);
    var newOnChange = function (e) {
        console.log('Generic Data Change', e);
        // deserialize the JSON string
        try {
            e = JSON.parse(e);
            console.log('Deserialized', e);
        }
        catch (error) { }
        formProps.onChange(e);
    };
    return (React.createElement(MantineJSONInput, __assign({ key: props.identifier, label: props.label, placeholder: props.placeholder, validationError: "The JSON you have provided looks invalid. Try using an online JSON validator?", formatOnBlur: true, autosize: true }, formProps, { onChange: newOnChange, "data-1p-ignore": true })));
};
export var JSONInput = function (props) {
    var _a, _b;
    console.log('JSONInput', props);
    var form = props.form;
    // Get the form input props so we can change the "null" default value to "undefined"
    var formInputProps = form.getInputProps(props.identifier);
    formInputProps.defaultValue = (_a = formInputProps.defaultValue) !== null && _a !== void 0 ? _a : undefined;
    // if the initial value is an empty array, set the default value to undefined
    if (Array.isArray(props.initialValue) && props.initialValue.length === 0) {
        formInputProps.defaultValue = undefined;
    }
    // if the initial value is an empty object, set the default value to undefined
    if (typeof props.initialValue === 'object' && Object.keys((_b = props.initialValue) !== null && _b !== void 0 ? _b : {}).length === 0) {
        formInputProps.defaultValue = undefined;
    }
    // MantineJSONInput expects a quoted value, so we need to quote the initial value
    if (props.initialValue) {
        formInputProps.defaultValue = JSON.stringify(props.initialValue);
    }
    // Create a custom onChange handler to parse the JSON string into an object
    var newOnChange = function (e) {
        console.log('JSON Input Change', e);
        // deserialize the JSON string
        try {
            e = JSON.parse(e);
            console.log('Deserialized JSON', e);
        }
        catch (error) {
            console.error('Failed to parse JSON', error);
        }
        formInputProps.onChange(e);
    };
    console.log('JSONInput formInputProps', formInputProps);
    return (React.createElement(MantineJSONInput, __assign({ key: props.identifier, label: props.label, description: props.description, placeholder: props.placeholder, validationError: React.createElement(React.Fragment, null,
            'The JSON you have provided looks invalid. Try using an ',
            ' ',
            React.createElement("a", { href: "https://jsonlint.com", target: "_blank", rel: "noopener noreferrer" }, "online JSON validator.")), formatOnBlur: true, autosize: true }, formInputProps, { onChange: newOnChange }, props.internalProps, { "data-1p-ignore": true })));
};
var ForeignEntityInput = function (props) {
    var _a = useState(undefined), options = _a[0], setOptions = _a[1];
    var _b = useState(''), searchTerm = _b[0], setSearchTerm = _b[1];
    // Get the entity info
    var appInfo = useContext(AppContext).appInfo;
    if (!appInfo) {
        throw new Error('AppInfo not available');
    }
    var entityInfo = appInfo.getEntityInfo(props.foreignEntityNs);
    if (!entityInfo) {
        throw new Error("Entity Info not found for request ".concat(JSON.stringify(props.foreignEntityNs)));
    }
    useEffect(function () {
        // Only search if there is a search term
        if (!searchTerm) {
            return;
        }
        // Search for options
        queryByTextEntity({
            entityNamespace: props.foreignEntityNs,
            data: { queryText: searchTerm },
        }).then(function (response) {
            if (response.error) {
                console.error('Error fetching data', response.error);
                return;
            }
            if (!response.data) {
                console.error('No data returned');
                return;
            }
            if (!response.data.items || response.data.items.length === 0) {
                console.error('No items returned');
                return;
            }
            var options = response.data.items.map(function (e) {
                return { value: e.id, label: entityInfo.getEntityNameFriendly(e) };
            });
            setOptions(options);
        });
    }, [searchTerm]);
    // If there is initial data, we need to fetch the entity and set the initial values
    useEffect(function () {
        // No initial data
        if (!props.initialValue || props.initialValue.length === 0) {
            return;
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
        }).then(function (response) {
            if (response.error) {
                console.error('Error fetching data', response.error);
                return;
            }
            if (!response.data) {
                console.error('No data returned');
                return;
            }
            if (!response.data.items || response.data.items.length === 0) {
                console.error('No items returned');
                return;
            }
            // Set the initially selected values
            var options = response.data.items.map(function (e) {
                return { value: e.id, label: entityInfo.getEntityNameFriendly(e) };
            });
            if (options.length > 0) {
                setOptions(options);
                console.log('[ForeignEntityInput] Setting initial values', props.initialValue);
            }
            // const ids = response.data.items.map((e) => e.id)
            // if (props.multiple) {
            //     props.form.setFieldValue(props.identifier, ids)
            //     return
            // }
            // props.form.setFieldValue(props.identifier, ids[0])
        });
    }, [props.initialValue]);
    // Overwrite the label to remove the ID or IDs suffix
    var label = props.label.replace(/(ids?)$/i, '');
    var internalProps = {
        onSearchChange: setSearchTerm,
        multiple: props.multiple,
        data: options,
    };
    return React.createElement(SelectOrMultiSelectInput, __assign({}, props, { label: label, internalProps: internalProps }));
};
export var FileInput = function (props) {
    var form = props.form;
    var _a = useState(null), file = _a[0], setFile = _a[1];
    // Todo: If initial value is set, fetch the file and set the file state
    // If the label has suffix ID, Id, id etc. then remove it
    var label = props.label.replace(/(id)$/i, '');
    var onChange = function (val) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log('File Change', val);
            setFile(val);
            if (!val) {
                return [2 /*return*/];
            }
            // Make the request to upload the file
            uploadFile(val, function (progress) {
                console.log('Progress', progress);
            })
                .then(function (response) {
                var _a, _b, _c, _d;
                console.log('File Uploaded', response);
                if (response.error) {
                    form.setFieldError(props.identifier, 'File upload failed: ' + response.error);
                }
                else if (!((_a = response.data) === null || _a === void 0 ? void 0 : _a.id)) {
                    console.log('File upload failed: No ID returned', (_b = response.data) === null || _b === void 0 ? void 0 : _b.id);
                    form.setFieldError(props.identifier, 'File upload failed: No ID returned');
                }
                else {
                    console.log('File upload: Setting field value', (_c = response.data) === null || _c === void 0 ? void 0 : _c.id);
                    form.setFieldValue(props.identifier, (_d = response.data) === null || _d === void 0 ? void 0 : _d.id);
                }
            })
                .catch(function (error) {
                console.error('File Upload Error', error);
            });
            return [2 /*return*/];
        });
    }); };
    return React.createElement(MantineFileInput, __assign({}, form.getInputProps(props.identifier), { onChange: onChange, label: label, placeholder: props.placeholder, description: props.description, key: props.identifier }));
};
// Todo: Consider implementing conditions as Goku types, which would allow us to use the TypeAddForm for conditions as well.
var DefaultConditionInput = function (props) {
    var form = props.form;
    // Loop over the operators and create a ComboboxData object
    var operators = Object.keys(Operator).map(function (op) {
        return { value: op, label: op };
    });
    return (React.createElement(Fieldset, { legend: props.label },
        React.createElement(SelectOrMultiSelectInput, { label: 'Operator', placeholder: 'Operator', identifier: props.identifier + '.' + 'operator', form: props.form, internalProps: { data: operators } }),
        React.createElement(JSONInput, { label: 'Values', placeholder: '{}', identifier: props.identifier + '.' + 'values', form: props.form })));
};
