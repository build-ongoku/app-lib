'use client'

import { AppInfo } from '@/common/App'
import React from 'react'
import { ServiceInfo } from '@/common/Service'

interface AppInfoContectValue {
    appInfo: AppInfo | null
    loading: boolean
}

export const AppInfoContext = React.createContext<AppInfoContectValue>({ appInfo: null, loading: true })
AppInfoContext.displayName = 'AppInfoContext'

export const AppInfoProvider = (props: { newAppInfo: () => AppInfo; children?: React.ReactNode }) => {
    const [appInfo, setAppInfo] = React.useState<AppInfo | null>(null)
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        console.log('Setting AppInfo')
        const _appInfo = props.newAppInfo()
        setAppInfo(_appInfo)
        console.log('AppInfo:', _appInfo)
        setLoading(false)
    }, [])

    return <AppInfoContext.Provider value={{ appInfo, loading }}> {props.children}</AppInfoContext.Provider>
}
