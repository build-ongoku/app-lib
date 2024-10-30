'use client';
import { Button } from '@mantine/core';
import { useAuth } from '@ongoku/app-lib/src/common/AuthContext';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
export var LogoutButton = function () {
    var _a = useState(false), loading = _a[0], setLoading = _a[1];
    var endSession = useAuth().endSession;
    var router = useRouter();
    return (React.createElement(Button, { loading: loading, className: "w-100", variant: "outline", size: "sm", onClick: function () {
            console.log('Logout');
            setLoading(true);
            endSession();
            router.push('/');
        } }, "Log out"));
};
