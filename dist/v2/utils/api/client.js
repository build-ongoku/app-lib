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
import { useEffect, useState } from 'react';
import { getAddEntityMethodAndPath, getGetEntityMethodAndPath, getListEntityMethodAndPath, makeRequest } from './common';
import { useOngokuServerAuth } from '../../providers/OngokuServerAuthProvider';
// useMakeRequest is a hook that makes a request and returns the response.
export var useMakeRequest = function (props) {
    // Define states
    var _a = useState(), resp = _a[0], setResp = _a[1];
    var _b = useState(false), loading = _b[0], setLoading = _b[1];
    var _c = useState(), error = _c[0], setError = _c[1];
    var _d = useState(false), fetchDone = _d[0], setFetchDone = _d[1];
    // Get auth token
    var token = useOngokuServerAuth().token;
    // Define a fetch function
    var fetch = function (data) {
        console.log('[Provider] [useMakeRequest] Fetching', 'props', props);
        if (!loading) {
            setLoading(true);
        }
        // Ensure we have data
        var finalData = data !== null && data !== void 0 ? data : props.data;
        if (!finalData) {
            console.log('[Provider] [useMakeRequest] Data not set');
            throw new Error('Data not set');
        }
        // Create a copy of the props
        var finalProps = __assign(__assign({}, props), { data: finalData });
        if (token) {
            finalProps.authToken = token;
        }
        makeRequest(finalProps)
            .then(function (r) {
            setResp(r);
        })
            .catch(function (err) {
            setError(err);
        })
            .finally(function () {
            setLoading(false);
            if (!fetchDone) {
                setFetchDone(true);
            }
            setFetchDone(true);
        });
    };
    // Optionally, fetch at init
    useEffect(function () {
        if (props.skipFetchAtInit) {
            return;
        }
        console.log('[Provider] [useMakeRequest] useEffect(): fetch', 'props.data', props.data);
        fetch(props.data);
    }, []);
    var ret = { resp: resp, loading: loading, error: error, fetchDone: fetchDone, fetch: fetch };
    return ret;
};
/* * * * * *
 * Add Entity
 * * * * * */
export var useAddEntity = function (props) {
    // Get the method path to make the request
    var _a = getAddEntityMethodAndPath(props.entityNamespace), method = _a.method, relPath = _a.relPath;
    return useMakeRequest(__assign(__assign({}, props), { method: method, relativePath: relPath }));
};
/* * * * * *
 * Update Entity
 * * * * * */
/* * * * * *
 * Get Entity
 * * * * * */
export var useGetEntity = function (props) {
    // Get the method path to make the request
    var _a = getGetEntityMethodAndPath(props.entityNamespace), method = _a.method, relPath = _a.relPath;
    return useMakeRequest(__assign(__assign({}, props), { method: method, relativePath: relPath }));
};
/* * * * * *
 * List Entity
 * * * * * */
export var useListEntity = function (props) {
    // Get the method path to make the request
    var _a = getListEntityMethodAndPath(props.entityNamespace), method = _a.method, relPath = _a.relPath;
    return useMakeRequest(__assign(__assign({}, props), { method: method, relativePath: relPath }));
};
/* * * * * *
 * Query by Text V2
 * * * * * */
export var useQueryByTextEntity = function (props) {
    // Get the method path to make the request
    var _a = getListEntityMethodAndPath(props.entityNamespace), method = _a.method, relPath = _a.relPath;
    return useMakeRequest(__assign(__assign({}, props), { method: method, relativePath: relPath }));
};
