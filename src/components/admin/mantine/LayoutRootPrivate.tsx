'use client'

import { useAuth } from '@ongoku/app-lib/src/common/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export const LayoutRootPrivate = (props: { children: React.ReactNode }) => {
    const router = useRouter()
    const { session, loading: loadingSession } = useAuth()

    // Do not allow unauthenticated users to access this part of the app.
    useEffect(() => {
        if (loadingSession === false && !session) {
            router.push('/login')
        }
    }, [])

    return <div>{props.children}</div>
}
