import { Loader as LoaderMantine } from '@mantine/core';
import { CenterScreen } from '@ongoku/app-lib/src/components/CenterScreen';
import React from 'react';
export var ScreenLoader = function (props) {
    return (React.createElement(CenterScreen, null,
        React.createElement(LoaderMantine, { size: "xl", type: "bars" })));
};
