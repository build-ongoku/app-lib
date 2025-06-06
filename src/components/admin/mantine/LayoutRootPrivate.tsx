'use client'

import { Router } from '../../../common/types'
import { useAuth } from '../../../common/AuthContext'
import { ScreenLoader } from './Loader'
import React, { useEffect, useState } from 'react'

// LayoutRootPrivate handles the authentication logic for the private part of the app.
export const LayoutRootPrivate = (props: { router: Router; children: React.ReactNode }) => {
    const { router } = props

    const [processing, setProcessing] = useState(true)
    const { session, loading: loadingSession } = useAuth()

    console.log('[LayoutRootPrivate] Rendering...')

    // Do not allow unauthenticated users to access this part of the app.
    useEffect(() => {
        // Only run once session is loaded.
        if (loadingSession) {
            return
        }
        console.log('[LayoutRootPrivate] [useEffect]: Session loaded, checking...', session)
        if (!session) {
            setProcessing(false)
            router.push('/login')
        } else {
            setProcessing(false)
        }
    }, [session, loadingSession])

    if (loadingSession || processing || !session) {
        return <ScreenLoader />
    }
    return <div>{props.children}</div>
}
