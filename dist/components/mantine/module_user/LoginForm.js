import { __awaiter, __assign, __generator } from '../../../_virtual/_tslib.js';
import { n as navigationExports } from '../../../_virtual/navigation.js';
import React__default from 'react';
import { useAuth } from '../../../common/AuthContext.js';
import { Form } from '../Form.js';
import { useForm } from '../../../node_modules/@mantine/form/esm/use-form.js';
import { Container } from '../../../node_modules/@mantine/core/esm/components/Container/Container.js';
import { Anchor } from '../../../node_modules/@mantine/core/esm/components/Anchor/Anchor.js';
import { TextInput } from '../../../node_modules/@mantine/core/esm/components/TextInput/TextInput.js';
import { PasswordInput } from '../../../node_modules/@mantine/core/esm/components/PasswordInput/PasswordInput.js';
import { isEmail } from '../../../node_modules/@mantine/form/esm/validators/is-email/is-email.js';

var LoginForm = function () {
    var router = navigationExports.useRouter();
    var authenticate = useAuth().authenticate;
    var form = useForm({
        mode: 'uncontrolled',
        validate: {
            // Commented out for DEV purposes
            email: isEmail('Please enter a valid email'),
        },
    });
    return (React__default.createElement(Container, { className: "w-96" },
        React__default.createElement(Form, { form: form, submitButtonText: "Continue", bottomExtra: React__default.createElement(Anchor, { className: "text-sm font-light", onClick: function () {
                    router.push('/register');
                } }, "Create an account."), postEndpoint: "/v1/auth/login", onSuccess: function (data) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!data.token) return [3 /*break*/, 2];
                            return [4 /*yield*/, authenticate(data.token)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                        case 2: throw new Error('Login call succeeded but no token was returned.');
                    }
                });
            }); }, redirectPath: "/home" },
            React__default.createElement(TextInput, __assign({ label: "Email", placeholder: "you@email.com", key: form.key('email') }, form.getInputProps('email'))),
            React__default.createElement(PasswordInput, __assign({ className: "", label: "Password", placeholder: "super-secret-password", key: form.key('password'), mt: "md" }, form.getInputProps('password'))))));
};

export { LoginForm };
