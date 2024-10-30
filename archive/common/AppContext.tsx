'use client'

import { AppInfo, NewAppInfoReq } from '@ongoku/app-lib/src/archive/common/App'
import React from 'react'

interface AppInfoContectValue {
    appInfo: AppInfo | null
    loading: boolean
}

export const AppInfoContext = React.createContext<AppInfoContectValue>({ appInfo: null, loading: true })
AppInfoContext.displayName = 'AppInfoContext'

export const AppInfoProvider = (props: { newAppInfoReq: NewAppInfoReq; children?: React.ReactNode }) => {
    const [appInfo, setAppInfo] = React.useState<AppInfo | null>(null)
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        console.log('Setting AppInfo')
        const _appInfo = new AppInfo(props.newAppInfoReq)
        setAppInfo(_appInfo)
        console.log('AppInfo:', _appInfo)
        setLoading(false)
    }, [])

    return <AppInfoContext.Provider value={{ appInfo, loading }}> {props.children}</AppInfoContext.Provider>
}
