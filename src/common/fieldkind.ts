// IFieldKind describes what category a field falls under e.g. Number, Date, Money, Foreign Object etc.
export interface IFieldKind {
    readonly name: string
}

const DefaultFieldKind = {
    name: 'default',
}

export const StringKind: IFieldKind = {
    ...DefaultFieldKind,
    name: 'string',
}

export const NumberKind: IFieldKind = {
    ...DefaultFieldKind,
    name: 'number',
}

export const BoolKind: IFieldKind = {
    ...DefaultFieldKind,
    name: 'boolean',
}

export const DateKind: IFieldKind = {
    ...DefaultFieldKind,
    name: 'date',
}

export const TimestampKind: IFieldKind = {
    ...DefaultFieldKind,
    name: 'timestamp',
}

export const IDKind: IFieldKind = {
    ...StringKind,
    name: 'id',
}

export const EmailKind: IFieldKind = {
    ...StringKind,
    name: 'email',
}

export const SecretDecryptableKind: IFieldKind = {
    ...StringKind,
    name: 'secret_decryptable',
}

export const GenericDataKind: IFieldKind = {
    ...StringKind,
    name: 'generic data',
}

export const EnumKind: IFieldKind = {
    ...DefaultFieldKind,
    name: 'enum',
}

// NestedKind refers to fields that represent sub-types or sub-objects. Basically types that are made of other fields.
export const NestedKind: IFieldKind = {
    ...DefaultFieldKind,
    name: 'nested',
}

// ForeignEntityKind refers to fields that reference another entity
export const ForeignEntityKind: IFieldKind = {
    ...DefaultFieldKind,
    name: 'foreign_entity',
}

// ForeignEntityKind refers to fields that reference another entity
export const FileKind: IFieldKind = {
    ...ForeignEntityKind,
    name: 'file',
}

export const ConditionKind: IFieldKind = {
    ...DefaultFieldKind,
    name: 'condition',
}
