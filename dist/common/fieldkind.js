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
var DefaultFieldKind = {
    name: 'default',
};
export var StringKind = __assign(__assign({}, DefaultFieldKind), { name: 'string' });
export var NumberKind = __assign(__assign({}, DefaultFieldKind), { name: 'number' });
export var BoolKind = __assign(__assign({}, DefaultFieldKind), { name: 'boolean' });
export var DateKind = __assign(__assign({}, DefaultFieldKind), { name: 'date' });
export var TimestampKind = __assign(__assign({}, DefaultFieldKind), { name: 'timestamp' });
export var IDKind = __assign(__assign({}, StringKind), { name: 'id' });
export var EmailKind = __assign(__assign({}, StringKind), { name: 'email' });
export var SecretDecryptableKind = __assign(__assign({}, StringKind), { name: 'secret_decryptable' });
export var GenericDataKind = __assign(__assign({}, StringKind), { name: 'generic data' });
export var EnumKind = __assign(__assign({}, DefaultFieldKind), { name: 'enum' });
// NestedKind refers to fields that represent sub-types or sub-objects. Basically types that are made of other fields.
export var NestedKind = __assign(__assign({}, DefaultFieldKind), { name: 'nested' });
// ForeignEntityKind refers to fields that reference another entity
export var ForeignEntityKind = __assign(__assign({}, DefaultFieldKind), { name: 'foreign_entity' });
// ForeignEntityKind refers to fields that reference another entity
export var FileKind = __assign(__assign({}, ForeignEntityKind), { name: 'file' });
export var ConditionKind = __assign(__assign({}, DefaultFieldKind), { name: 'condition' });
