import React__default from 'react';
import { Container } from '../node_modules/@mantine/core/esm/components/Container/Container.js';

var CenterScreen = function (props) {
    return (React__default.createElement(Container, { className: "flex flex-col items-center justify-center h-screen" },
        React__default.createElement("div", { className: "m-auto text-center" },
            React__default.createElement("center", null, props.children))));
};

export { CenterScreen };
