// Generic Types

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type MetaFields = 'id' | 'createdAt' | 'updatedAt' | 'createdByUserId' | 'updatedByUserId' | 'deletedAt' | 'createdByUser' | 'updatedByUser' | 'deletedByUser'

export type NewEntity<E> = Omit<E, MetaFields>
