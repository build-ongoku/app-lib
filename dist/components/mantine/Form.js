'use client';
import { Alert, Box, Button, Paper, Stack } from '@mantine/core';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import { useMakeRequestV2 } from '../../providers/provider';
export var discardableInputKey = '__og_discardable';
export var Form = function (props) {
    var _a, _b;
    // Todo: remove dependency on next/navigation
    var router = useRouter();
    var _c = useState(false), processing = _c[0], setProcessing = _c[1];
    var _d = useState(), errMessage = _d[0], setErrMessage = _d[1];
    var makeResp = useMakeRequestV2({
        method: (_a = props.method) !== null && _a !== void 0 ? _a : 'POST',
        relativePath: props.postEndpoint,
        skipFetchAtInit: true,
    });
    console.log('[Form] Rendering...', 'response?', makeResp);
    // dummyAssert only changes the type
    var dummyAssert = function (values) {
        return values;
    };
    // standard transform that changes the FormT before processing
    var standardTransform = function (values) {
        // if the outside more key in the values is "discardableInputKey", simply return the value of it
        if (values[discardableInputKey]) {
            return values[discardableInputKey];
        }
        return values;
    };
    var handleSubmit = function (values) {
        console.log('[Form] [HandleSubmit]', 'values', values);
        setProcessing(true);
        var data;
        if (props.onSubmitTransformValues) {
            data = props.onSubmitTransformValues(values);
        }
        else {
            values = standardTransform(values);
            data = dummyAssert(values);
        }
        makeResp.fetch(data);
    };
    // Handle the fetch response
    useEffect(function () {
        var _a, _b, _c;
        // if haven't finished fetching,
        if (!makeResp.fetchDone || makeResp.loading) {
            return;
        }
        if (!processing) {
            setProcessing(true);
        }
        // Error (making the request)
        var err = (_a = makeResp.error) !== null && _a !== void 0 ? _a : (_b = makeResp.resp) === null || _b === void 0 ? void 0 : _b.error;
        if (err) {
            console.log('[Form] [useEffect] Form submission returned error', err);
            console.error('Error:', err);
            if (props.onError) {
                props.onError(err);
            }
            setErrMessage(err);
            setProcessing(false);
        }
        else if ((_c = makeResp.resp) === null || _c === void 0 ? void 0 : _c.data) {
            // Successful
            if (props.onSuccess) {
                props.onSuccess(makeResp.resp.data);
            }
            if (props.redirectPath) {
                console.log('[Form] [useEffect] props.redirectPath detected: Redirecting to', props.redirectPath);
                router.push(props.redirectPath);
            }
            else {
                setProcessing(false);
            }
        }
    }, [makeResp.resp]);
    return (React.createElement(Box, null,
        React.createElement(Paper, { p: 30, radius: "md" },
            React.createElement("form", { onSubmit: props.form.onSubmit(handleSubmit) },
                React.createElement(Stack, { gap: "lg" },
                    errMessage && React.createElement(Alert, { icon: React.createElement(FiAlertCircle, null) }, errMessage !== null && errMessage !== void 0 ? errMessage : "Our apologies. We could not complete the request. We're looking into it."),
                    props.children,
                    React.createElement(Button, { type: "submit", loading: makeResp.loading || processing }, (_b = props.submitButtonText) !== null && _b !== void 0 ? _b : 'Submit'),
                    props.bottomExtra)))));
};
