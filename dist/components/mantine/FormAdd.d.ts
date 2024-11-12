import { JsonInputProps, NumberInputProps, SelectProps, SwitchProps, TextInputProps } from '@mantine/core';
import { DateInputProps, DateTimePickerProps } from '@mantine/dates';
import { UseFormReturnType } from '@mantine/form';
import { ITypeMinimal, TypeInfo, Dtype } from '../../common/app_v3';
import React from 'react';
export declare const TypeAddForm: <T extends ITypeMinimal = any>(props: {
    typeInfo: TypeInfo<T>;
    form: UseFormReturnType<T>;
    parentIdentifier?: string;
    initialData?: T;
}) => React.JSX.Element;
export declare const GenericDtypeInput: <T extends ITypeMinimal = any>(props: {
    dtype: Dtype;
    identifier: string;
    label: string;
    form: UseFormReturnType<T>;
    initialData?: T;
    isRepeated?: boolean;
}) => React.JSX.Element;
interface InputProps<T = any> {
    internalProps?: Omit<T, 'label' | 'placeholder' | 'description' | 'key'>;
    form: UseFormReturnType<any>;
    identifier: string;
    label: string;
    placeholder: string;
    description?: string;
    value?: string;
}
export declare const DefaultInput: (props: InputProps<never>) => React.JSX.Element;
export declare const StringInput: (props: InputProps<TextInputProps>) => React.JSX.Element;
export declare const NumberInput: (props: InputProps<NumberInputProps>) => React.JSX.Element;
export declare const BooleanInput: (props: InputProps<SwitchProps>) => React.JSX.Element;
export declare const DateInput: (props: InputProps<DateInputProps>) => React.JSX.Element;
export declare const TimestampInput: (props: InputProps<DateTimePickerProps>) => React.JSX.Element;
export declare const EmailInput: (props: InputProps<TextInputProps>) => React.JSX.Element;
export declare const MoneyInput: (props: InputProps<never>) => React.JSX.Element;
export declare const SelectInput: (props: InputProps<SelectProps>) => React.JSX.Element;
export declare const JSONInput: (props: InputProps<JsonInputProps>) => React.JSX.Element;
export declare const FileInput: (props: InputProps<never>) => React.JSX.Element;
export {};
