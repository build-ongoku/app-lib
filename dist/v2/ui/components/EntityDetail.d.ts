import { EntityInfo, IEntityMinimal } from '../../core';
import React from 'react';
/**
 * EntityDetail component displays the details of an entity
 */
export declare const EntityDetail: <E extends IEntityMinimal = IEntityMinimal>(props: {
    entityInfo: EntityInfo<E>;
    identifier: string;
}) => React.JSX.Element;
