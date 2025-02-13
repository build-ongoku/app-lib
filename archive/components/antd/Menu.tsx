import { AppInfoContext } from '@ongoku/app-lib/src/archive/common/AppContext'
import { EntityListLink } from '@ongoku/app-lib/src/components/EntityLink'
import { Menu, Spin } from 'antd'
import React, { useContext } from 'react'

import { HeartOutlined } from '@ant-design/icons'
import { capitalCase } from 'change-case'

// MenuWrapper is the Menu component of the App. We're calling it MenuWrapper because Menu is an already defined component
// in the Antd library.
export const MenuWrapper = (props: {}) => {
    const { SubMenu } = Menu
    // Get Store from context
    const { appInfo } = useContext(AppInfoContext)
    if (!appInfo) {
        return <Spin />
    }

    // Services
    const serviceInfos = appInfo.getServiceInfos()

    const items = serviceInfos.map((svcInfo) => {
        const entityInfos = svcInfo.entityInfos

        const subItems = entityInfos.map((entityInfo) => {
            return { key: `${svcInfo.name}-${entityInfo.name}`, label: <EntityListLink entityInfo={entityInfo} /> }
        })

        const Icon = svcInfo.defaultIcon ?? HeartOutlined
        return { key: `${svcInfo.name}`, label: capitalCase(svcInfo.name), title: capitalCase(svcInfo.name), icon: <Icon />, children: subItems }
    })
    return (
        <div>
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items}></Menu>
        </div>
    )
}
