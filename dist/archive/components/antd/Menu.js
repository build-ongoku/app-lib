import { AppInfoContext } from '@ongoku/app-lib/src/archive/common/AppContext';
import { EntityListLink } from '@ongoku/app-lib/src/components/EntityLink';
import { Menu, Spin } from 'antd';
import React, { useContext } from 'react';
import { HeartOutlined } from '@ant-design/icons';
import { capitalCase } from 'change-case';
// MenuWrapper is the Menu component of the App. We're calling it MenuWrapper because Menu is an already defined component
// in the Antd library.
export var MenuWrapper = function (props) {
    var SubMenu = Menu.SubMenu;
    // Get Store from context
    var appInfo = useContext(AppInfoContext).appInfo;
    if (!appInfo) {
        return React.createElement(Spin, null);
    }
    // Services
    var serviceInfos = appInfo.getServiceInfos();
    var items = serviceInfos.map(function (svcInfo) {
        var _a;
        var entityInfos = svcInfo.entityInfos;
        var subItems = entityInfos.map(function (entityInfo) {
            return { key: "".concat(svcInfo.name, "-").concat(entityInfo.name), label: React.createElement(EntityListLink, { entityInfo: entityInfo }) };
        });
        var Icon = (_a = svcInfo.defaultIcon) !== null && _a !== void 0 ? _a : HeartOutlined;
        return { key: "".concat(svcInfo.name), label: capitalCase(svcInfo.name), title: capitalCase(svcInfo.name), icon: React.createElement(Icon, null), children: subItems };
    });
    return (React.createElement("div", null,
        React.createElement(Menu, { theme: "dark", defaultSelectedKeys: ['1'], mode: "inline", items: items })));
};
