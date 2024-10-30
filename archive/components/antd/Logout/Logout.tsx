import React, { useEffect } from 'react'

import { useAuth } from '@ongoku/app-lib/src/common/AuthContext'
import { Link } from 'react-router-dom'
import { Spin } from 'antd'

export const LogoutPage = (props: {}) => {
    const { session, endSession, loading } = useAuth()
    console.log('Logging out')

    useEffect(() => {
        if (session) {
            endSession()
        }
    }, [loading, session])

    if (loading) {
        return <Spin />
    }

    return <Link to="/" />
}
