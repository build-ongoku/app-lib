import { ITypeMinimal, TypeInfo } from '../../common/app_v3';
import { MetaFieldKeys } from '../../common/types';
import React from 'react';
interface TypeAddFormProps<T extends ITypeMinimal = any> {
    typeInfo: TypeInfo<T>;
    postEndpoint: string;
    key?: string;
    initialData?: Omit<T, MetaFieldKeys>;
    submitText?: string;
    redirectPath?: string;
}
export declare const TypeAddFormWrapper: <T extends ITypeMinimal = any, RespT = any>(props: TypeAddFormProps<T>) => React.JSX.Element;
export {};
