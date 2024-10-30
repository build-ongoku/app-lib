import React, { useEffect } from 'react';
import { useAuth } from '@ongoku/app-lib/src/common/AuthContext';
import { Link } from 'react-router-dom';
import { Spin } from 'antd';
export var LogoutPage = function (props) {
    var _a = useAuth(), session = _a.session, endSession = _a.endSession, loading = _a.loading;
    console.log('Logging out');
    useEffect(function () {
        if (session) {
            endSession();
        }
    }, [loading, session]);
    if (loading) {
        return React.createElement(Spin, null);
    }
    return React.createElement(Link, { to: "/" });
};
