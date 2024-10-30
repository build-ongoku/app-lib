import * as scalars from '@ongoku/app-lib/src/common/scalars';
export interface MetaFields {
    id: scalars.ID;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
export interface MetaFieldWithParentID extends MetaFields {
    parentID: scalars.ID;
}
