import { useAuth } from '../../../common/AuthContext.js';
import { n as navigationExports } from '../../../_virtual/navigation.js';
import React__default, { useState } from 'react';
import { Button } from '../../../node_modules/@mantine/core/esm/components/Button/Button.js';

var LogoutButton = function () {
    var _a = useState(false), loading = _a[0], setLoading = _a[1];
    var endSession = useAuth().endSession;
    var router = navigationExports.useRouter();
    return (React__default.createElement(Button, { loading: loading, className: "w-100", variant: "outline", size: "sm", onClick: function () {
            console.log('Logout');
            setLoading(true);
            endSession();
            router.push('/');
        } }, "Log out"));
};

export { LogoutButton };
