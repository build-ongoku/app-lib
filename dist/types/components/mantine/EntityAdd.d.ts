import { EntityInfo, IEntityMinimal } from '@ongoku/app-lib/src/common/app_v3';
import { MetaFieldKeys } from '@ongoku/app-lib/src/common/types';
import React from 'react';
interface EntityAddFormProps<E extends IEntityMinimal = any> {
    entityInfo: EntityInfo<E>;
    key?: string;
    initialData?: Omit<E, MetaFieldKeys>;
}
export declare const EntityAddForm: <E extends IEntityMinimal = any>(props: EntityAddFormProps<E>) => React.JSX.Element;
export {};
