export interface PrimaryNamespace<svcN = string | null, entN = string | null> {
    service: svcN;
    entity: entN;
}
export interface Namespace<svcN = string | null, entN = string | null, typN = string, enmN = string | null, mthdN = string | null> extends PrimaryNamespace<svcN, entN> {
    types: typN[];
    enum: enmN | null;
    method: mthdN | null;
}
export declare const toURL: (pns: PrimaryNamespace) => string;
