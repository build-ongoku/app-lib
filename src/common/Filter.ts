import { Email, ID } from '@ongoku/app-lib/src/common/scalars'

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
export interface NumberCondition extends GenericCondition<number> {}
export interface FloatCondition extends GenericCondition<number> {}
export interface BooleanCondition extends GenericCondition<boolean> {}
export interface DateCondition extends GenericCondition<Date> {}
export interface TimeCondition extends GenericCondition<Date> {}
export interface IDCondition extends GenericCondition<ID> {}
export interface EmailCondition extends GenericCondition<Email> {}
