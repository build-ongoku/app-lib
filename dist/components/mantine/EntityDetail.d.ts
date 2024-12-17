import { EntityInfo, IEntityMinimal } from '../../common/app_v3';
import React from 'react';
export declare const EntityDetail: <E extends IEntityMinimal = IEntityMinimal>(props: {
    entityInfo: EntityInfo<E>;
    identifier: string;
}) => React.JSX.Element;
