import { UseFormReturnType } from '@mantine/form';
import React from 'react';
import { Router } from '../../common/types';
export declare const discardableInputKey = "__og_discardable";
export declare const Form: <FormT extends Record<string, any>, ResponseT = any, RequestT = FormT>(props: {
    form: UseFormReturnType<FormT>;
    title?: string | React.ReactNode;
    children: React.ReactNode;
    submitButtonText?: string;
    bottomExtra?: React.ReactNode;
    onSubmitTransformValues?: (values: FormT) => RequestT;
    postEndpoint: string;
    method?: "POST" | "GET" | "PUT" | "PATCH" | "DELETE";
    redirectPath?: string;
    onSuccess?: (data: ResponseT) => void;
    onError?: (error: string) => void;
    onSuccessMessage?: (data: ResponseT) => string;
    router: Router;
}) => React.JSX.Element;
