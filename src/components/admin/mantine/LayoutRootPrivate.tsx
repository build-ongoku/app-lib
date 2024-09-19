'use client'

import { ScreenLoader } from '@ongoku/app-lib/src/components/admin/mantine/Loader'
import { useAuth } from '@ongoku/app-lib/src/common/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// LayoutRootPrivate handles the authentication logic for the private part of the app.
export const LayoutRootPrivate = (props: { children: React.ReactNode }) => {
    const router = useRouter()
    const [processing, setProcessing] = useState(true)
    const { session, loading: loadingSession } = useAuth()

    console.log('[LayoutRootPrivate]')

    // Do not allow unauthenticated users to access this part of the app.
    useEffect(() => {
        // Only run once session is loaded.
        if (loadingSession) {
            return
        }
        console.log('[LayoutRootPrivate] (useEffect): session loaded, checking...')
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
