// getBaseURL returns the base URL for the backend API
// It does not add the version number.
// e.g. for DEV, it may return http://localhost:80/api/
var getBaseURL = function () {
    var _a;
    console.log('[Provider] [getBaseURL]', 'envVariables', process.env);
    // Host
    var host = process.env.GOKU_BACKEND_HOST;
    if (!host) {
        host = process.env.NEXT_PUBLIC_GOKU_BACKEND_HOST;
        console.debug('[Provider] [getBaseURL]', 'NEXT_PUBLIC_GOKU_BACKEND_HOST', host);
    }
    if (!host) {
        host = process.env.EXPO_PUBLIC_GOKU_BACKEND_HOST;
        console.debug('[Provider] [getBaseURL]', 'EXPO_PUBLIC_GOKU_BACKEND_HOST', host);
    }
    // Note: add any other specific environment variables name for the host here
    if (!host) {
        console.warn('[Provider] [getBaseURL] Host not set. Defaulting to localhost');
        host = 'localhost';
    }
    console.log('[Provider] [getBaseURL]', 'Host: ', host);
    // Protocol
    var protocol = process.env.GOKU_BACKEND_PROTOCOL;
    if (!protocol) {
        protocol = process.env.NEXT_PUBLIC_GOKU_BACKEND_PROTOCOL;
        console.debug('[Provider] [getBaseURL]', 'NEXT_PUBLIC_GOKU_BACKEND_PROTOCOL', protocol);
    }
    if (!protocol) {
        protocol = process.env.EXPO_PUBLIC_GOKU_BACKEND_PROTOCOL;
        console.debug('[Provider] [getBaseURL]', 'EXPO_PUBLIC_GOKU_BACKEND_PROTOCOL', protocol);
    }
    if (!protocol) {
        protocol = (_a = window === null || window === void 0 ? void 0 : window.location) === null || _a === void 0 ? void 0 : _a.protocol;
        console.debug('[Provider] [getBaseURL]', 'window.location.protocol', protocol);
        if (protocol) {
            console.log('[Provider] [getBaseURL] Setting protocol to window.location.protocol', protocol);
        }
    }
    if (!protocol) {
        protocol = 'https:';
        console.warn('[Provider] [getBaseURL] Protocol not set. Defaulting to https.');
    }
    // Todo: ensure protocol is valid
    if (protocol === 'http' || protocol === 'https') {
        protocol = protocol + ':';
    }
    if (protocol && protocol !== 'http:' && protocol !== 'https:') {
        console.warn('[Provider] [getBaseURL] Protocol is not `http:` or `https:`. Defaulting to https.');
        protocol = 'https:';
    }
    // Port
    var port = process.env.GOKU_BACKEND_PORT;
    if (!port) {
        port = process.env.NEXT_PUBLIC_GOKU_BACKEND_PORT;
        console.debug('[Provider] [getBaseURL]', 'NEXT_PUBLIC_GOKU_BACKEND_PORT', port);
    }
    if (!port) {
        port = process.env.EXPO_PUBLIC_GOKU_BACKEND_PORT;
        console.debug('[Provider] [getBaseURL]', 'EXPO_PUBLIC_GOKU_BACKEND_PORT', port);
    }
    if (!port) {
        console.warn('[Provider] [getBaseURL] Port not set. Leaving empty.');
    }
    var url = "".concat(protocol, "//").concat(host) + (port ? ":".concat(port) : '') + '/api';
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
