import { n as navigationExports } from '../../_virtual/navigation.js';
import React__default, { useState, useEffect } from 'react';
import { FiAlertCircle } from '../../node_modules/react-icons/fi/index.js';
import { useMakeRequest } from '../../providers/provider.js';
import { Box } from '../../node_modules/@mantine/core/esm/core/Box/Box.js';
import { Paper } from '../../node_modules/@mantine/core/esm/components/Paper/Paper.js';
import { Stack } from '../../node_modules/@mantine/core/esm/components/Stack/Stack.js';
import { Alert } from '../../node_modules/@mantine/core/esm/components/Alert/Alert.js';
import { Button } from '../../node_modules/@mantine/core/esm/components/Button/Button.js';

var Form = function (props) {
    var _a;
    // Todo: remove dependency on next/navigation
    var router = navigationExports.useRouter();
    var _b = useState(false), processing = _b[0], setProcessing = _b[1];
    var _c = useState(), errMessage = _c[0], setErrMessage = _c[1];
    var _d = useMakeRequest({
        method: 'POST',
        path: props.postEndpoint,
    }), resp = _d[0], fetch = _d[1];
    console.log('[Form] Rendering...', 'response?', resp);
    // Default transform function for type assertion
    var dummyTransform = function (values) {
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
            data = dummyTransform(values);
        }
        fetch({ data: data });
    };
    // Handle the fetch response
    useEffect(function () {
        // if haven't finished fetching,
        if (!resp.finished || resp.loading) {
            return;
        }
        if (!processing) {
            setProcessing(true);
        }
        // Error
        if (resp.error) {
            console.log('[Form] [useEffect] Form submission returned error', resp.error);
            console.error('Error:', resp.error);
            if (props.onError) {
                props.onError(resp.error);
            }
            setErrMessage(resp.error);
            setProcessing(false);
        }
        else if (!resp.error && !resp.loading && resp.data) {
            // Successful
            if (props.onSuccess) {
                props.onSuccess(resp.data);
            }
            if (props.redirectPath) {
                console.log('[Form] [useEffect] props.redirectPath detected: Redirecting to', props.redirectPath);
                router.push(props.redirectPath);
            }
            else {
                setProcessing(false);
            }
        }
    }, [resp]);
    return (React__default.createElement(Box, null,
        React__default.createElement(Paper, { p: 30, radius: "md" },
            React__default.createElement("form", { onSubmit: props.form.onSubmit(handleSubmit) },
                React__default.createElement(Stack, { gap: "lg" },
                    resp.error && React__default.createElement(Alert, { icon: React__default.createElement(FiAlertCircle, null) }, errMessage !== null && errMessage !== void 0 ? errMessage : "Our apologies. We could not complete the request. We're looking into it."),
                    props.children,
                    React__default.createElement(Button, { type: "submit", loading: resp.loading || processing }, (_a = props.submitButtonText) !== null && _a !== void 0 ? _a : 'Submit'),
                    props.bottomExtra)))));
};

export { Form };
