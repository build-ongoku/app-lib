import React from 'react';
/**
 * Generic NavLink component to be styled by implementation
 */
export var NavLink = function (_a) {
    var href = _a.href, label = _a.label, isActive = _a.isActive, onClick = _a.onClick;
    return (React.createElement("a", { href: href, onClick: onClick, style: {
            fontWeight: isActive ? 'bold' : 'normal',
            borderBottom: isActive ? '2px solid currentColor' : 'none',
            textDecoration: 'none',
            cursor: 'pointer'
        } }, label));
};
/**
 * Framework-agnostic navbar component
 */
export var NavbarAuthenticatedV0 = function (props) {
    var authState = props.authState, currentPath = props.currentPath, navLinks = props.navLinks, LoginButton = props.LoginButton, LogoutButton = props.LogoutButton;
    var isAuthenticated = authState.isAuthenticated, user = authState.user;
    return (React.createElement("div", { style: {
            padding: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #eaeaea',
            backgroundColor: 'white',
            position: 'sticky',
            top: 0,
            zIndex: 10,
        } },
        React.createElement("div", { style: { display: 'flex', gap: '2rem' } }, navLinks.map(function (link) { return (React.createElement(NavLink, { key: link.href, href: link.href, label: link.label, isActive: currentPath === link.href })); })),
        React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '1rem' } }, isAuthenticated ? (React.createElement(React.Fragment, null,
            React.createElement("span", { style: { fontSize: '0.875rem' } },
                "Hello, ",
                (user === null || user === void 0 ? void 0 : user.given_name) || (user === null || user === void 0 ? void 0 : user.email)),
            LogoutButton)) : (LoginButton))));
};
