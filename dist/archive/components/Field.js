import ReactJson from '@microlink/react-json-view';
import React from 'react';
export var DefaultDisplay = function (props) {
    return React.createElement(React.Fragment, null, props.value);
};
export var ObjectDisplay = function (props) {
    return React.createElement(ReactJson, { src: props.value });
};
export var StringDisplay = function (props) {
    return React.createElement(React.Fragment, null, props.value);
};
export var BooleanDisplay = function (props) {
    // TODO: Handle null
    return React.createElement(React.Fragment, null, props.value ? 'YES' : 'NO');
};
export var DateDisplay = function (props) {
    var d = new Date(props.value);
    return React.createElement(DefaultDisplay, { value: d.toDateString() });
};
export var TimestampDisplay = function (props) {
    if (!props.value) {
        return (React.createElement("span", null,
            React.createElement("i", null, "No Data")));
    }
    var d = new Date(props.value);
    return React.createElement(DefaultDisplay, { value: d.toUTCString() });
};
export var RepeatedDisplay = function (props) {
    return (React.createElement("div", null,
        React.createElement("div", null,
            "Repeated Display: ",
            props.value.length,
            " items"),
        React.createElement("span", null, JSON.stringify(props.value))));
};
