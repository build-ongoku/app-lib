import { AppInfoContext, AppInfoProvider } from '@ongoku/app-lib/src/common/AppContext'
import { AuthProvider, useAuth } from '@ongoku/app-lib/src/common/AuthContext'
import { EntityInfo, EntityMinimal } from '@ongoku/app-lib/src/common/Entity'
import { ServiceInfoCommon } from '@ongoku/app-lib/src/common/Service'
import { ServiceInfoContext } from '@ongoku/app-lib/src/common/ServiceContext'
import { DefaultAddView } from '@ongoku/app-lib/src/components/antd/default/Add'
import { DefaultDetailView } from '@ongoku/app-lib/src/components/antd/default/Detail'
import { DefaultEditView } from '@ongoku/app-lib/src/components/antd/default/Edit'
import { DefaultListView } from '@ongoku/app-lib/src/components/antd/default/List'
import { AppHeader } from '@ongoku/app-lib/src/components/antd/AppHeader'
import { LoginPage } from '@ongoku/app-lib/src/components/antd/Login/Login'
import { LogoutPage } from '@ongoku/app-lib/src/components/antd/Logout/Logout'
import { MenuWrapper } from '@ongoku/app-lib/src/components/antd/Menu'
import { RegisterPage } from '@ongoku/app-lib/src/components/antd/Register/Register'
import { Layout, Spin } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom'
// import { applyEntityInfoOverrides } from 'overrides/'

export const GokuApp = () => {
    return (
        <div className="App">
            <AppContexted />
        </div>
    )
}

const AppContexted = (props: {}) => {
    return (
        <AuthProvider>
            <AppComponent />
        </AuthProvider>
    )
}

const AppComponent = () => {
    // Load Auth Session from local storage, upon loading
    const useAuthResp = useAuth()
    if (useAuthResp.loading) {
        return <Spin size="large" spinning />
    }

    if (!useAuthResp.loading) {
        return <Spin size="large" spinning />
    }

    let Component = UnauthenticatedApp
    if (useAuthResp.session) {
        Component = AuthenticatedApp
    }

    return <Component />
}

const UnauthenticatedApp = () => {
    console.log('Using unauthenticated app')
    return (
        <BrowserRouter basename="admin">
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    )
}

const AuthenticatedApp = (props = {}) => {
    // applyEntityInfoOverrides({ appInfo: appInfo })

    const { Header, Content, Footer, Sider } = Layout

    const [siderCollapsed, setSiderCollapsed] = useState<boolean>(false)

    return (
        <AppInfoProvider>
            <BrowserRouter basename="admin">
                <Layout style={{ minHeight: '100vh' }}>
                    <Sider width={250} collapsible collapsed={siderCollapsed} onCollapse={() => setSiderCollapsed(!siderCollapsed)}>
                        <div
                            className="logo"
                            style={{
                                height: '32px',
                                margin: '16px',
                                background: 'rgba(255, 255, 255, 0.3)',
                            }}
                        >
                            LOGO
                        </div>
                        <MenuWrapper />
                    </Sider>
                    <Layout className="site-layout">
                        <Header className="site-layout-background">
                            <AppHeader />
                        </Header>
                        <Content>
                            <Routes>
                                <Route path="/logout" element={<LogoutPage />} />
                                <Route path="/:serviceName/*" element={<ServiceRoutes />} />
                                <Route path="/" element={<Home />} />
                            </Routes>
                        </Content>
                        <Footer style={{ textAlign: 'center' }}>Made with &#10084; using goku</Footer>
                    </Layout>
                </Layout>
            </BrowserRouter>
        </AppInfoProvider>
    )
}

interface ServiceRoutesProps {
    children?: React.ReactNode
}

const ServiceRoutes: (props: ServiceRoutesProps) => JSX.Element = (props): JSX.Element => {
    const { serviceName } = useParams<{ serviceName: string }>()

    // Get Store from context
    const { appInfo } = useContext(AppInfoContext)

    if (!appInfo || !serviceName) {
        return <Spin />
    }

    const serviceInfo = appInfo.getServiceInfo(serviceName)

    console.log('ServiceRoutes: Service Name:', serviceInfo)

    if (!serviceInfo) {
        console.log(`Routes: Service ${serviceName} not recognized`)
        return <Navigate to="/" />
    }

    return (
        <ServiceInfoContext.Provider value={serviceInfo}>
            <Routes>
                <Route path={'/:entityName/*'} element={<EntityRoutes />} />
            </Routes>
        </ServiceInfoContext.Provider>
    )
}

interface EntityRoutesProps {
    children?: React.ReactNode
}

const EntityRoutes: (props: EntityRoutesProps) => JSX.Element = (props) => {
    const { entityName } = useParams<{ entityName: string }>()

    const [entityInfo, setEntityInfo] = useState<EntityInfo>()

    // Get Store from context
    const serviceInfo = useContext(ServiceInfoContext)
    if (!serviceInfo || !entityName) {
        return <Spin />
    }

    console.log('EntityRoutes: Entity Name:', entityName)

    useEffect(() => {
        const entityInfoL = serviceInfo.getEntityInfo(entityName)
        if (entityInfoL) {
            setEntityInfo(entityInfoL)
        }
    }, [entityName])

    if (!entityInfo) {
        return <Spin />
    }

    return (
        <Routes>
            {/* Add Entity */}
            <Route path={'/add'} element={<DefaultAddView entityInfo={entityInfo} />} />
            {/* List Entity */}
            <Route path={'/list'} element={<DefaultListView entityInfo={entityInfo} />} />
            {/* Detail + Edit View */}
            <Route path={'/:id/*'} element={<EntityInstanceRoutes entityInfo={entityInfo} serviceInfo={serviceInfo} />} />
        </Routes>
    )
}

// EntityInstanceRoutes are routes associated with a particular instance of an entity
const EntityInstanceRoutes = <E extends EntityMinimal = any>(props: { entityInfo: EntityInfo<E>; serviceInfo: ServiceInfoCommon }) => {
    const { entityInfo, serviceInfo } = props
    const { id } = useParams<{ id: string }>()
    if (!serviceInfo || !entityInfo || !id) {
        return <Spin />
    }

    return (
        <Routes>
            <Route path="/edit" element={<DefaultEditView entityInfo={entityInfo} objectId={id} />} />
            <Route path="" element={<DefaultDetailView entityInfo={entityInfo} objectId={id} />} />
        </Routes>
    )
}

const Home = () => {
    return (
        <header className="App-header">
            <p>
                Edit <code>src/App.tsx</code> and save to reload.
            </p>
            <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
                Learn React
            </a>
        </header>
    )
}
