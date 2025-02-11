import { EntityInfo, IEntityMinimal } from '../common/app_v3';
import React from 'react';
interface EntityLinkProps<E extends IEntityMinimal> {
    entity: E;
    entityInfo: EntityInfo<E>;
    text?: JSX.Element;
}
export declare const Link: (props: {
    to: string;
    children: React.ReactNode;
}) => React.JSX.Element;
export declare const EntityLink: <E extends IEntityMinimal>(props: EntityLinkProps<E>) => JSX.Element;
export declare const EntityListLink: <E extends IEntityMinimal>(props: {
    entityInfo: EntityInfo<E>;
    text?: string;
}) => React.JSX.Element;
interface EntityAddLinkProps<E extends IEntityMinimal> {
    entityInfo: EntityInfo<E>;
    children: React.ReactElement;
}
export declare const EntityAddLink: <E extends IEntityMinimal>(props: EntityAddLinkProps<E>) => React.JSX.Element;
export declare const getEntityDetailPath: <E extends IEntityMinimal>(props: {
    entityInfo: EntityInfo<E>;
    entity: E;
}) => string;
export declare const getEntityListPath: <E extends IEntityMinimal>(entityInfo: EntityInfo<E>) => string;
export declare const getEntityAddPath: <E extends IEntityMinimal = IEntityMinimal>(entityInfo: EntityInfo<E>) => string;
export declare const getEntityEditPath: <E extends IEntityMinimal = IEntityMinimal>(props: {
    entityInfo: EntityInfo<E>;
    entity: E;
}) => string;
export declare const getEntityChatPath: <E extends IEntityMinimal = IEntityMinimal>(entityInfo: EntityInfo<E>) => string;
export {};
