'use client';
import { Container } from '@mantine/core';
import React from 'react';
export var CenterScreen = function (props) {
    return (React.createElement(Container, { className: "flex flex-col items-center justify-center h-screen" },
        React.createElement("div", { className: "m-auto text-center" },
            React.createElement("center", null, props.children))));
};
