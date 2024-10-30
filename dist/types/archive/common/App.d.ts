import { EntityInfo, EntityMinimal } from '@ongoku/app-lib/src/archive/common/Entity';
import { EnumInfo } from '@ongoku/app-lib/src/archive/common/Enum';
import { Namespace, PrimaryNamespace } from '@ongoku/app-lib/src/archive/common/Namespace';
import { ServiceInfo } from '@ongoku/app-lib/src/archive/common/Service';
import { TypeInfo, TypeMinimal } from '@ongoku/app-lib/src/archive/common/Type';
export interface NewAppInfoReq {
    serviceInfos: ServiceInfo[];
    typeInfos: TypeInfo<any>[];
    enumInfos: EnumInfo<any>[];
}
export declare class AppInfo {
    serviceInfosMap: Record<string, ServiceInfo>;
    typeInfosMap: Record<string, TypeInfo<any>>;
    enumInfos: Record<string, EnumInfo<any>>;
    constructor(props: NewAppInfoReq);
    getServiceInfos(): ServiceInfo[];
    getServiceInfo(name: string): ServiceInfo;
    listEntityInfos(): EntityInfo<EntityMinimal>[];
    getEntityInfo<E extends EntityMinimal>(serviceName: string, entityName: string): EntityInfo<E>;
    getEntityInfoByNamespace<E extends EntityMinimal>(ns: Required<PrimaryNamespace>): EntityInfo<E>;
    updateEntityInfo(ei: EntityInfo<any>): void;
    getTypeInfo<T extends TypeMinimal>(name: string): TypeInfo<T>;
    getTypeInfoByNamespace<T extends TypeMinimal>(ns: Namespace): TypeInfo<T>;
    getEnumInfo<EN>(name: string): EnumInfo<EN>;
    getEnumInfoByNamespace<EN>(ns: Namespace): EnumInfo<EN> | undefined;
}
