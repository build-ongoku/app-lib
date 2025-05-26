import { Loader as LoaderMantine } from '@mantine/core';
import React from 'react';
export var ScreenLoader = function (props) {
    return (React.createElement(LoaderMantine, { size: "xl", type: "bars" }));
};
