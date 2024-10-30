import { TypeMinimal, TypeInfo } from '@ongoku/app-lib/src/archive/common/Type';
export interface TypeDisplayProps<T extends TypeMinimal> {
    typeInfo: TypeInfo<T>;
    objectValue: T;
    showMetaFields?: boolean;
}
export declare const TypeDisplay: <T extends TypeMinimal>(props: TypeDisplayProps<T>) => import("react").JSX.Element;
