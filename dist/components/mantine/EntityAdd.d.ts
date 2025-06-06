import { EntityInfo, IEntityMinimal } from '../../common/app_v3';
import { MetaFieldKeys } from '../../common/types';
import React from 'react';
import { Router } from '../../common/types';
interface EntityAddFormProps<E extends IEntityMinimal = any> {
    entityInfo: EntityInfo<E>;
    key?: string;
    initialData?: Omit<E, MetaFieldKeys>;
    router: Router;
}
export declare const EntityAddForm: <E extends IEntityMinimal = any>(props: EntityAddFormProps<E>) => React.JSX.Element;
export {};
