import 'mantine-react-table/styles.css';
import React from 'react';
import { EntityInfo, IEntityMinimal } from '../../common/app_v3';
import { ListEntityResponseData } from '../../providers/httpV2';
export declare const EntityListTable: <E extends IEntityMinimal>(props: {
    entityInfo: EntityInfo<E>;
}) => React.JSX.Element;
export declare const EntityListTableInner: <E extends IEntityMinimal>(props: {
    entityInfo: EntityInfo<E>;
    data: ListEntityResponseData<E>;
}) => React.JSX.Element;
