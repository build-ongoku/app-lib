import { EntityInfo, EntityMinimal } from '@ongoku/app-lib/src/archive/common/Entity';
import { EnumInfo } from '@ongoku/app-lib/src/archive/common/Enum';
import { TypeInfo, TypeMinimal } from '@ongoku/app-lib/src/archive/common/Type';
import { IWithMethods, Method, WithMethods, WithMethodsReq } from './method';
export interface IServiceInfo extends IWithMethods {
    name: string;
    defaultIcon?: React.ElementType;
    getEntityInfo<E extends EntityMinimal>(name: string): EntityInfo<E>;
    entityInfos: EntityInfo<any>[];
    getTypeInfo<T extends TypeMinimal>(name: string): TypeInfo<T>;
    getEnumInfo<EN>(name: string): EnumInfo<EN> | undefined;
}
export interface NewServiceInfoReq {
    name: string;
    entityInfos: EntityInfo<any>[];
    typeInfos: TypeInfo<any>[];
    defaultIcon?: React.ElementType;
    withMethodsReq: WithMethodsReq;
}
export declare class ServiceInfo implements IServiceInfo {
    name: string;
    entityInfos: EntityInfo<EntityMinimal>[];
    typeInfosMap: Record<string, TypeInfo<any>>;
    enumInfos: Record<string, EnumInfo<any>>;
    defaultIcon?: React.ElementType;
    withMethods: WithMethods;
    constructor(props: NewServiceInfoReq);
    getEntityInfo<E extends EntityMinimal>(name: string): EntityInfo<E>;
    getTypeInfo<T extends TypeMinimal>(name: string): TypeInfo<T>;
    getEnumInfo<EN>(name: string): EnumInfo<EN> | undefined;
    getMethod<reqT, respT>(name: string): Method<reqT, respT>;
}
