import { EntityInfo, IEntityMinimal } from '../../common/app_v3';
import React from 'react';
interface EntityEditFormProps<E extends IEntityMinimal = any> {
    entityInfo: EntityInfo<E>;
    objectId: string;
    key?: string;
}
export declare const EntityEditForm: <E extends IEntityMinimal = any>(props: EntityEditFormProps<E>) => React.JSX.Element;
export {};
