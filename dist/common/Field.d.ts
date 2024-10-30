import * as scalars from './scalars';
export interface MetaFields {
    id: scalars.ID;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
export interface MetaFieldWithParentID extends MetaFields {
    parentID: scalars.ID;
}
