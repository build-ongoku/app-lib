import { EntityInfo, EntityMinimal } from '@ongoku/app-lib/src/archive/common/Entity';
import React from 'react';
interface Props<E extends EntityMinimal> {
    entityInfo: EntityInfo<E>;
}
export declare const DefaultListView: <E extends EntityMinimal, EFilter>({ entityInfo }: Props<E>) => React.JSX.Element;
export {};
