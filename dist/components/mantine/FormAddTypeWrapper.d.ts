import { Dtype, ITypeMinimal, TypeInfo } from '../../common/app_v3';
import { MetaFieldKeys } from '../../common/types';
import { Router } from '../../common/types';
import React from 'react';
export declare const DtypeFormWrapper: <T = any, RespT = any>(props: {
    dtype: Dtype<T>;
    postEndpoint: string;
    method: "POST" | "GET" | "PUT" | "PATCH" | "DELETE";
    key?: string;
    initialData?: Omit<T, MetaFieldKeys>;
    submitText?: string;
    redirectPath?: string;
    label?: string;
    router: Router;
}) => React.JSX.Element;
interface TypeAddFormProps<T extends ITypeMinimal = any> {
    typeInfo: TypeInfo<T>;
    postEndpoint: string;
    key?: string;
    initialData?: Omit<T, MetaFieldKeys>;
    submitText?: string;
    redirectPath?: string;
    router: Router;
}
export declare const TypeAddFormWrapper: <T extends ITypeMinimal = any, RespT = any>(props: TypeAddFormProps<T>) => React.JSX.Element;
export {};
