'use client';
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
import { Anchor, Container, PasswordInput, TextInput } from '@mantine/core';
import { isEmail, useForm } from '@mantine/form';
import React from 'react';
import { useAuth } from '../../../common/AuthContext';
import { Form } from '../Form';
export var LoginForm = function (props) {
    var router = props.router;
    var authenticate = useAuth().authenticate;
    var form = useForm({
        mode: 'uncontrolled',
        validate: {
            // Commented out for DEV purposes
            email: function (value) { return (isEmail(value) ? null : 'Invalid email'); },
        },
    });
    return (React.createElement(Container, { className: "w-96" },
        React.createElement(Form, { title: "Login", form: form, submitButtonText: "Continue", bottomExtra: React.createElement("div", { className: "flex justify-between w-full" },
                React.createElement(Anchor, { className: "text-sm font-light", onClick: function () {
                        router.push('/register');
                    } }, "Create an account"),
                React.createElement(Anchor, { className: "text-sm font-light", onClick: function () {
                        router.push('/password/forgot');
                    } }, "Forgot password")), postEndpoint: "/v1/auth/login", onSuccess: function (data) { return __awaiter(void 0, void 0, void 0, function () {
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
            }); }, redirectPath: "/home", router: router },
            React.createElement(TextInput, __assign({ label: "Email", placeholder: "you@email.com", key: form.key('email') }, form.getInputProps('email'))),
            React.createElement(PasswordInput, __assign({ className: "", label: "Password", placeholder: "super-secret-password", key: form.key('password'), mt: "md" }, form.getInputProps('password'))))));
};
