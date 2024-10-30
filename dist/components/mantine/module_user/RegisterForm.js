import { __assign } from '../../../_virtual/_tslib.js';
import { useAuth } from '../../../common/AuthContext.js';
import { Form } from '../Form.js';
import { n as navigationExports } from '../../../_virtual/navigation.js';
import React__default from 'react';
import { useForm } from '../../../node_modules/@mantine/form/esm/use-form.js';
import { Container } from '../../../node_modules/@mantine/core/esm/components/Container/Container.js';
import { Anchor } from '../../../node_modules/@mantine/core/esm/components/Anchor/Anchor.js';
import { TextInput } from '../../../node_modules/@mantine/core/esm/components/TextInput/TextInput.js';
import { PasswordInput } from '../../../node_modules/@mantine/core/esm/components/PasswordInput/PasswordInput.js';

var RegisterForm = function (props) {
    var router = navigationExports.useRouter();
    var authenticate = useAuth().authenticate;
    var form = useForm({
        mode: 'uncontrolled',
        // initialValues: props.typeInfo.getEmptyInstance(),
        validate: {
            // Commented out for DEV purposes
            email: function (value) { return (/^\S+@\S+$/.test(value) ? null : 'Invalid email'); },
        },
    });
    return (React__default.createElement(Container, { className: "w-96" },
        React__default.createElement(Form, { form: form, postEndpoint: "/v1/register", submitButtonText: "Create Account", bottomExtra: React__default.createElement(Anchor, { className: "text-sm font-light", onClick: function () {
                    router.push('/login');
                } }, "Existing account?"), onSuccess: function (data) {
                if (data.token) {
                    authenticate(data.token);
                    return;
                }
                throw new Error('Login call succeeded but no token was returned.');
            }, redirectPath: "/dashboard" },
            React__default.createElement(TextInput, __assign({ label: "Email", placeholder: "you@email.com", key: form.key('email') }, form.getInputProps('email'))),
            React__default.createElement(PasswordInput, __assign({ className: "", label: "Password", placeholder: "super-secret-password", key: form.key('password'), mt: "md" }, form.getInputProps('password'))),
            React__default.createElement(TextInput, __assign({ label: "First Name", placeholder: "John", key: form.key('name.first_name') }, form.getInputProps('name.first_name'))),
            React__default.createElement(TextInput, __assign({ label: "Last Name", placeholder: "Doe", key: form.key('name.last_name') }, form.getInputProps('name.last_name'))))));
};

export { RegisterForm };
