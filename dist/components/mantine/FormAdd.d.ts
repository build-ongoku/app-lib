import { JsonInputProps, NumberInputProps, SelectProps, SwitchProps, TextInputProps, MultiSelectProps } from '@mantine/core';
import { DateInputProps, DateTimePickerProps } from '@mantine/dates';
import '@mantine/dates/styles.css';
import { UseFormReturnType } from '@mantine/form';
import { ITypeMinimal, TypeInfo, Dtype } from '../../common/app_v3';
import React from 'react';
import { Email, ID, Money } from '../../common/scalars';
import { MetaFieldKeys } from '../../common/types';
export declare const TypeAddForm: <T extends ITypeMinimal = any>(props: {
    typeInfo: TypeInfo<T>;
    form: UseFormReturnType<T>;
    parentIdentifier?: string;
    initialData?: T | Omit<T, MetaFieldKeys>;
}) => React.JSX.Element;
export declare const GenericDtypeInput: <T extends any>(props: {
    dtype: Dtype;
    identifier: string;
    label: string;
    form: UseFormReturnType<any>;
    initialData?: T;
    isRepeated?: boolean;
}) => React.JSX.Element;
interface InputProps<InternalPropsT = any, T = any> {
    internalProps?: Omit<InternalPropsT, 'label' | 'placeholder' | 'description' | 'key'>;
    form: UseFormReturnType<any>;
    identifier: string;
    label: string;
    placeholder: string;
    description?: string;
    initialValue?: T;
}
export declare const DefaultInput: <T extends any = any>(props: InputProps<never, T>) => React.JSX.Element;
export declare const StringInput: (props: InputProps<TextInputProps, string>) => React.JSX.Element;
export declare const NumberInput: (props: InputProps<NumberInputProps, number>) => React.JSX.Element;
export declare const BooleanInput: (props: InputProps<SwitchProps, boolean>) => React.JSX.Element;
export declare const DateInput: (props: InputProps<DateInputProps, Date>) => React.JSX.Element;
export declare const TimestampInput: (props: InputProps<DateTimePickerProps, Date>) => React.JSX.Element;
export declare const EmailInput: (props: InputProps<TextInputProps, Email>) => React.JSX.Element;
export declare const SelectOrMultiSelectInput: <T extends string>(props: InputProps<SelectProps | MultiSelectProps, T | T[]>) => React.JSX.Element;
export declare const MoneyInput: (props: InputProps<never, Money>) => React.JSX.Element;
export declare const GenericDataInput: <T extends any>(props: InputProps<never, T>) => React.JSX.Element;
export declare const JSONInput: <T extends any = any>(props: InputProps<JsonInputProps, T>) => React.JSX.Element;
export declare const FileInput: (props: InputProps<never, ID>) => React.JSX.Element;
export {};
