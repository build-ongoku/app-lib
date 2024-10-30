import { ITypeInfo, NewTypeInfoReq, TypeInfo, TypeMinimal } from '@ongoku/app-lib/src/archive/common/Type';
import { EnumInfo } from '@ongoku/app-lib/src/archive/common/Enum';
import { FieldInfo } from '@ongoku/app-lib/src/common/Field';
import { ID } from '@ongoku/app-lib/src/common/scalars';
import { IWithMethods, Method, WithMethods, WithMethodsReq } from './method';
export interface EntityMinimal extends TypeMinimal {
    id: ID;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}
export interface IEntityInfo<E extends EntityMinimal> extends ITypeInfo, IWithMethods {
    serviceName: string;
    getName(): string;
    getNameFormatted(): string;
    getEntityName(e: E): string;
    getEntityHumanName(e: E): string;
    columnsFieldsForListView: (keyof E)[];
    getFieldInfo(fieldName: keyof E): FieldInfo | undefined;
}
export interface NewEntityInfoReq<E extends EntityMinimal> extends NewTypeInfoReq<E> {
    serviceName: string;
    enumInfos?: EnumInfo<any>[];
    typeInfos?: TypeInfo<any>[];
    getEmptyInstance: () => E;
    withMethodsReq: WithMethodsReq;
}
export declare class EntityInfo<E extends EntityMinimal> extends TypeInfo<E> implements IEntityInfo<E> {
    serviceName: string;
    readonly typeInfo: TypeInfo<E>;
    typeInfos: Record<string, TypeInfo<any>>;
    enumInfos: Record<string, EnumInfo<any>>;
    getEmptyInstance: () => E;
    withMethods: WithMethods;
    constructor(props: NewEntityInfoReq<E>);
    columnsFieldsForListView: (keyof E)[];
    getName(): string;
    nameFunc: (info: EntityInfo<E>) => string;
    getNameFormatted(): string;
    nameFormattedFunc: (info: EntityInfo<E>) => string;
    getEntityName(r: E): string;
    entityNameFunc: (r: E, info: EntityInfo<E>) => string;
    getEntityHumanName(r: E): string;
    entityHumanNameFunc: (r: E, info: EntityInfo<E>) => string;
    getTypeInfo<T extends TypeMinimal = E>(name: string): TypeInfo<T> | undefined;
    getEnumInfo<EN>(name: string): EnumInfo<EN> | undefined;
    getMethod<reqT, respT>(name: string): Method<reqT, respT>;
}
