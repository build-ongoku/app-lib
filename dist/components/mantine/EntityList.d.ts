import 'mantine-react-table/styles.css';
import React from 'react';
import { EntityInfo, IEntityMinimal } from '../../common/app_v3';
import { ListEntityResponseData } from '../../providers/httpV2';
import { Router } from '../../common/types';
export declare const EntityListTable: <E extends IEntityMinimal>(props: {
    entityInfo: EntityInfo<E>;
    router: Router;
}) => React.JSX.Element;
export declare const EntityListTableInner: <E extends IEntityMinimal>(props: {
    entityInfo: EntityInfo<E>;
    data: ListEntityResponseData<E>;
}) => React.JSX.Element;
