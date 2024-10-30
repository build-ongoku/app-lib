export interface NewEnumInfoProps<EN> {
    name: string;
    valuesInfo: EnumValueInfo<EN>[];
}
export declare class EnumInfo<EN> {
    readonly name: string;
    readonly valuesInfo: EnumValueInfo<EN>[];
    readonly valuesMap: {
        [key: number]: EN;
    };
    constructor(props: NewEnumInfoProps<EN>);
    getValue(id: number): EN;
    getEnumValueInfo(value: EN): EnumValueInfo<EN> | undefined;
}
export declare class EnumValueInfo<EN = string> {
    readonly id: number;
    readonly value: EN;
    readonly displayValue?: string;
    constructor(props: {
        id: number;
        value: EN;
        displayValue?: string;
    });
    getDisplayValue(): string;
}
