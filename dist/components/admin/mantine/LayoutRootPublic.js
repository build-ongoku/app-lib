import { useAuth } from '../../../common/AuthContext.js';
import { n as navigationExports } from '../../../_virtual/navigation.js';
import React__default, { useEffect } from 'react';
import { Container } from '../../../node_modules/@mantine/core/esm/components/Container/Container.js';
import { Image } from '../../../node_modules/@mantine/core/esm/components/Image/Image.js';
import { Title } from '../../../node_modules/@mantine/core/esm/components/Title/Title.js';

var LayoutRootPublic = function (_a) {
    var children = _a.children;
    var _b = useAuth(), session = _b.session, loadingSession = _b.loading;
    var router = navigationExports.useRouter();
    // Do not allow authenticated users to access this part of the app.
    useEffect(function () {
        if (!loadingSession && session) {
            console.log('[LayoutRootPublic] [useEffect] User is authenticated. Redirecting to dashboard...', 'session', session);
            router.push('/home');
        }
    }, [session]);
    return (React__default.createElement(Container, { className: "flex h-screen justify-center" },
        React__default.createElement("div", { className: "m-auto" },
            React__default.createElement(Image, { src: "/logo_1.png", alt: "OnGoku Logo", className: "m-auto", w: "auto", fit: "contain", height: 100 }),
            React__default.createElement(Title, { order: 1 },
                React__default.createElement("span", { className: "font-normal" }, "On"),
                "Goku")),
        React__default.createElement("div", { className: "m-auto" }, children)));
};

export { LayoutRootPublic };
