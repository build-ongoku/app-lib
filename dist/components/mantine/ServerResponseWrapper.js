import React__default from 'react';
import { ScreenLoader } from '../admin/mantine/Loader.js';
import { Alert } from '../../node_modules/@mantine/core/esm/components/Alert/Alert.js';

var ServerResponseWrapper = function (props) {
    if (props.loading) {
        return React__default.createElement(ScreenLoader, null);
    }
    if (props.error) {
        return React__default.createElement(Alert, { variant: "error" }, props.error);
    }
    return React__default.createElement(React__default.Fragment, null, props.children);
};

export { ServerResponseWrapper };
