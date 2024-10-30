var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { getSessionCookie } from '@ongoku/app-lib/src/common/AuthContext';
import { Namespace } from '@ongoku/app-lib/src/common/namespacev2';
import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
// getBaseURL returns the base URL for the backend API
// It does not add the version number.
// e.g. for DEV, it may return http://localhost:80/api/
var getBaseURL = function () {
    console.log('[Provider] [getBaseURL]', 'envVariables', process.env);
    var host = process.env.NEXT_PUBLIC_GOKU_BACKEND_HOST;
    var port = process.env.NEXT_PUBLIC_GOKU_BACKEND_PORT;
    if (!host) {
        console.error('[Provider] [getBaseURL] Host not set. Defaulting to localhost');
        host = 'localhost';
    }
    if (!port) {
        console.error('[Provider] [getBaseURL] Port not set. Defaulting to 80');
        port = '80';
    }
    return "http://".concat(host, ":").concat(port, "/api");
};
// addBaseURL adds the base URL to the path
var addBaseURL = function (path) {
    // remove any leading slash from the path
    if (path.startsWith('/')) {
        path = path.slice(1);
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
export var useAddEntity = function (props) {
    var entityInfo = props.entityInfo;
    console.log('Add Entity: ' + entityInfo.getName());
    var _a = useMakeRequest(__assign(__assign({}, props), { method: 'POST', path: joinURL('v1/', entityInfo.namespace.toURLPath()), data: props.data })), resp = _a[0], fetch = _a[1];
    useEffect(function () {
        fetch({});
    }, []);
    return [resp];
};
export var useUpdateEntity = function (props) {
    var _a, _b;
    var entityInfo = props.entityInfo;
    console.log('Update Entity: ' + entityInfo.getName());
    // fetch data from a url endpoint
    if (!((_a = props.data) === null || _a === void 0 ? void 0 : _a.object.id)) {
        throw new Error('Object ID not set');
    }
    var _c = useMakeRequest({
        method: 'PUT',
        path: joinURL('v1/', entityInfo.namespace.toURLPath(), (_b = props.data) === null || _b === void 0 ? void 0 : _b.object.id),
        data: props.data,
    }), resp = _c[0], fetch = _c[1];
    useEffect(function () {
        fetch({});
    }, [props.data]);
    return [resp];
};
export var useGetEntity = function (props) {
    var entityInfo = props.entityInfo, data = props.data;
    console.log('[Provider] [Get Entity]', 'Fetching entity', 'entityName', entityInfo.getName().toRaw(), 'id', data === null || data === void 0 ? void 0 : data.id);
    // fetch data from a url endpoint
    var _a = useMakeRequest({
        method: 'GET',
        path: joinURL('v1/', entityInfo.namespace.toURLPath()),
        params: { req: data },
    }), resp = _a[0], fetch = _a[1];
    useEffect(function () {
        fetch({});
    }, []);
    return [resp, fetch];
};
export var useListEntity = function (props) {
    var entityInfo = props.entityInfo;
    console.log('(provider) (List Entity) ' + entityInfo.getName());
    // fetch data from a url endpoint
    var _a = useMakeRequest({
        method: 'GET',
        path: joinURL('v1/', entityInfo.namespace.toURLPath(), 'list'),
        params: props.params, // can include any filters here
    }), resp = _a[0], fetch = _a[1];
    useEffect(function () {
        console.log("(provider) (List Entity) (".concat(entityInfo.getName(), ") Fetch"));
        fetch({});
    }, []);
    return [resp];
};
export var useListEntityByTextQuery = function (props) {
    var entityInfo = props.entityInfo;
    console.log('Query by Text Entity: ' + entityInfo.getName());
    // fetch data from a url endpoint
    return useMakeRequest({
        method: 'GET',
        path: joinURL('v1/', entityInfo.namespace.toURLPath(), 'query_by_text'),
        params: props.params,
    });
};
export var makeRequest = function (props) { return __awaiter(void 0, void 0, void 0, function () {
    var path, unauthenticated, config, session, url, result, err_1, errMsg, statusCode;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    return __generator(this, function (_l) {
        switch (_l.label) {
            case 0:
                path = props.path, unauthenticated = props.unauthenticated;
                config = __assign({}, props);
                // Add auth token
                if (!unauthenticated) {
                    session = getSessionCookie();
                    config.headers = (_a = config.headers) !== null && _a !== void 0 ? _a : {};
                    if (session === null || session === void 0 ? void 0 : session.token) {
                        config.headers['Authorization'] = 'Bearer ' + session.token;
                    }
                }
                url = addBaseURL(path);
                console.log('[HTTP] [useAxios]: Making an HTTP call', 'config', config, 'url', url);
                _l.label = 1;
            case 1:
                _l.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios.request(__assign({ url: url, 
                        // paramsSerializer: We need to be able to pass objects a param values in the URL, so need to implement our own params serializer
                        paramsSerializer: {
                            serialize: function (p) {
                                var urlP = new URLSearchParams(p);
                                Object.entries(p).forEach(function (_a) {
                                    var k = _a[0], v = _a[1];
                                    urlP.set(k, JSON.stringify(v));
                                });
                                var r = decodeURI(urlP.toString());
                                return r;
                            },
                        } }, config))];
            case 2:
                result = _l.sent();
                console.log('[HTTP] [useAxios] Request made', 'result', result);
                return [2 /*return*/, { data: (_b = result.data) === null || _b === void 0 ? void 0 : _b.data, statusCode: (_c = result.data) === null || _c === void 0 ? void 0 : _c.statusCode, error: (_d = result.data) === null || _d === void 0 ? void 0 : _d.error }];
            case 3:
                err_1 = _l.sent();
                errMsg = '';
                statusCode = 500;
                console.error(err_1);
                if (err_1 instanceof AxiosError) {
                    errMsg = (_g = (_f = (_e = err_1.response) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.error) !== null && _g !== void 0 ? _g : err_1.message;
                    statusCode = (_k = (_h = err_1.status) !== null && _h !== void 0 ? _h : (_j = err_1.response) === null || _j === void 0 ? void 0 : _j.status) !== null && _k !== void 0 ? _k : 500;
                }
                else if (err_1 instanceof Error) {
                    errMsg = err_1.message;
                }
                else {
                    errMsg = String(err_1);
                }
                if (config.errorCb) {
                    config.errorCb(errMsg);
                }
                return [2 /*return*/, { error: errMsg, statusCode: statusCode }];
            case 4: return [2 /*return*/];
        }
    });
}); };
// T is the response type and D is the request data type
export var useMakeRequest = function (props) {
    var _a = useState(), data = _a[0], setData = _a[1]; // response body
    var _b = useState(), error = _b[0], setError = _b[1];
    var _c = useState(false), loading = _c[0], setLoading = _c[1];
    var _d = useState(), statusCode = _d[0], setStatusCode = _d[1];
    var _e = useState(false), finished = _e[0], setFinished = _e[1];
    var fetch = function (fetchProps) { return __awaiter(void 0, void 0, void 0, function () {
        var finalConfig, resp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Whenever we fetch, we want to reset some values
                    if (!loading) {
                        setLoading(true);
                    }
                    if (finished) {
                        setFinished(false);
                    }
                    if (data) {
                        setData(undefined);
                    }
                    if (error) {
                        setError(undefined);
                    }
                    if (statusCode) {
                        setStatusCode(undefined);
                    }
                    finalConfig = __assign(__assign({}, props), fetchProps);
                    return [4 /*yield*/, makeRequest(finalConfig)];
                case 1:
                    resp = _a.sent();
                    setData(resp.data);
                    setError(resp.error);
                    setStatusCode(resp.statusCode);
                    setLoading(false);
                    setFinished(true);
                    return [2 /*return*/];
            }
        });
    }); };
    return [{ statusCode: statusCode, data: data, error: error, loading: loading, finished: finished }, fetch];
};
export var uploadFile = function (file, onProgress) { return __awaiter(void 0, void 0, void 0, function () {
    var fileEntityNamespace, relPath, fullUrl, session, headers, formData, response, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                fileEntityNamespace = new Namespace({ service: 'core' });
                relPath = joinURL('v1/', fileEntityNamespace.toURLPath(), 'file/upload');
                fullUrl = addBaseURL(relPath);
                session = getSessionCookie();
                headers = new Headers();
                if (session === null || session === void 0 ? void 0 : session.token) {
                    headers.append('Authorization', 'Bearer ' + session.token);
                }
                formData = new FormData();
                formData.append('file', file);
                return [4 /*yield*/, fetch(fullUrl, {
                        method: 'POST',
                        headers: headers, // No 'Content-Type' header here
                        body: formData,
                    })];
            case 1:
                response = _a.sent();
                if (!response.ok) {
                    return [2 /*return*/, { error: 'Failed to upload file', statusCode: response.status }];
                }
                return [4 /*yield*/, response.json()];
            case 2:
                data = (_a.sent());
                return [2 /*return*/, data];
        }
    });
}); };
// makeRequestV2 makes a vanilla fetch request
export var makeRequestV2 = function (props) { return __awaiter(void 0, void 0, void 0, function () {
    var fullUrl, headers, session, req, urlParams, httpResp, err_2, errMsg, data, err_3, errMsg;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.debug('[Provider] [makeRequestV2]', 'props', props);
                fullUrl = addBaseURL(props.relativePath);
                headers = new Headers();
                // Add authentciation token header if needed
                if (!props.unauthenticated) {
                    session = getSessionCookie();
                    if (session === null || session === void 0 ? void 0 : session.token) {
                        headers.append('Authorization', 'Bearer ' + session.token);
                    }
                }
                req = {
                    method: props.method,
                    headers: headers,
                };
                // For GET, add the req as URL param
                if (props.method == 'GET') {
                    urlParams = new URLSearchParams();
                    // Convert the data object to JSON and add it to the URL as 'req' param
                    urlParams.append('req', JSON.stringify(props.data));
                    fullUrl = fullUrl + '?' + urlParams.toString();
                }
                else if (props.method == 'POST' || props.method == 'PUT') {
                    // For POST, PUT requests, set the request body
                    req.body = JSON.stringify(props.data);
                }
                else {
                    // Unsupported method
                    throw new Error('Unsupported method: ' + props.method);
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, fetch(fullUrl, req)];
            case 2:
                httpResp = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                errMsg = 'Could not make the HTTP request: ' + err_2;
                console.error(errMsg);
                return [2 /*return*/, { error: errMsg, statusCode: 0 }]; // We don't know the status code because the request itself failed
            case 4:
                if (!httpResp.ok) {
                    return [2 /*return*/, { error: 'Got a non-OK HTTP response', statusCode: httpResp.status }];
                }
                _a.label = 5;
            case 5:
                _a.trys.push([5, 7, , 8]);
                return [4 /*yield*/, httpResp.json()];
            case 6:
                data = (_a.sent());
                return [2 /*return*/, data];
            case 7:
                err_3 = _a.sent();
                errMsg = 'Could not parse HTTP response to JSON: ' + err_3;
                console.error(errMsg);
                return [2 /*return*/, { error: errMsg, statusCode: httpResp.status }];
            case 8: return [2 /*return*/];
        }
    });
}); };
export var listEntityV2 = function (props) {
    // Get the path to make the request
    var path = joinURL('v1/', props.entityInfo.namespace.toURLPath(), 'list');
    // Make the request
    return makeRequestV2({
        relativePath: path,
        method: 'GET',
        data: props.data,
    });
};
export var useListEntityV2 = function (props) {
    var _a = useState(), resp = _a[0], setResp = _a[1];
    var _b = useState(true), loading = _b[0], setLoading = _b[1];
    useEffect(function () {
        console.log('[Provider] [useListEntityV2] Fetching list entity', 'entity', props.entityInfo.getName().toRaw());
        var resp = listEntityV2(props).then(function (r) {
            setResp(r);
            setLoading(false);
        });
    }, []);
    return [resp, loading];
};
export var queryByTextV2 = function (props) {
    // Get the path to make the request
    var path = joinURL('v1/', props.entityInfo.namespace.toURLPath(), 'query_by_text');
    // Make the request
    return makeRequestV2({
        relativePath: path,
        method: 'GET',
        data: props.data,
    });
};
export var useQueryByTextV2 = function (props) {
    var _a = useState(), resp = _a[0], setResp = _a[1];
    var _b = useState(true), loading = _b[0], setLoading = _b[1];
    var refetch = function () {
        setLoading(true);
        console.log('[Provider] [useQueryByTextV2] Fetching query by text list', 'entity', props.entityInfo.getName().toRaw());
        queryByTextV2(props).then(function (r) {
            setResp(r);
            setLoading(false);
        });
    };
    useEffect(function () {
        refetch();
    }, []);
    return [resp, loading, refetch];
};
