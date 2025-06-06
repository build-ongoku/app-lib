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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
import { addBaseURL, joinURL } from './util';
import { Namespace } from '../../core/namespace';
// makeRequest makes a vanilla fetch request
export var makeRequest = function (props) { return __awaiter(void 0, void 0, void 0, function () {
    var fullUrl, headers, req, urlParams, httpResp, err_1, errMsg, data, _a, data, err_2, errMsg;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.debug('[Provider] [makeRequest]', 'props', props);
                fullUrl = addBaseURL(props.relativePath);
                headers = new Headers();
                // Add authentciation token header if needed
                if (props.authToken) {
                    headers.set('Authorization', "Bearer ".concat(props.authToken));
                }
                req = {
                    method: props.method,
                    headers: headers,
                };
                // Set the request data load (body or URL params)
                if (props.method == 'GET' || props.method == 'DELETE') {
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
                    throw new Error('Ongoku Applib does not support the HTTP method: ' + props.method);
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, fetch(fullUrl, req)];
            case 2:
                httpResp = _b.sent();
                return [3 /*break*/, 4];
            case 3:
                err_1 = _b.sent();
                errMsg = 'Admin Tool could not communicate with the backend server. Are you sure the backend server is running? Please see the logs for more information.';
                console.error(errMsg);
                return [2 /*return*/, { error: errMsg, statusCode: 0 }]; // We don't know the status code because the request itself failed
            case 4:
                if (!!httpResp.ok) return [3 /*break*/, 8];
                _b.label = 5;
            case 5:
                _b.trys.push([5, 7, , 8]);
                return [4 /*yield*/, httpResp.json()];
            case 6:
                data = (_b.sent());
                return [2 /*return*/, data];
            case 7:
                _a = _b.sent();
                return [2 /*return*/, { error: 'Got a non-OK HTTP response', statusCode: httpResp.status }];
            case 8:
                _b.trys.push([8, 10, , 11]);
                return [4 /*yield*/, httpResp.json()];
            case 9:
                data = (_b.sent());
                return [2 /*return*/, data];
            case 10:
                err_2 = _b.sent();
                errMsg = 'Could not parse HTTP response to JSON: ' + err_2;
                console.error(errMsg);
                return [2 /*return*/, { error: errMsg, statusCode: httpResp.status }];
            case 11: return [2 /*return*/];
        }
    });
}); };
/* * * * * *
 * Add Entity
 * * * * * */
// Get the method and the relative path for adding an entity
export var getAddEntityMethodAndPath = function (nsReq) {
    // Validate props
    var ns = new Namespace(nsReq);
    if (!ns.isEntity()) {
        throw new Error('Expected namespace to be an entity namespace but is not');
    }
    return {
        method: 'POST',
        relPath: joinURL('v1/', ns.toURLPath()),
    };
};
export var addEntity = function (props) {
    // Get the method path to make the request
    var _a = getAddEntityMethodAndPath(props.entityNamespace), method = _a.method, relPath = _a.relPath;
    // Make the request
    return makeRequest({
        relativePath: relPath,
        method: method,
        data: props.data,
    });
};
/* * * * * *
 * Update Entity
 * * * * * */
// Get the method and the relative path for adding an entity
export var getUpdateEntityMethodAndPath = function (nsReq) {
    // Validate props
    var ns = new Namespace(nsReq);
    if (!ns.isEntity()) {
        throw new Error('Expected namespace to be an entity namespace but is not');
    }
    return {
        method: 'PUT',
        relPath: joinURL('v1/', ns.toURLPath()),
    };
};
/* * * * * *
 * Get Entity
 * * * * * */
export var getGetEntityMethodAndPath = function (nsReq) {
    // Validate props
    var ns = new Namespace(nsReq);
    if (!ns.isEntity()) {
        throw new Error('Expected namespace to be an entity namespace but is not');
    }
    return {
        method: 'GET',
        relPath: joinURL('v1/', ns.toURLPath()),
    };
};
export var getEntity = function (props) {
    // Get the method path to make the request
    var _a = getGetEntityMethodAndPath(props.entityNamespace), method = _a.method, relPath = _a.relPath;
    // Make the request
    return makeRequest({
        method: method,
        relativePath: relPath,
        data: props.data,
    });
};
/* * * * * *
 * List Entity
 * * * * * */
export var getListEntityMethodAndPath = function (nsReq) {
    // Validate props
    var ns = new Namespace(nsReq);
    if (!ns.isEntity()) {
        throw new Error('Expected namespace to be an entity namespace but is not');
    }
    return {
        method: 'GET',
        relPath: joinURL('v1/', ns.toURLPath(), 'list'),
    };
};
export var listEntity = function (props) {
    // Get the method path to make the request
    var _a = getListEntityMethodAndPath(props.entityNamespace), method = _a.method, relPath = _a.relPath;
    return makeRequest({
        method: method,
        relativePath: relPath,
        data: props.data,
    });
};
/* * * * * *
 * Query by Text V2
 * * * * * */
var getQueryByTextEntityMethodAndPath = function (nsReq) {
    // Validate props
    var ns = new Namespace(nsReq);
    if (!ns.isEntity()) {
        throw new Error('Expected namespace to be an entity namespace but is not');
    }
    return {
        method: 'GET',
        relPath: joinURL('v1/', ns.toURLPath(), 'query_by_text'),
    };
};
export var queryByTextEntity = function (props) {
    // Get the method path to make the request
    var _a = getQueryByTextEntityMethodAndPath(props.entityNamespace), method = _a.method, relPath = _a.relPath;
    // Make the request
    return makeRequest({
        method: method,
        relativePath: relPath,
        data: props.data,
    });
};
export var uploadFile = function (file, onProgress) { return __awaiter(void 0, void 0, void 0, function () {
    var fileEntityNamespace, relPath, fullUrl, headers, formData, response, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                fileEntityNamespace = new Namespace({ service: 'core' });
                relPath = joinURL('v1/', fileEntityNamespace.toURLPath(), 'file/upload');
                fullUrl = addBaseURL(relPath);
                headers = new Headers();
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
