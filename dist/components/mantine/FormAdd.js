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
import { Fieldset, JsonInput, FileInput as MantineFileInput, NumberInput as MantineNumberInput, MultiSelect, Select, Switch, TextInput, } from '@mantine/core';
import { DateTimePicker, DateInput as MantineDateInput } from '@mantine/dates';
import { AppContext } from '../../common/AppContextV3';
import * as fieldkind from '../../common/fieldkind';
import { queryByTextV2, uploadFile } from '../../providers/provider';
import React, { useContext, useEffect, useState } from 'react';
export var TypeAddForm = function (props) {
    var form = props.form, typeInfo = props.typeInfo;
    console.log('TypeAddForm', typeInfo);
    var inputElements = typeInfo.fields.map(function (f) {
        // Skip meta fields
        if (f.isMetaField) {
            return;
        }
        if (f.excludeFromForm) {
            return;
        }
        var label = f.getLabel();
        // if we're dealing with a nested form, the keys should be prefixed with the parent key
        var identifier = props.parentIdentifier ? props.parentIdentifier + '.' + f.name.toFieldName() : f.name.toFieldName();
        var value = props.initialData ? f.getFieldValue(props.initialData) : undefined;
        return React.createElement(GenericInput, { key: identifier, identifier: identifier, label: label, field: f, form: form, initialData: value });
    });
    return React.createElement(React.Fragment, null, inputElements);
};
var GenericInput = function (props) {
    var field = props.field, identifier = props.identifier, label = props.label;
    var appInfo = useContext(AppContext).appInfo;
    if (!appInfo) {
        throw new Error('AppInfo not available');
    }
    // We can't process repeated fields yet, except for "select" where we can simply allow multiple selections.
    if (field.isRepeated && field.dtype.kind !== fieldkind.ForeignEntityKind && field.dtype.kind !== fieldkind.EnumKind) {
        return React.createElement(DefaultInput, { label: label, placeholder: "{}", identifier: identifier, form: props.form });
    }
    var defaultPlaceholder = '';
    switch (field.dtype.kind) {
        case fieldkind.StringKind:
            return React.createElement(StringInput, { label: label, placeholder: defaultPlaceholder, identifier: identifier, form: props.form });
        case fieldkind.NumberKind:
            return React.createElement(NumberInput, { label: label, placeholder: defaultPlaceholder, identifier: identifier, form: props.form });
        case fieldkind.BoolKind:
            return React.createElement(BooleanInput, { label: label, placeholder: defaultPlaceholder, identifier: identifier, form: props.form });
        case fieldkind.DateKind:
            return React.createElement(DateInput, { label: label, placeholder: defaultPlaceholder, identifier: identifier, form: props.form });
        case fieldkind.TimestampKind:
            return React.createElement(TimestampInput, { label: label, placeholder: defaultPlaceholder, identifier: identifier, form: props.form });
        case fieldkind.IDKind:
            return React.createElement(StringInput, { label: label, placeholder: defaultPlaceholder, identifier: identifier, form: props.form });
        case fieldkind.ForeignEntityKind:
            var ns = field.dtype.namespace;
            if (!ns) {
                throw new Error("Foreign Entity field [".concat(field.name, "] does not have a reference namespace"));
            }
            return (React.createElement(ForeignEntityInput, { foreignEntityNs: ns.toRaw(), label: label, placeholder: "Select ".concat(ns.entity ? ns.entity.toCapital() : ''), identifier: identifier, form: props.form, multiple: field.isRepeated }));
        case fieldkind.EmailKind:
            return React.createElement(EmailInput, { label: label, placeholder: defaultPlaceholder, identifier: identifier, form: props.form });
        case fieldkind.EnumKind: {
            // Get enum values for the field
            var ns_1 = field.dtype.namespace;
            if (!ns_1) {
                throw new Error('Enum field does not have a reference namespace');
            }
            var enumInfo = appInfo.getEnum(ns_1.raw);
            var options = enumInfo === null || enumInfo === void 0 ? void 0 : enumInfo.values.map(function (enumVal) {
                return { value: enumVal.value, label: enumVal.getDisplayValue() };
            });
            return React.createElement(SelectInput, { label: label, placeholder: defaultPlaceholder, identifier: identifier, form: props.form, internalProps: { data: options } });
        }
        case fieldkind.NestedKind: {
            // Get the type info for the nested field
            var ns_2 = field.dtype.namespace;
            if (!ns_2) {
                throw new Error('Nested field does not have a reference namespace');
            }
            var fieldTypeInfo = appInfo.getTypeInfo(ns_2.toRaw());
            if (!fieldTypeInfo) {
                throw new Error('Type Info not found for field');
            }
            return (React.createElement(Fieldset, { legend: label },
                React.createElement(TypeAddForm, { parentIdentifier: identifier, typeInfo: fieldTypeInfo, form: props.form })));
        }
        case fieldkind.FileKind:
            return React.createElement(FileInput, { identifier: identifier, form: props.form, label: label, placeholder: defaultPlaceholder });
        case fieldkind.ConditionKind:
            return React.createElement(DefaultConditionInput, { identifier: identifier, form: props.form, label: label, placeholder: defaultPlaceholder });
        default:
            console.warn('Field type not found. Using default input', field.dtype.kind);
            return React.createElement(DefaultInput, { label: label, placeholder: "{}", identifier: identifier, form: props.form });
    }
};
export var DefaultInput = function (props) {
    return React.createElement(JSONInput, __assign({}, props));
};
export var StringInput = function (props) {
    var form = props.form;
    return React.createElement(TextInput, __assign({ label: props.label, description: props.description, placeholder: props.placeholder, key: props.identifier }, form.getInputProps(props.identifier)));
};
export var NumberInput = function (props) {
    var form = props.form;
    return React.createElement(MantineNumberInput, __assign({ label: props.label, description: props.description, placeholder: props.placeholder, key: props.identifier }, form.getInputProps(props.identifier)));
};
export var BooleanInput = function (props) {
    var form = props.form;
    return React.createElement(Switch, __assign({ label: props.label, description: props.description, placeholder: props.placeholder, key: props.identifier }, form.getInputProps(props.identifier)));
};
export var DateInput = function (props) {
    var form = props.form;
    return (React.createElement(MantineDateInput, __assign({ valueFormat: "DD/MM/YYYY HH:mm:ss", label: props.label, description: props.description, key: props.identifier, placeholder: props.placeholder }, form.getInputProps(props.identifier))));
};
export var TimestampInput = function (props) {
    var form = props.form;
    return React.createElement(DateTimePicker, __assign({ label: props.label, description: props.description, placeholder: props.placeholder, key: props.identifier }, form.getInputProps(props.identifier)));
};
export var EmailInput = function (props) {
    var form = props.form;
    return React.createElement(TextInput, __assign({ label: props.label, description: props.description, placeholder: props.placeholder, key: props.identifier }, form.getInputProps(props.identifier), { leftSection: "@" }));
};
export var SelectInput = function (props) {
    var _a;
    var form = props.form;
    var Component = ((_a = props.internalProps) === null || _a === void 0 ? void 0 : _a.multiple) ? MultiSelect : Select;
    return (React.createElement(Component, __assign({ label: props.label, description: props.description, placeholder: props.placeholder, key: props.identifier, data: props.internalProps.data, searchable: true, clearable: true }, form.getInputProps(props.identifier))));
};
export var JSONInput = function (props) {
    var form = props.form;
    return (React.createElement(JsonInput, __assign({ label: props.label, placeholder: props.placeholder, validationError: "The JSON you have provided looks invalid. Try using an online JSON validator?", formatOnBlur: true, autosize: true, key: props.identifier }, form.getInputProps(props.identifier))));
};
var ForeignEntityInput = function (props) {
    var _a = useState(undefined), data = _a[0], setData = _a[1];
    var _b = useState(''), searchTerm = _b[0], setSearchTerm = _b[1];
    // Get the entity info
    var appInfo = useContext(AppContext).appInfo;
    if (!appInfo) {
        throw new Error('AppInfo not available');
    }
    var entityInfo = appInfo.getEntityInfo(props.foreignEntityNs);
    if (!entityInfo) {
        throw new Error("Entity Info not found for ".concat(props.foreignEntityNs));
    }
    useEffect(function () {
        queryByTextV2({
            entityInfo: entityInfo,
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
            setData(options);
        });
    }, [searchTerm]);
    var internalProps = {
        onSearchChange: setSearchTerm,
        multiple: props.multiple,
        data: data,
    };
    return React.createElement(SelectInput, __assign({}, props, { internalProps: internalProps }));
};
export var FileInput = function (props) {
    var form = props.form;
    var _a = useState(null), file = _a[0], setFile = _a[1];
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
    return (React.createElement(MantineFileInput, __assign({}, form.getInputProps(props.identifier), { value: file, onChange: onChange, label: label, placeholder: props.placeholder, description: props.description, key: props.identifier })));
};
// Todo: Consider implementing conditions as Goku types, which would allow us to use the TypeAddForm for conditions as well.
var DefaultConditionInput = function (props) {
    var form = props.form;
    // Loop over the operators and create a ComboboxData object
    var operators = Object.keys(Operator).map(function (op) {
        return { value: op, label: op };
    });
    return (React.createElement(Fieldset, { legend: props.label },
        React.createElement(SelectInput, { label: 'Operator', placeholder: 'Operator', identifier: props.identifier + '.' + 'operator', form: props.form, internalProps: { data: operators } }),
        React.createElement(JSONInput, { label: 'Values', placeholder: '{}', identifier: props.identifier + '.' + 'values', form: props.form })));
};
