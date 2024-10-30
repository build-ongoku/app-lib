// Generic Types

import { ITypeMinimal } from '@ongoku/app-lib/src/common/app_v3'

// Optional is a type that takes a type and makes the given keys optional
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// RequiredFields is a type that takes a type and makes the given keys required
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

// // PickAndRequired is a type that takes a type and picks the given keys and makes them required
// export type PickAndRequired<T, K extends keyof T> = Required<Pick<T, K>>

export type MetaFieldKeys = 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'

export interface MetaFields {
    id: string
    created_at: Date
    updated_at: Date
    deleted_at: Date | null
}

export type WithMetaFields<T = ITypeMinimal> = T & MetaFields

// TypeInputFromFull<T> is a type that takes a full type and removes the meta fields
export type TypeInputFromFull<T> = Omit<T, MetaFieldKeys>

export const convertFullTypeToInput = <T extends ITypeMinimal>(fullType: WithMetaFields<T>): T => {
    // remove the meta fields
    // const { id, created_at, updated_at, deleted_at, ...rest } = fullType
    return fullType as T
}

export const convertTypeToWithMeta = <T extends ITypeMinimal>(fullType: T): WithMetaFields<T> => {
    // add the meta fields
    const metaFields = {
        id: '',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
    }
    return { ...fullType, ...metaFields }
}
