/* * * * * *
 * App Context
 * * * * * */

import React, { use, useEffect, useState } from 'react'
import { App, AppReq, IApp } from './app_v3'
import { Loader } from '@mantine/core'

export interface IAppContext {
    appInfo: App | null
}

export const AppContext = React.createContext<IAppContext>({ appInfo: null })
AppContext.displayName = 'AppContext'

export const AppProvider = (props: { appReq: AppReq; applyOverrides?: (appInfo: App) => Promise<App>; children?: React.ReactNode }): React.ReactNode => {
    let _app = new App(props.appReq)
    const [app, setApp] = useState<App>(_app)
    const [processing, setProcessing] = useState(true)

    useEffect(() => {
        if (props.applyOverrides) {
            console.log('[AppProvider] Applying overrides...', 'appInfo', app)
            props
                .applyOverrides(app)
                .then((app) => {
                    setApp(app)
                })
                .catch((e) => {
                    const errMsg = '[AppProvider] Failed to apply entity overrides. There was an error.'
                    console.error(errMsg, 'error', e)
                    throw new Error(errMsg)
                })
            console.log('[AppProvider] Applied overrides!', 'appInfo', app)
        }
        if (processing) {
            setProcessing(false)
        }
    }, [props.appReq, props.applyOverrides])

    if (processing) {
        return <Loader size="xl" type="bars" />
    }

    console.log('[AppProvider] AppContext being created', 'appInfo', _app)

    return <AppContext.Provider value={{ appInfo: app }}> {props.children}</AppContext.Provider>
}
