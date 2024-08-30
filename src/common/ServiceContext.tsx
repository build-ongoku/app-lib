import React from 'react'
import { ServiceInfo } from '@/common/Service'

export const ServiceInfoContext = React.createContext<ServiceInfo | null>(null)
ServiceInfoContext.displayName = 'ServiceInfoContext'
