'use client';
import { Button } from '@mantine/core';
import { useAuth } from '../../../common/AuthContext';
import React, { useState } from 'react';
export var LogoutButton = function (props) {
    var router = props.router;
    var _a = useState(false), loading = _a[0], setLoading = _a[1];
    var endSession = useAuth().endSession;
    return (React.createElement(Button, { loading: loading, className: "w-100", variant: "outline", size: "sm", onClick: function () {
            console.log('Logout');
            setLoading(true);
            endSession();
            router.push('/');
        } }, "Log out"));
};
