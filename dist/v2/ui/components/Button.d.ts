import React from 'react';
type ButtonProps = {
    text: string;
    onClick?: () => void;
};
/**
 * A simple button component from app-lib-v2
 */
export declare const Button: ({ text, onClick }: ButtonProps) => React.JSX.Element;
export {};
