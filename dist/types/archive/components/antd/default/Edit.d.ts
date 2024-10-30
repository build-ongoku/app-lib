import { EntityInfo, EntityMinimal } from '@ongoku/app-lib/src/archive/common/Entity';
import { UUID } from '@ongoku/app-lib/src/common/Primitives';
import React from 'react';
interface Props<E extends EntityMinimal> {
    entityInfo: EntityInfo<E>;
    objectId: UUID;
}
export declare const DefaultEditView: <E extends EntityMinimal>(props: Props<E>) => React.JSX.Element;
export {};
