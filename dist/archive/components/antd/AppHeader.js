import { Col, Dropdown, Row, Space } from 'antd';
import { Link } from 'react-router-dom';
import { MenuOutlined } from '@ant-design/icons';
import React from 'react';
export var AppHeader = function (props) {
    var menuItems = [
        { key: '0', label: React.createElement(Link, { to: "/logout" }, "Logout") },
        { key: '1', label: React.createElement(Link, { to: "/" }, "Profile [todo]") },
    ];
    return (React.createElement(Row, null,
        React.createElement(Col, { span: 1, offset: 23 },
            React.createElement(Space, { align: "end", direction: "vertical", style: { width: '100%' } },
                React.createElement(Dropdown, { menu: { items: menuItems }, trigger: ['click'], placement: "bottomLeft" },
                    React.createElement(MenuOutlined, { style: { color: '#efefef', marginLeft: '10px' } }))))));
};
