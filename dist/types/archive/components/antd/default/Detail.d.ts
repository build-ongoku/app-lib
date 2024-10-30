import { EntityInfo, EntityMinimal } from '@ongoku/app-lib/src/archive/common/Entity';
import { UUID } from '@ongoku/app-lib/src/common/Primitives';
import React from 'react';
interface Props<E extends EntityMinimal = any> {
    entityInfo: EntityInfo<E>;
    objectId: UUID;
}
export declare const DefaultDetailView: <E extends EntityMinimal = any>(props: Props<E>) => React.JSX.Element;
export {};
