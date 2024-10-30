import { EntityInfo, EntityMinimal } from '@ongoku/app-lib/src/archive/common/Entity';
import { FieldInfo } from '@ongoku/app-lib/src/common/Field';
import React from 'react';
export interface FieldFormProps<FormInputPropsT = any> {
    formInputProps: FormInputPropsT;
    fieldInfo: FieldInfo;
}
export interface FieldKindUI {
    readonly name: string;
    getLabel: (props: FieldInfo) => JSX.Element;
    getLabelString: (props: FieldInfo) => string;
    getDisplayComponent: <E extends EntityMinimal>(fieldInfo: FieldInfo, entityInfo?: EntityInfo<E>) => React.ComponentType<DisplayProps>;
    getDisplayRepeatedComponent: (fieldInfo: FieldInfo) => React.ComponentType<DisplayProps>;
    getInputComponent: () => React.ComponentType<FieldFormProps>;
    getInputRepeatedComponent: () => React.ComponentType<FieldFormProps>;
}
export interface DisplayProps<T = any> {
    value?: T;
}
export declare const DefaultDisplay: <FT extends unknown>(props: DisplayProps<FT>) => React.JSX.Element;
export declare const ObjectDisplay: <FT extends Object>(props: DisplayProps<FT>) => React.JSX.Element;
export declare const StringDisplay: <FT extends string>(props: DisplayProps<FT>) => React.JSX.Element;
export declare const BooleanDisplay: <FT extends boolean>(props: DisplayProps<FT>) => React.JSX.Element;
export declare const DateDisplay: <FT extends Date>(props: DisplayProps<FT>) => React.JSX.Element;
export declare const TimestampDisplay: <FT extends Date>(props: DisplayProps<FT>) => React.JSX.Element;
export declare const RepeatedDisplay: <FT extends unknown>(props: {
    value: FT[];
    DisplayComponent: React.ComponentType<DisplayProps<FT>>;
}) => React.JSX.Element;
