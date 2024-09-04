import React from 'react'
import { ServiceInfo } from '@ongoku/app-lib/src/common/Service'

export const ServiceInfoContext = React.createContext<ServiceInfo | null>(null)
ServiceInfoContext.displayName = 'ServiceInfoContext'
