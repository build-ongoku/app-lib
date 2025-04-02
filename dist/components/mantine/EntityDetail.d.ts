import { EntityInfo, IEntityMinimal } from '../../common/app_v3';
import React from 'react';
import { Router } from '../../common/types';
export declare const EntityDetail: <E extends IEntityMinimal = IEntityMinimal>(props: {
    entityInfo: EntityInfo<E>;
    identifier: string;
    router: Router;
}) => React.JSX.Element;
