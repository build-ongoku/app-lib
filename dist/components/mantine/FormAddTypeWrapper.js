import { AppContext } from '../../common/AppContextV3.js';
import { Form } from './Form.js';
import { TypeAddForm } from './FormAdd.js';
import { n as navigationExports } from '../../_virtual/navigation.js';
import React__default, { useContext } from 'react';
import { useForm } from '../../node_modules/@mantine/form/esm/use-form.js';

var TypeAddFormWrapper = function (props) {
    var typeInfo = props.typeInfo;
    var appInfo = useContext(AppContext).appInfo;
    if (!appInfo) {
        throw new Error('AppInfo not loaded');
    }
    var _a = React__default.useState(null), response = _a[0], setResponse = _a[1];
    var initialData = props.initialData || typeInfo.getEmptyObject(appInfo) || {};
    // Todo: remove dependency on next/navigation
    navigationExports.useRouter();
    var form = useForm({
        mode: 'uncontrolled',
        initialValues: initialData,
    });
    console.log('[TypeAddFormWrapper] Rendering...', 'typeInfo', typeInfo);
    return (React__default.createElement(Form, { form: form, submitButtonText: props.submitText, postEndpoint: props.postEndpoint, redirectPath: props.redirectPath, onSuccess: function (data) {
            console.log('[TypeAddFormWrapper] [onSuccess]', 'data', data);
            setResponse(data);
        } },
        React__default.createElement(TypeAddForm, { typeInfo: typeInfo, form: form }),
        response && React__default.createElement("pre", null, JSON.stringify(response, null, 2))));
};

export { TypeAddFormWrapper };
