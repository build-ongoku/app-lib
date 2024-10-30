import { EntityMinimal } from '@ongoku/app-lib/src/archive/common/Entity';
import { TypeInfo, TypeMinimal } from '@ongoku/app-lib/src/archive/common/Type';
import { FormItemProps, InputNumberProps, InputProps, SwitchProps } from 'antd';
import { PickerDateProps, PickerTimeProps } from 'antd/lib/date-picker/generatePicker';
import React from 'react';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { FieldFormProps } from '@ongoku/app-lib/src/archive/components/Field';
export declare const combineFormItemName: (parentName: NamePath | undefined, currentName: string | number) => NamePath;
type NamePath = string | number | (string | number)[];
interface TypeFormItemsProps<T extends TypeMinimal> {
    typeInfo: TypeInfo<T>;
    parentItemName?: NamePath;
    formItemProps?: Partial<FormItemProps<T>>;
    noLabels?: boolean;
    usePlaceholders?: boolean;
}
export declare const TypeFormItems: <T extends TypeMinimal>(props: TypeFormItemsProps<T>) => React.JSX.Element;
export interface FormInputProps {
    formItemProps?: Partial<FormItemProps>;
    sharedInputProps?: LocalSharedInputProps;
    stringInputProps?: Partial<InputProps>;
    numberInputProps?: Partial<InputNumberProps>;
    switchProps?: Partial<SwitchProps>;
    datePickerProps?: PickerDateProps<any>;
    timePickerProps?: Omit<PickerTimeProps<any>, 'picker'> & React.RefAttributes<any>;
}
export interface LocalSharedInputProps {
    placeholder?: string;
    size?: SizeType;
}
export declare const DefaultInput: (props: FormInputProps) => React.JSX.Element;
export declare const StringInput: (props: FormInputProps) => React.JSX.Element;
export declare const NumberInput: (props: FormInputProps) => React.JSX.Element;
export declare const BooleanInput: (props: FormInputProps) => React.JSX.Element;
export declare const DateInput: (props: FormInputProps) => React.JSX.Element;
export declare const TimestampInput: (props: FormInputProps) => React.JSX.Element;
export declare const SelectInput: (props: React.PropsWithChildren<FormInputProps>) => React.JSX.Element;
export declare const ForeignEntitySelectInput: <FET extends EntityMinimal = any>(props: FieldFormProps & {
    mode?: "multiple" | "tags";
}) => React.JSX.Element;
export declare const getInputComponentWithRepetition: (InputComponent: React.ComponentType<FieldFormProps>) => React.ComponentType<FieldFormProps>;
export {};
