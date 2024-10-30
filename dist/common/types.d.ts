import { ITypeMinimal } from './app_v3';
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type MetaFieldKeys = 'id' | 'createdAt' | 'updatedAt' | 'deletedAt';
export interface MetaFields {
    id: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}
export type WithMetaFields<T = ITypeMinimal> = T & MetaFields;
export type TypeInputFromFull<T> = Omit<T, MetaFieldKeys>;
export declare const convertFullTypeToInput: <T extends ITypeMinimal>(fullType: WithMetaFields<T>) => T;
export declare const convertTypeToWithMeta: <T extends ITypeMinimal>(fullType: T) => WithMetaFields<T>;
