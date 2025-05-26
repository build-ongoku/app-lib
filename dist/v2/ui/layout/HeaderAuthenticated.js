"use client";
import React from 'react';
import { Burger, Group, UnstyledButton, Avatar, Text, Menu, rem, Divider } from '@mantine/core';
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs';
import { MdLogout, MdSettings, MdPerson } from 'react-icons/md';
import { SafeMantineProvider, useUIFramework } from '../../index-client';
export function HeaderAuthenticated(_a) {
    var opened = _a.opened, toggle = _a.toggle, user = _a.user;
    var LinkComponent = useUIFramework().LinkComponent;
    return (React.createElement(SafeMantineProvider, null,
        React.createElement(Group, { justify: "space-between", h: "100%", px: "md" },
            React.createElement(Group, null,
                React.createElement(Burger, { opened: opened, onClick: toggle, hiddenFrom: "sm", size: "sm" }),
                React.createElement(LinkComponent, { href: "/dashboard", style: { textDecoration: 'none', color: 'inherit' } },
                    React.createElement(Group, null,
                        React.createElement(Text, { fw: 700, size: "lg" }, "Ongoku Admin")))),
            user && (React.createElement(Menu, { width: 200, position: "bottom-end", withArrow: true, arrowPosition: "center" },
                React.createElement(Menu.Target, null,
                    React.createElement(UnstyledButton, null,
                        React.createElement(Group, { gap: "xs" },
                            React.createElement(Avatar, { src: user.picture || null, alt: user.given_name || "User", radius: "xl", size: "sm" }, user.given_name ? user.given_name[0] : "U"),
                            React.createElement("div", { style: { flex: 1 } },
                                React.createElement(Text, { size: "sm", fw: 500 },
                                    user.given_name,
                                    " ",
                                    user.family_name),
                                React.createElement(Text, { c: "dimmed", size: "xs" }, user.email))))),
                React.createElement(Menu.Dropdown, null,
                    React.createElement(Menu.Label, null, "Account"),
                    React.createElement(Menu.Item, { leftSection: React.createElement(MdPerson, { style: { width: rem(14), height: rem(14) } }), component: LinkComponent, href: "/profile" }, "Profile"),
                    React.createElement(Menu.Item, { leftSection: React.createElement(MdSettings, { style: { width: rem(14), height: rem(14) } }), component: LinkComponent, href: "/settings" }, "Settings"),
                    React.createElement(Divider, null),
                    React.createElement(LogoutLink, null,
                        React.createElement(Menu.Item, { leftSection: React.createElement(MdLogout, { style: { width: rem(14), height: rem(14) } }), color: "red" }, "Log out"))))))));
}
