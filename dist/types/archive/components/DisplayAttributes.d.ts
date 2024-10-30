import { EntityMinimal } from '@ongoku/app-lib/src/archive/common/Entity';
import { FieldInfo } from '@ongoku/app-lib/src/common/Field';
import { TypeMinimal } from '@ongoku/app-lib/src/archive/common/Type';
import React from 'react';
export interface FieldDisplayProps<T extends TypeMinimal> {
    fieldInfo: FieldInfo;
    objectValue: T;
    DisplayComponent: React.ComponentType<DisplayProps<any>>;
}
export declare const FieldDisplay: <T extends TypeMinimal | TypeMinimal[]>(props: FieldDisplayProps<T>) => React.JSX.Element;
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
export interface ForeignEntityFieldDisplayProps {
    fieldInfo: FieldInfo;
}
export declare const getForeignEntityFieldDisplayComponent: <ForeignEntityType extends EntityMinimal>(props: ForeignEntityFieldDisplayProps) => React.ComponentType<DisplayProps<any>>;
