import { useGetEntity } from '@ongoku/app-lib/src/providers/provider';
import { EntityLink } from '../EntityLink';
import { Spin, Alert } from 'antd';
export var EntityLinkFromID = function (props) {
    var id = props.id, entityInfo = props.entityInfo;
    var _a = useGetEntity({ entityInfo: entityInfo, params: { id: id } })[0], loading = _a.loading, error = _a.error, entity = _a.data;
    if (loading) {
        return React.createElement(Spin, { size: "small" });
    }
    if (error) {
        return React.createElement(Alert, { message: error, type: "error" });
    }
    if (!entity) {
        return React.createElement(Alert, { message: "Panic! No entity data returned", type: "error" });
    }
    // Otherwise return a Table view
    return React.createElement(EntityLink, { entity: entity, entityInfo: entityInfo, text: props.text });
};
