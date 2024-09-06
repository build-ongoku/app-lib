'use client'

import { ScreenLoader } from '@ongoku/app-lib/src/components/admin/mantine/Loader'
import { useAuth } from '@ongoku/app-lib/src/common/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export const LayoutRootPrivate = (props: { children: React.ReactNode }) => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const { session, loading: loadingSession } = useAuth()

    console.log('LayoutRootPrivate:', session, loadingSession)
    // Do not allow unauthenticated users to access this part of the app.
    useEffect(() => {
        console.log('LayoutRootPrivate: useEffect')
        if (loadingSession === false && !session) {
            setLoading(true)
            router.push('/login')
        }
    }, [session, loadingSession])

    if (loadingSession || loading || !session) {
        return <ScreenLoader />
    }
    return <div>{props.children}</div>
}
