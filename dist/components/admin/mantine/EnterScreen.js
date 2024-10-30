import { __assign } from '../../../_virtual/_tslib.js';
import { useAuth } from '../../../common/AuthContext.js';
import { n as navigationExports } from '../../../_virtual/navigation.js';
import React__default, { useState } from 'react';
import { Container } from '../../../node_modules/@mantine/core/esm/components/Container/Container.js';
import { Image } from '../../../node_modules/@mantine/core/esm/components/Image/Image.js';
import { Title } from '../../../node_modules/@mantine/core/esm/components/Title/Title.js';
import { Button } from '../../../node_modules/@mantine/core/esm/components/Button/Button.js';

var EnterScreen = function (props) {
    return (React__default.createElement(Container, { className: "flex flex-col items-center justify-center h-screen" },
        React__default.createElement("div", { className: "m-auto text-center" },
            React__default.createElement("center", null,
                React__default.createElement(Image, { src: "/logo_1.png", alt: "OnGoku Logo", className: "m-auto", w: "auto", fit: "contain", height: 100 }),
                React__default.createElement(Title, { order: 1, className: "text-center" },
                    "Welcome to ",
                    props.appName,
                    " ",
                    React__default.createElement("span", { className: "font-normal" }, "on"),
                    "goku"),
                React__default.createElement("p", { className: "text-center" },
                    React__default.createElement(EnterButton, __assign({}, props)))))));
};
var EnterButton = function (props) {
    var router = navigationExports.useRouter();
    var _a = useState(false), loading = _a[0], setLoading = _a[1];
    var _b = useAuth(), session = _b.session, loadingSession = _b.loading;
    var redirectPath = loadingSession || !session ? props.unauthenticatedUserRedirectPath : props.authenticatedUserRedirectPath;
    return (React__default.createElement(React__default.Fragment, null,
        React__default.createElement(Button, { loading: loading, onClick: function () {
                setLoading(true);
                router.push(redirectPath);
            }, className: "m-auto" }, "Enter")));
};

export { EnterScreen };
