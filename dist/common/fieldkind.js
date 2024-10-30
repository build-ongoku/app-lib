import { __assign } from '../_virtual/_tslib.js';

var DefaultFieldKind = {
    name: 'default',
};
var StringKind = __assign(__assign({}, DefaultFieldKind), { name: 'string' });
var NumberKind = __assign(__assign({}, DefaultFieldKind), { name: 'number' });
var BoolKind = __assign(__assign({}, DefaultFieldKind), { name: 'boolean' });
var DateKind = __assign(__assign({}, DefaultFieldKind), { name: 'date' });
var TimestampKind = __assign(__assign({}, DefaultFieldKind), { name: 'timestamp' });
var IDKind = __assign(__assign({}, StringKind), { name: 'id' });
var EmailKind = __assign(__assign({}, StringKind), { name: 'email' });
var SecretDecryptableKind = __assign(__assign({}, StringKind), { name: 'secret_decryptable' });
var GenericDataKind = __assign(__assign({}, StringKind), { name: 'generic data' });
var EnumKind = __assign(__assign({}, DefaultFieldKind), { name: 'enum' });
// NestedKind refers to fields that represent sub-types or sub-objects. Basically types that are made of other fields.
var NestedKind = __assign(__assign({}, DefaultFieldKind), { name: 'nested' });
// ForeignEntityKind refers to fields that reference another entity
var ForeignEntityKind = __assign(__assign({}, DefaultFieldKind), { name: 'foreign_entity' });
// ForeignEntityKind refers to fields that reference another entity
var FileKind = __assign(__assign({}, ForeignEntityKind), { name: 'file' });
var ConditionKind = __assign(__assign({}, DefaultFieldKind), { name: 'condition' });

export { BoolKind, ConditionKind, DateKind, EmailKind, EnumKind, FileKind, ForeignEntityKind, GenericDataKind, IDKind, NestedKind, NumberKind, SecretDecryptableKind, StringKind, TimestampKind };
