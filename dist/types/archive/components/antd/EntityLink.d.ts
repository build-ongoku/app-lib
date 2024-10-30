import { EntityInfo, EntityMinimal } from '@ongoku/app-lib/src/archive/common/Entity';
import { UUID } from '@ongoku/app-lib/src/common/Primitives';
interface EntityLinkFromIDProps<E extends EntityMinimal> {
    id: UUID;
    entityInfo: EntityInfo<E>;
    text?: JSX.Element;
}
export declare const EntityLinkFromID: <E extends EntityMinimal = any>(props: EntityLinkFromIDProps<E>) => import("react").JSX.Element;
export {};
