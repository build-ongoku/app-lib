import { EntityInfo, IEntityMinimal } from '@ongoku/app-lib/src/common/app_v3';
import React from 'react';
export declare const EntityDetail: <E extends IEntityMinimal = any>(props: {
    entityInfo: EntityInfo<E>;
    identifier: string;
}) => React.JSX.Element;
