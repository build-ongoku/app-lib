import { Email, UUID } from 'goku.static/common/Primitives'

export enum Operator {
    EQUAL,
    NOT_EQUAL,
    IN,
    GREATER_THAN,
    GREATER_THAN_EQUAL,
    LESS_THAN,
    LESS_THAN_EQUAL,
    LIKE,
    ILIKE,
    NOT_LIKE,
    IS_NULL,
    IS_NOT_NULL,
}

export interface GenericCondition<T> {
    op: Operator
    values: T[]
}

export interface StringCondition extends GenericCondition<string> {}
export interface IntCondition extends GenericCondition<number> {}
export interface FloatCondition extends GenericCondition<number> {}
export interface BooleanCondition extends GenericCondition<boolean> {}
export interface DateCondition extends GenericCondition<Date> {}
export interface TimestampCondition extends GenericCondition<Date> {}
export interface UUIDCondition extends GenericCondition<UUID> {}
export interface EmailCondition extends GenericCondition<Email> {}
