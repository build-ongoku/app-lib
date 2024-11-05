import { UseFormReturnType } from '@mantine/form';
import React from 'react';
export declare const Form: <FormT extends Record<string, any>, RequestT = FormT, ResponseT = any>(props: {
    form: UseFormReturnType<FormT>;
    children: React.ReactNode;
    submitButtonText?: string;
    bottomExtra?: React.ReactNode;
    onSubmitTransformValues?: (values: FormT) => RequestT;
    postEndpoint: string;
    method?: "POST" | "GET" | "PUT" | "PATCH" | "DELETE";
    redirectPath?: string;
    onSuccess?: (data: ResponseT) => void;
    onError?: (error: string) => void;
}) => React.JSX.Element;
