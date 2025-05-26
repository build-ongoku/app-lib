import React from 'react';
import { EntityInfo, IEntityMinimal } from '../../core';
export declare const EntityList: <E extends IEntityMinimal>(props: {
    entityInfo: EntityInfo<E>;
}) => React.JSX.Element;
