'use client'

import { AppInfo } from 'goku.static/common/App'
import React from 'react'
import { ServiceInfoCommon } from 'goku.static/common/Service'
import { newAppInfo, serviceInfos, typeInfos } from 'goku.generated/types/types.generated'

interface AppInfoContectValue {
    appInfo: AppInfo<ServiceInfoCommon> | null
    loading: boolean
}

export const AppInfoContext = React.createContext<AppInfoContectValue>({ appInfo: null, loading: true })
AppInfoContext.displayName = 'AppInfoContext'

export const AppInfoProvider = (props: { children?: React.ReactNode }) => {
    const [appInfo, setAppInfo] = React.useState<AppInfo<ServiceInfoCommon> | null>(null)
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        console.log('Setting AppInfo')
        const _appInfo = newAppInfo()
        setAppInfo(_appInfo)
        console.log('AppInfo:', _appInfo)
        setLoading(false)
    }, [])

    return <AppInfoContext.Provider value={{ appInfo, loading }}> {props.children}</AppInfoContext.Provider>
}
