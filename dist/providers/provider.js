// getBaseURL returns the base URL for the backend API
// It does not add the version number.
// e.g. for DEV, it may return http://localhost:80/api/
var getBaseURL = function () {
    var _a, _b;
    console.log('[Provider] [getBaseURL]', 'envVariables', process.env);
    var host = process.env.NEXT_PUBLIC_GOKU_BACKEND_HOST;
    var port = process.env.NEXT_PUBLIC_GOKU_BACKEND_PORT;
    var protocol = process.env.NEXT_PUBLIC_GOKU_BACKEND_PROTOCOL;
    if (!protocol) {
        // use the same protocol as the frontend
        if (typeof window === 'undefined') {
            console.warn('[Provider] [getBaseURL] Protocol not set. Defaulting to https:');
            protocol = 'https:';
        }
        else {
            protocol = (_b = (_a = window === null || window === void 0 ? void 0 : window.location) === null || _a === void 0 ? void 0 : _a.protocol) !== null && _b !== void 0 ? _b : 'https:';
            console.warn("[Provider] [getBaseURL] Protocol not set. Defaulting to window's protocol [".concat(protocol, "]"));
        }
    }
    if (protocol !== 'http:' && protocol !== 'https:') {
        console.warn("[Provider] [getBaseURL] Invalid protocol [".concat(protocol, "] (not \"http:\" or \"https:\"). Setting to window's protocol [").concat(window.location.protocol, "]"));
        protocol = window.location.protocol;
    }
    if (!host) {
        console.warn('[Provider] [getBaseURL] Host not set. Defaulting to localhost');
        host = 'localhost';
    }
    if (!port) {
        port = protocol === 'https:' ? '443' : '80';
        console.warn("[Provider] [getBaseURL] Port not set. Defaulting to [".concat(port, "]"));
    }
    var url = "".concat(protocol, "//").concat(host, ":").concat(port, "/api");
    console.log('[Provider] [getBaseURL]', 'url: ', url);
    return url;
};
// addBaseURL adds the base URL to the path
export var addBaseURL = function (path) {
    // remove any leading or trailing slashes
    if (path.startsWith('/')) {
        path = path.slice(1);
    }
    if (path.endsWith('/')) {
        path = path.slice(0, -1);
    }
    return getBaseURL() + '/' + path;
};
// joinURL takes a list of strings and joins them with a slash
export var joinURL = function () {
    var parts = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        parts[_i] = arguments[_i];
    }
    // Remove any leading or trailing slashes from each part
    parts = parts.map(function (p) { return p.replace(/^\/|\/$/g, ''); });
    return '/' + parts.join('/');
};
