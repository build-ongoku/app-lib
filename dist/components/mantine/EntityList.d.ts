import { EntityInfo, IEntityMinimal } from '../../common/app_v3';
import { ListEntityResponse } from '../../providers/provider';
import 'mantine-react-table/styles.css';
import React from 'react';
export declare const EntityListTable: <E extends IEntityMinimal>(props: {
    entityInfo: EntityInfo<E>;
}) => React.JSX.Element;
export declare const EntityListTableInner: <E extends IEntityMinimal>(props: {
    entityInfo: EntityInfo<E>;
    data: ListEntityResponse<E>;
}) => React.JSX.Element;
