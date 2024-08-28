import React from 'react'
import { ServiceInfoCommon } from 'goku.static/common/Service'

export const ServiceInfoContext = React.createContext<ServiceInfoCommon | null>(null)
ServiceInfoContext.displayName = 'ServiceInfoContext'
