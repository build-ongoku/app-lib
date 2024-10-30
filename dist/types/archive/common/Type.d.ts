import { FieldInfo, MetaFields } from '@ongoku/app-lib/src/common/Field';
import { EnumInfo } from '@ongoku/app-lib/src/archive/common/Enum';
import { WithMetaFields } from '../../common/types';
export interface ITypeInfo extends ITypeInfoOverridable {
    name: string;
    fieldInfos: FieldInfo[];
}
export interface ITypeInfoOverridable {
    getTypeName: () => string;
}
export interface NewTypeInfoReq<T extends TypeMinimal> {
    name: string;
    serviceName: string;
    fieldInfos: FieldInfo[];
    enumInfos?: EnumInfo<any>[];
    getEmptyInstance: () => WithMetaFields<T>;
}
export interface TypeMinimal extends Object {
}
export interface TypeMinimalWithMeta extends TypeMinimal, MetaFields {
}
export declare class TypeInfo<T extends TypeMinimal> implements ITypeInfo {
    name: string;
    fieldInfos: FieldInfo[];
    serviceName: string;
    enumInfos: Record<string, EnumInfo<any>>;
    getEmptyInstance: () => WithMetaFields<T>;
    constructor(props: NewTypeInfoReq<T>);
    getTypeName(): string;
    getTypeNameFunc: (info: TypeInfo<T>) => string;
    getFieldInfo(fieldName: keyof T): FieldInfo;
}
