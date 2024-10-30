import { Email, ID } from '@ongoku/app-lib/src/common/scalars';
export declare enum Operator {
    EQUAL = "EQUAL",
    NOT_EQUAL = "NOT_EQUAL",
    IN = "IN",
    GREATER_THAN = "GREATER_THAN",
    GREATER_THAN_EQUAL = "GREATER_THAN_EQUAL",
    LESS_THAN = "LESS_THAN",
    LESS_THAN_EQUAL = "LESS_THAN_EQUAL",
    LIKE = "LIKE",
    ILIKE = "ILIKE",
    NOT_LIKE = "NOT_LIKE",
    IS_NULL = "IS_NULL",
    IS_NOT_NULL = "IS_NOT_NULL"
}
export interface GenericCondition<T> {
    op: Operator;
    values: T[];
}
export interface StringCondition extends GenericCondition<string> {
}
export interface NumberCondition extends GenericCondition<number> {
}
export interface FloatCondition extends GenericCondition<number> {
}
export interface BoolCondition extends GenericCondition<boolean> {
}
export interface DateCondition extends GenericCondition<Date> {
}
export interface TimestampCondition extends GenericCondition<Date> {
}
export interface IDCondition extends GenericCondition<ID> {
}
export interface EmailCondition extends GenericCondition<Email> {
}
