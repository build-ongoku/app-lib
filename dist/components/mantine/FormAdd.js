import { __assign, __awaiter, __generator } from '../../_virtual/_tslib.js';
import { Operator } from '../../common/Filter.js';
import { AppContext } from '../../common/AppContextV3.js';
import { ForeignEntityKind, EnumKind, ConditionKind, FileKind, NestedKind, EmailKind, IDKind, TimestampKind, DateKind, BoolKind, NumberKind, StringKind } from '../../common/fieldkind.js';
import { queryByTextV2, uploadFile } from '../../providers/provider.js';
import React__default, { useContext, useState, useEffect } from 'react';
import { Fieldset } from '../../node_modules/@mantine/core/esm/components/Fieldset/Fieldset.js';
import { TextInput } from '../../node_modules/@mantine/core/esm/components/TextInput/TextInput.js';
import { NumberInput as NumberInput$1 } from '../../node_modules/@mantine/core/esm/components/NumberInput/NumberInput.js';
import { Switch } from '../../node_modules/@mantine/core/esm/components/Switch/Switch.js';
import { DateInput as DateInput$1 } from '../../node_modules/@mantine/dates/esm/components/DateInput/DateInput.js';
import { DateTimePicker } from '../../node_modules/@mantine/dates/esm/components/DateTimePicker/DateTimePicker.js';
import { MultiSelect } from '../../node_modules/@mantine/core/esm/components/MultiSelect/MultiSelect.js';
import { Select } from '../../node_modules/@mantine/core/esm/components/Select/Select.js';
import { JsonInput } from '../../node_modules/@mantine/core/esm/components/JsonInput/JsonInput.js';
import { FileInput as FileInput$1 } from '../../node_modules/@mantine/core/esm/components/FileInput/FileInput.js';

var TypeAddForm = function (props) {
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
        return React__default.createElement(GenericInput, { key: identifier, identifier: identifier, label: label, field: f, form: form, initialData: value });
    });
    return React__default.createElement(React__default.Fragment, null, inputElements);
};
var GenericInput = function (props) {
    var field = props.field, identifier = props.identifier, label = props.label;
    var appInfo = useContext(AppContext).appInfo;
    if (!appInfo) {
        throw new Error('AppInfo not available');
    }
    // We can't process repeated fields yet, except for "select" where we can simply allow multiple selections.
    if (field.isRepeated && field.dtype.kind !== ForeignEntityKind && field.dtype.kind !== EnumKind) {
        return React__default.createElement(DefaultInput, { label: label, placeholder: "{}", identifier: identifier, form: props.form });
    }
    var defaultPlaceholder = '';
    switch (field.dtype.kind) {
        case StringKind:
            return React__default.createElement(StringInput, { label: label, placeholder: defaultPlaceholder, identifier: identifier, form: props.form });
        case NumberKind:
            return React__default.createElement(NumberInput, { label: label, placeholder: defaultPlaceholder, identifier: identifier, form: props.form });
        case BoolKind:
            return React__default.createElement(BooleanInput, { label: label, placeholder: defaultPlaceholder, identifier: identifier, form: props.form });
        case DateKind:
            return React__default.createElement(DateInput, { label: label, placeholder: defaultPlaceholder, identifier: identifier, form: props.form });
        case TimestampKind:
            return React__default.createElement(TimestampInput, { label: label, placeholder: defaultPlaceholder, identifier: identifier, form: props.form });
        case IDKind:
            return React__default.createElement(StringInput, { label: label, placeholder: defaultPlaceholder, identifier: identifier, form: props.form });
        case ForeignEntityKind:
            var ns = field.dtype.namespace;
            if (!ns) {
                throw new Error("Foreign Entity field [".concat(field.name, "] does not have a reference namespace"));
            }
            return (React__default.createElement(ForeignEntityInput, { foreignEntityNs: ns.toRaw(), label: label, placeholder: "Select ".concat(ns.entity ? ns.entity.toCapital() : ''), identifier: identifier, form: props.form, multiple: field.isRepeated }));
        case EmailKind:
            return React__default.createElement(EmailInput, { label: label, placeholder: defaultPlaceholder, identifier: identifier, form: props.form });
        case EnumKind: {
            // Get enum values for the field
            var ns_1 = field.dtype.namespace;
            if (!ns_1) {
                throw new Error('Enum field does not have a reference namespace');
            }
            var enumInfo = appInfo.getEnum(ns_1.raw);
            var options = enumInfo === null || enumInfo === void 0 ? void 0 : enumInfo.values.map(function (enumVal) {
                return { value: enumVal.value, label: enumVal.getDisplayValue() };
            });
            return React__default.createElement(SelectInput, { label: label, placeholder: defaultPlaceholder, identifier: identifier, form: props.form, internalProps: { data: options } });
        }
        case NestedKind: {
            // Get the type info for the nested field
            var ns_2 = field.dtype.namespace;
            if (!ns_2) {
                throw new Error('Nested field does not have a reference namespace');
            }
            var fieldTypeInfo = appInfo.getTypeInfo(ns_2.toRaw());
            if (!fieldTypeInfo) {
                throw new Error('Type Info not found for field');
            }
            return (React__default.createElement(Fieldset, { legend: label },
                React__default.createElement(TypeAddForm, { parentIdentifier: identifier, typeInfo: fieldTypeInfo, form: props.form })));
        }
        case FileKind:
            return React__default.createElement(FileInput, { identifier: identifier, form: props.form, label: label, placeholder: defaultPlaceholder });
        case ConditionKind:
            return React__default.createElement(DefaultConditionInput, { identifier: identifier, form: props.form, label: label, placeholder: defaultPlaceholder });
        default:
            console.warn('Field type not found. Using default input', field.dtype.kind);
            return React__default.createElement(DefaultInput, { label: label, placeholder: "{}", identifier: identifier, form: props.form });
    }
};
var DefaultInput = function (props) {
    return React__default.createElement(JSONInput, __assign({}, props));
};
var StringInput = function (props) {
    var form = props.form;
    return React__default.createElement(TextInput, __assign({ label: props.label, description: props.description, placeholder: props.placeholder, key: props.identifier }, form.getInputProps(props.identifier)));
};
var NumberInput = function (props) {
    var form = props.form;
    return React__default.createElement(NumberInput$1, __assign({ label: props.label, description: props.description, placeholder: props.placeholder, key: props.identifier }, form.getInputProps(props.identifier)));
};
var BooleanInput = function (props) {
    var form = props.form;
    return React__default.createElement(Switch, __assign({ label: props.label, description: props.description, placeholder: props.placeholder, key: props.identifier }, form.getInputProps(props.identifier)));
};
var DateInput = function (props) {
    var form = props.form;
    return (React__default.createElement(DateInput$1, __assign({ valueFormat: "DD/MM/YYYY HH:mm:ss", label: props.label, description: props.description, key: props.identifier, placeholder: props.placeholder }, form.getInputProps(props.identifier))));
};
var TimestampInput = function (props) {
    var form = props.form;
    return React__default.createElement(DateTimePicker, __assign({ label: props.label, description: props.description, placeholder: props.placeholder, key: props.identifier }, form.getInputProps(props.identifier)));
};
var EmailInput = function (props) {
    var form = props.form;
    return React__default.createElement(TextInput, __assign({ label: props.label, description: props.description, placeholder: props.placeholder, key: props.identifier }, form.getInputProps(props.identifier), { leftSection: "@" }));
};
var SelectInput = function (props) {
    var _a;
    var form = props.form;
    var Component = ((_a = props.internalProps) === null || _a === void 0 ? void 0 : _a.multiple) ? MultiSelect : Select;
    return (React__default.createElement(Component, __assign({ label: props.label, description: props.description, placeholder: props.placeholder, key: props.identifier, data: props.internalProps.data, searchable: true, clearable: true }, form.getInputProps(props.identifier))));
};
var JSONInput = function (props) {
    var form = props.form;
    return (React__default.createElement(JsonInput, __assign({ label: props.label, placeholder: props.placeholder, validationError: "The JSON you have provided looks invalid. Try using an online JSON validator?", formatOnBlur: true, autosize: true, key: props.identifier }, form.getInputProps(props.identifier))));
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
    return React__default.createElement(SelectInput, __assign({}, props, { internalProps: internalProps }));
};
var FileInput = function (props) {
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
            uploadFile(val)
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
    return (React__default.createElement(FileInput$1, __assign({}, form.getInputProps(props.identifier), { value: file, onChange: onChange, label: label, placeholder: props.placeholder, description: props.description, key: props.identifier })));
};
// Todo: Consider implementing conditions as Goku types, which would allow us to use the TypeAddForm for conditions as well.
var DefaultConditionInput = function (props) {
    props.form;
    // Loop over the operators and create a ComboboxData object
    var operators = Object.keys(Operator).map(function (op) {
        return { value: op, label: op };
    });
    return (React__default.createElement(Fieldset, { legend: props.label },
        React__default.createElement(SelectInput, { label: 'Operator', placeholder: 'Operator', identifier: props.identifier + '.' + 'operator', form: props.form, internalProps: { data: operators } }),
        React__default.createElement(JSONInput, { label: 'Values', placeholder: '{}', identifier: props.identifier + '.' + 'values', form: props.form })));
};

export { BooleanInput, DateInput, DefaultInput, EmailInput, FileInput, JSONInput, NumberInput, SelectInput, StringInput, TimestampInput, TypeAddForm };
